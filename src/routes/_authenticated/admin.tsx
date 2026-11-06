import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/lib/auth-store";
import { useCampusStats } from "@/hooks/use-campus";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Project Ujjwal" },
      { name: "description", content: "Manage questions, milestone and participants." },
      { property: "og:title", content: "Admin Dashboard — Project Ujjwal" },
      { property: "og:description", content: "Club admin tools for the festival site." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AdminPage,
});

type QuestionRow = Database["public"]["Tables"]["quiz_questions"]["Row"];
type ParticipantRow = Database["public"]["Tables"]["participants"]["Row"];

const EMPTY_FORM = {
  question_text: "",
  options: ["", "", "", ""],
  correct_index: 0,
  category: "Diwali",
  difficulty: "easy",
  hint: "",
  explanation: "",
};

function AdminPage() {
  const { isAdmin, ready } = useAuthState();
  const stats = useCampusStats();

  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [milestone, setMilestone] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [renaming, setRenaming] = useState<{ id: string; value: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [q, p, s] = await Promise.all([
        supabase.from("quiz_questions").select("*").order("created_at", { ascending: false }),
        supabase.from("participants").select("*").order("created_at", { ascending: false }).limit(30),
        supabase.from("campus_settings").select("*").eq("id", 1).single(),
      ]);
      if (q.error) throw q.error;
      if (p.error) throw p.error;
      if (s.error) throw s.error;
      setQuestions(q.data ?? []);
      setParticipants(p.data ?? []);
      setMilestone(String(s.data?.milestone_diyas ?? 100));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready && isAdmin) void load();
  }, [ready, isAdmin, load]);

  if (!ready) {
    return <main className="mx-auto max-w-4xl px-4 py-16 text-muted-foreground">Checking your access…</main>;
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Shield className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <h1 className="font-display text-2xl font-bold text-foreground">Admin access only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is for SD CodeCraft Club admins. Ask a club admin to grant
          your account the admin role.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/">Back to the celebration</Link>
        </Button>
      </main>
    );
  }

  const saveMilestone = async () => {
    const value = Number(milestone);
    if (!Number.isFinite(value) || value < 1) {
      toast.error("Milestone must be a positive number");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("campus_settings")
      .update({ milestone_diyas: Math.floor(value) })
      .eq("id", 1);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Grand goal is now ${Math.floor(value)} diyas`);
      void stats.refetch();
    }
  };

  const addQuestion = async () => {
    const options = form.options.map((o) => o.trim()).filter(Boolean);
    if (!form.question_text.trim() || options.length < 2) {
      toast.error("A question needs text and at least two options");
      return;
    }
    if (form.correct_index >= options.length) {
      toast.error("Pick a correct option that exists");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("quiz_questions").insert({
      question_text: form.question_text.trim(),
      options,
      correct_index: form.correct_index,
      category: form.category.trim() || "Diwali",
      difficulty: form.difficulty,
      hint: form.hint.trim(),
      explanation: form.explanation.trim() || "Correct answer highlighted above.",
      is_active: true,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Question added to the quiz");
    setForm(EMPTY_FORM);
    void load();
  };

  const toggleActive = async (q: QuestionRow) => {
    const { error } = await supabase
      .from("quiz_questions")
      .update({ is_active: !q.is_active })
      .eq("id", q.id);
    if (error) toast.error(error.message);
    else void load();
  };

  const deleteQuestion = async (q: QuestionRow) => {
    if (!window.confirm(`Delete “${q.question_text.slice(0, 60)}”?`)) return;
    const { error } = await supabase.from("quiz_questions").delete().eq("id", q.id);
    if (error) {
      toast.error(
        "This question already has answers, so it cannot be deleted — switch it off instead.",
      );
      return;
    }
    toast.success("Question deleted");
    void load();
  };

  const saveRename = async () => {
    if (!renaming) return;
    const clean = renaming.value.trim().replace(/[<>]/g, "").slice(0, 40);
    if (!clean) return;
    setBusy(true);
    const { error } = await supabase
      .from("participants")
      .update({ display_name: clean })
      .eq("id", renaming.id);
    setBusy(false);
    setRenaming(null);
    if (error) toast.error(error.message);
    else {
      toast.success("Name updated");
      void load();
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            SD CodeCraft Club controls for the Ujjwal festival.
          </p>
        </div>
      </div>

      {loadError ? (
        <div className="card-glow rounded-2xl border border-destructive/40 bg-card p-8 text-center">
          <p className="text-destructive">{loadError}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      ) : null}

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { value: stats.data?.total_diyas ?? "—", label: "Diyas lit" },
          { value: stats.data?.participants_total ?? "—", label: "Participants" },
          { value: stats.data?.correct_answers ?? "—", label: "Correct answers" },
          { value: questions.length, label: "Questions (all)" },
        ].map((tile) => (
          <div key={tile.label} className="rounded-xl border border-border bg-card/70 px-4 py-3 text-center">
            <p className="font-display text-2xl font-bold text-primary">{tile.value}</p>
            <p className="text-xs text-muted-foreground">{tile.label}</p>
          </div>
        ))}
      </section>

      {/* Milestone */}
      <section className="card-glow mt-8 rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Grand goal (milestone)</h2>
        <div className="mt-3 flex max-w-md items-end gap-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor="milestone">Diyas needed for Grand Illumination</Label>
            <Input
              id="milestone"
              type="number"
              min={1}
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
            />
          </div>
          <Button onClick={saveMilestone} disabled={busy}>
            Save
          </Button>
        </div>
      </section>

      {/* Add question */}
      <section className="card-glow mt-8 rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Add a question</h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="q-text">Question</Label>
            <Textarea
              id="q-text"
              rows={2}
              value={form.question_text}
              onChange={(e) => setForm({ ...form, question_text: e.target.value })}
              placeholder="Which festival is known as the Festival of Lights?"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {form.options.map((option, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct-option"
                  checked={form.correct_index === i}
                  onChange={() => setForm({ ...form, correct_index: i })}
                  aria-label={`Mark option ${i + 1} correct`}
                  className="accent-[--color-primary]"
                />
                <Input
                  value={option}
                  onChange={(e) => {
                    const options = [...form.options];
                    options[i] = e.target.value;
                    setForm({ ...form, options });
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}${i === 0 ? " (radio marks the correct one)" : ""}`}
                />
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="q-category">Category</Label>
              <Input
                id="q-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-difficulty">Difficulty</Label>
              <select
                id="q-difficulty"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="q-hint">Hint</Label>
              <Input
                id="q-hint"
                value={form.hint}
                onChange={(e) => setForm({ ...form, hint: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-explanation">Explanation</Label>
              <Input
                id="q-explanation"
                value={form.explanation}
                onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addQuestion} disabled={busy} className="gap-2">
            <Plus className="h-4 w-4" /> Add question
          </Button>
        </div>
      </section>

      {/* Question list */}
      <section className="card-glow mt-8 rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Question bank ({questions.length})
        </h2>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading questions…</p>
        ) : questions.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No questions yet — add the first one above.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {questions.map((q) => {
              const options = Array.isArray(q.options) ? (q.options as string[]) : [];
              return (
                <li
                  key={q.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {q.question_text}
                  </span>
                  <Badge variant="outline" className="capitalize">
                    {q.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {q.is_active ? "Active" : "Off"}
                    </span>
                    <Switch checked={q.is_active} onCheckedChange={() => void toggleActive(q)} />
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Delete question" onClick={() => void deleteQuestion(q)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Only active questions appear in the quiz. Questions that already have
          answers cannot be deleted — switch them off instead.
        </p>
      </section>

      {/* Participants */}
      <section className="card-glow mt-8 rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Recent participants ({participants.length})
        </h2>
        {participants.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No participants yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {participants.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2"
              >
                {renaming?.id === p.id ? (
                  <>
                    <Input
                      value={renaming.value}
                      onChange={(e) => setRenaming({ id: p.id, value: e.target.value })}
                      className="max-w-xs"
                    />
                    <Button size="sm" onClick={saveRename} disabled={busy}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRenaming(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {p.display_name}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {p.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{timeAgo(p.created_at)}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRenaming({ id: p.id, value: p.display_name })}
                    >
                      Rename
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Moderation: rename any participant whose name breaks the festive spirit.
        </p>
      </section>
    </main>
  );
}
