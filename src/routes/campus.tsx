import { createFileRoute, Link } from "@tanstack/react-router";
import { CampusScene } from "@/components/campus-scene";
import { useCampusStats } from "@/hooks/use-campus";
import { computeIllumination, LEVEL_NAMES, LEVEL_THRESHOLDS } from "@/lib/illumination";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles, Trophy } from "lucide-react";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/campus")({
  head: () => ({
    meta: [
      { title: "Virtual Campus — Project Ujjwal" },
      {
        name: "description",
        content:
          "Watch the shared virtual campus of Sanatan Dharma College, Ambala Cantt. glow brighter with every correct Diwali quiz answer.",
      },
      { property: "og:title", content: "Virtual Campus — Project Ujjwal" },
      {
        property: "og:description",
        content: "One shared campus, lit diya by diya as the college answers together.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampusPage,
});

function CampusPage() {
  const stats = useCampusStats();
  const data = stats.data;
  const diyas = data?.total_diyas ?? 0;
  const milestone = data?.milestone ?? 100;
  const illumination = computeIllumination(diyas, milestone);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-champagne">
          <Sparkles className="h-3.5 w-3.5" /> Live from Ambala Cantt.
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          The Virtual Campus
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          This is our shared celebration: every correct answer from any student,
          teacher or guest lights one more diya here, for everyone to see, in
          real time.
        </p>
      </div>

      {stats.isLoading ? (
        <div className="card-glow flex h-[520px] items-center justify-center rounded-3xl border border-border bg-card text-muted-foreground">
          Warming up the campus lamps…
        </div>
      ) : stats.isError ? (
        <div className="card-glow rounded-3xl border border-destructive/40 bg-card p-10 text-center">
          <p className="text-destructive">The campus scene could not load.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => stats.refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <CampusScene
          warmth={illumination.warmth}
          level={illumination.level}
          diyas={diyas}
          milestone={milestone}
          className="h-[520px] w-full sm:h-[600px]"
        />
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="gap-2">
          <Link to="/quiz">
            <Flame className="h-5 w-5" /> Light a diya — play the quiz
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="gap-2">
          <Link to="/leaderboard">
            <Trophy className="h-5 w-5" /> Leaderboard
          </Link>
        </Button>
      </div>

      {/* Milestone journey */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-foreground">
          The journey to Grand Illumination
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEVEL_NAMES.map((name, i) => {
            const reached = illumination.level >= i;
            const threshold = i === 0 ? 0 : LEVEL_THRESHOLDS[i - 1];
            return (
              <li
                key={name}
                className={`rounded-2xl border p-4 ${
                  reached
                    ? "border-primary/50 bg-primary/10"
                    : "border-border bg-card/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`font-display font-semibold ${
                      reached ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {i}. {name}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {threshold === 0 ? "start" : `${threshold}+ diyas`}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {i === 0
                    ? "The campus waits in warm twilight."
                    : reached
                      ? "Lit and glowing on campus right now."
                      : "Waiting for more diyas…"}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Recent activity */}
      <section className="mt-10 rounded-2xl border border-border bg-card/50 p-6">
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
          Diyas just lit
        </h2>
        {data?.recent?.length ? (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.recent.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2"
              >
                <Flame className="h-4 w-4 shrink-0 text-ember" />
                <span className="truncate text-sm font-medium text-foreground">
                  {entry.display_name}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {timeAgo(entry.created_at)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No diyas yet tonight.{" "}
            <Link to="/quiz" className="text-primary underline">
              Be the first to light one
            </Link>
            .
          </p>
        )}
      </section>
    </main>
  );
}
