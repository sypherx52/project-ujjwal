import { createFileRoute, Link } from "@tanstack/react-router";
import { CampusScene } from "@/components/campus-scene";
import { useCampusStats } from "@/hooks/use-campus";
import { computeIllumination } from "@/lib/illumination";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Sparkles,
  Trophy,
  Image as ImageIcon,
  Heart,
} from "lucide-react";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "SDC Ujjwal — Light Up SD College, One Answer at a Time",
      },
      {
        name: "description",
        content:
          "Answer Diwali quiz questions to light diyas across a shared virtual campus of SD College, Ambala Cantt. A celebration by the SD CodeCraft Club.",
      },
      {
        property: "og:title",
        content: "SDC Ujjwal — Light Up SD College",
      },
      {
        property: "og:description",
        content:
          "Every correct answer lights one diya on our shared virtual campus. Join the Diwali celebration by the SD CodeCraft Club.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function StatTile({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/70 px-4 py-3 text-center">
      <p className="font-display text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Index() {
  const stats = useCampusStats();
  const data = stats.data;
  const diyas = data?.total_diyas ?? 0;
  const milestone = data?.milestone ?? 100;
  const illumination = computeIllumination(diyas, milestone);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-10">
      {/* Hero */}
      <section className="grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-14">
        <div className="animate-rise">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-champagne">
            <Sparkles className="h-3.5 w-3.5" /> Diwali 2026 · SD CodeCraft
            Club
          </p>

          <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Light up SD College,{" "}
            <span className="text-glow-gold text-primary">
              one answer at a time
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
            Our campus begins in soft twilight. Every correct answer in the
            Diwali quiz lights one diya — and the whole college glows a little
            warmer, together, in real time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/quiz">
                <Flame className="h-5 w-5" /> Play &amp; light a diya
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/campus">
                <Sparkles className="h-5 w-5" /> View the campus
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile value={diyas} label="Diyas lit" />
            <StatTile value={milestone} label="Grand goal" />
            <StatTile
              value={data?.participants_total ?? "—"}
              label="Participants"
            />
            <StatTile
              value={data?.correct_answers ?? "—"}
              label="Correct answers"
            />
          </div>
        </div>

        <div className="animate-rise">
          <CampusScene
            warmth={illumination.warmth}
            level={illumination.level}
            diyas={diyas}
            milestone={milestone}
            className="h-[380px] w-full sm:h-[460px]"
          />

          <p className="mt-2 text-center text-xs text-muted-foreground">
            Live campus —{" "}
            {illumination.progress < 1
              ? `${Math.round(illumination.progress * 100)}% to Grand Illumination`
              : "Grand Illumination reached!"}
          </p>
        </div>
      </section>

      {/* SD CodeCraft introduction */}
      <section className="card-glow mt-6 overflow-hidden rounded-2xl border border-primary/20 bg-card/60">
        <div className="px-6 pt-8 text-center sm:px-10 sm:pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            The people behind the celebration
          </p>

          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Developed by SD CodeCraft
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Built with creativity, collaboration and a little festive magic
            by the student developer community of SD College.
          </p>
        </div>

        <div className="px-4 py-6 sm:px-8 sm:py-8">
          <div className="overflow-hidden rounded-xl border border-primary/20 bg-background/50">
            <img
  src="/images/codecraft.gif"
  alt="SD CodeCraft Club team"
  className="max-h-600px w-full object-cover"
  loading="lazy"
/>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            The team behind SDC Ujjwal
          </p>
        </div>

        <div className="border-t border-border/60 bg-primary/5 px-6 py-7 text-center sm:py-9">
          <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">
            Happy Diwali from all of us! 🪔
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            May this festival bring happiness, knowledge and new beginnings
            to everyone in our college community.
          </p>
        </div>
      </section>

      {/* Recent contributions */}
      <section className="mt-10 rounded-2xl border border-border bg-card/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Recently lit diyas
          </h2>

          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/leaderboard">
              <Trophy className="h-4 w-4" /> Leaderboard
            </Link>
          </Button>
        </div>

        {data?.recent?.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {data.recent.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2"
              >
                <Flame className="h-4 w-4 shrink-0 text-ember" />

                <span className="truncate text-sm font-medium text-foreground">
                  {entry.display_name}
                </span>

                <span className="ml-auto whitespace-nowrap text-xs text-muted-foreground">
                  {timeAgo(entry.created_at)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No diyas yet — be the first to light one.{" "}
            <Link to="/quiz" className="text-primary underline">
              Start the quiz
            </Link>
          </p>
        )}
      </section>

      {/* How it works */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Flame,
            title: "1 · Join the quiz",
            text: "Enter your name — no account needed. Students, teachers and guests all play.",
          },
          {
            icon: Sparkles,
            title: "2 · Light a diya",
            text: "Each correct answer lights one unique diya on the shared campus scene.",
          },
          {
            icon: Heart,
            title: "3 · Glow together",
            text: "Watch the whole college warm up live as everyone's diyas add up to 100.",
          },
        ].map((step) => (
          <div
            key={step.title}
            className="rounded-2xl border border-border bg-card/50 p-5"
          >
            <step.icon className="mb-3 h-6 w-6 text-primary" />

            <h3 className="font-display text-lg font-semibold text-foreground">
              {step.title}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
          </div>
        ))}
      </section>

      {/* Explore strip */}
      <section className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild variant="secondary" className="gap-2">
          <Link to="/gallery">
            <ImageIcon className="h-4 w-4" /> Festival gallery
          </Link>
        </Button>

        <Button asChild variant="secondary" className="gap-2">
          <Link to="/wish">
            <Heart className="h-4 w-4" /> Make a wish card
          </Link>
        </Button>

        <Button asChild variant="secondary" className="gap-2">
          <Link to="/mission">
            <Sparkles className="h-4 w-4" /> Our mission
          </Link>
        </Button>
      </section>
            {/* Bottom Diwali GIF */}
      <section className="mt-12 mb-6">
        <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card/50">
          <img
            src="/images/sdc.gif"
            alt="Happy Diwali celebration"
            className="block w-full h-auto"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}