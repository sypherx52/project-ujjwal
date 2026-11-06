create type public.participant_role as enum ('student', 'teacher', 'guest');

create table public.campus_settings (
  id int primary key default 1 check (id = 1),
  milestone_diyas int not null default 100 check (milestone_diyas between 1 and 100000),
  updated_at timestamptz not null default now()
);

create table public.participants (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 40),
  role public.participant_role not null default 'guest',
  created_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  difficulty text not null default 'easy' check (difficulty in ('easy','medium','hard')),
  question_text text not null,
  options jsonb not null check (jsonb_array_length(options) = 4),
  correct_index int not null check (correct_index >= 0 and correct_index <= 3),
  explanation text not null default '',
  hint text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index quiz_attempts_participant_idx on public.quiz_attempts(participant_id);

create table public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  selected_index int not null check (selected_index >= 0 and selected_index <= 3),
  is_correct boolean not null,
  created_at timestamptz not null default now()
);
create unique index quiz_answers_first_correct_uq
  on public.quiz_answers(participant_id, question_id) where is_correct;
create index quiz_answers_participant_idx on public.quiz_answers(participant_id);

create table public.diya_contributions (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (participant_id, question_id)
);
create index diya_contributions_created_idx on public.diya_contributions(created_at desc);

create type public.app_role as enum ('admin');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create or replace function public.submit_quiz_answer(
  p_participant_id uuid,
  p_question_id uuid,
  p_selected_index int
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  q public.quiz_questions%rowtype;
  answer_id uuid;
  contribution_id uuid;
  v_correct boolean;
  v_diyas int;
  v_milestone int;
begin
  if p_selected_index is null or p_selected_index < 0 or p_selected_index > 3 then
    return json_build_object('status', 'error', 'message', 'Invalid answer');
  end if;
  if not exists (select 1 from public.participants where id = p_participant_id) then
    return json_build_object('status', 'error', 'message', 'Unknown participant');
  end if;
  select * into q from public.quiz_questions where id = p_question_id and is_active;
  if not found then
    return json_build_object('status', 'error', 'message', 'Question unavailable');
  end if;

  insert into public.quiz_attempts(participant_id, question_id)
    values (p_participant_id, p_question_id);

  v_correct := (q.correct_index = p_selected_index);

  if not v_correct then
    insert into public.quiz_answers(participant_id, question_id, selected_index, is_correct)
      values (p_participant_id, p_question_id, p_selected_index, false);
    return json_build_object('status', 'incorrect', 'hint', q.hint, 'correct_index', q.correct_index, 'explanation', q.explanation);
  end if;

  insert into public.quiz_answers(participant_id, question_id, selected_index, is_correct)
    values (p_participant_id, p_question_id, p_selected_index, true)
    on conflict (participant_id, question_id) where is_correct do nothing
    returning id into answer_id;

  if answer_id is null then
    select count(*) into v_diyas from public.diya_contributions;
    select milestone_diyas into v_milestone from public.campus_settings where id = 1;
    return json_build_object('status', 'already_lit', 'correct_index', q.correct_index, 'explanation', q.explanation, 'total_diyas', v_diyas, 'milestone', v_milestone);
  end if;

  insert into public.diya_contributions(participant_id, question_id)
    values (p_participant_id, p_question_id)
    on conflict (participant_id, question_id) do nothing
    returning id into contribution_id;

  select count(*) into v_diyas from public.diya_contributions;
  select milestone_diyas into v_milestone from public.campus_settings where id = 1;

  return json_build_object(
    'status', case when contribution_id is null then 'already_lit' else 'lit' end,
    'correct_index', q.correct_index,
    'explanation', q.explanation,
    'total_diyas', v_diyas,
    'milestone', v_milestone
  );
end;
$$;

create or replace function public.get_campus_stats()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'total_diyas', (select count(*) from public.diya_contributions),
    'milestone', (select milestone_diyas from public.campus_settings where id = 1),
    'participants_total', (select count(*) from public.participants),
    'students', (select count(*) from public.participants where role = 'student'),
    'teachers', (select count(*) from public.participants where role = 'teacher'),
    'correct_answers', (select count(*) from public.quiz_answers where is_correct),
    'recent', (
      select coalesce(json_agg(row_to_json(r)), '[]'::json) from (
        select c.id, p.display_name, p.role, c.created_at
        from public.diya_contributions c
        join public.participants p on p.id = c.participant_id
        order by c.created_at desc
        limit 8
      ) r
    )
  );
$$;

create or replace function public.get_leaderboard()
returns json
language sql
stable
security definer
set search_path = public
as $$
  with scores as (
    select p.id, p.display_name, p.role,
      count(distinct c.id) as diyas,
      min(c.created_at) as first_light
    from public.participants p
    join public.diya_contributions c on c.participant_id = p.id
    group by p.id
  )
  select json_build_object(
    'overall', (
      select coalesce(json_agg(row_to_json(r)), '[]'::json) from (
        select id, display_name, role, diyas from scores
        order by diyas desc, first_light asc limit 50
      ) r
    ),
    'students', (
      select coalesce(json_agg(row_to_json(r)), '[]'::json) from (
        select id, display_name, diyas from scores where role = 'student'
        order by diyas desc, first_light asc limit 50
      ) r
    ),
    'teachers', (
      select coalesce(json_agg(row_to_json(r)), '[]'::json) from (
        select id, display_name, diyas from scores where role = 'teacher'
        order by diyas desc, first_light asc limit 50
      ) r
    )
  );
$$;

grant select on public.campus_settings to anon, authenticated;
grant all on public.campus_settings to service_role;

grant select (id, display_name, role, created_at) on public.participants to anon, authenticated;
grant insert (display_name, role) on public.participants to anon;
grant all on public.participants to service_role;

grant select (id, category, difficulty, question_text, options, hint, is_active, created_at) on public.quiz_questions to anon, authenticated;
grant all on public.quiz_questions to service_role;

grant all on public.quiz_attempts to service_role;
grant all on public.quiz_answers to service_role;

grant select (id, participant_id, question_id, created_at) on public.diya_contributions to anon, authenticated;
grant all on public.diya_contributions to service_role;

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

grant execute on function public.submit_quiz_answer(uuid, uuid, int) to anon, authenticated;
grant execute on function public.get_campus_stats() to anon, authenticated;
grant execute on function public.get_leaderboard() to anon, authenticated;

alter table public.campus_settings enable row level security;
create policy "campus settings are publicly readable" on public.campus_settings for select using (true);

alter table public.participants enable row level security;
create policy "participants are publicly readable" on public.participants for select using (true);
create policy "anyone can join as a participant" on public.participants for insert to anon with check (char_length(btrim(display_name)) between 1 and 40);

alter table public.quiz_questions enable row level security;
create policy "active questions are publicly readable" on public.quiz_questions for select using (is_active);

alter table public.quiz_attempts enable row level security;

alter table public.quiz_answers enable row level security;

alter table public.diya_contributions enable row level security;
create policy "contributions are publicly readable" on public.diya_contributions for select using (true);

alter table public.user_roles enable row level security;
create policy "users can read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

alter publication supabase_realtime add table public.diya_contributions;