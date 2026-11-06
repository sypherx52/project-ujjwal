import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, HeartHandshake, Lightbulb, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mission")({
  head: () => ({
    meta: [
      { title: "Our Mission — Project Ujjwal" },
      {
        name: "description",
        content:
          "Why SD CodeCraft Club is lighting the campus of Sanatan Dharma College, Ambala Cantt., one correct answer at a time.",
      },
      { property: "og:title", content: "Our Mission — Project UJJWAL" },
      {
        property: "og:description",
        content:
          "One campus. One thousand diyas. One correct answer at a time.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MissionPage,
});

const PILLARS = [
  {
    icon: Lightbulb,
    title: "Learn by lighting",
    text: "Every correct answer on our Diwali quiz lights one more diya on the shared campus. Knowledge becomes something you can actually see glow.",
  },
  {
    icon: Users,
    title: "One shared celebration",
    text: "No one lights the campus alone. Every student, teacher and visitor adds to the same sky — progress is saved on the backend and shared across every device in real time.",
  },
  {
    icon: HeartHandshake,
    title: "Rooted in tradition",
    text: "From rangoli to the Ramayana's homecoming lamps, our traditions page keeps the why behind the festival alive for a new generation.",
  },
  {
    icon: Sparkles,
    title: "Built by students",
    text: "Designed and coded end to end by the SD CodeCraft Club — proof that our college community can ship things that feel magical.",
  },
];

function MissionPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-14">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
        <Flame className="h-7 w-7 text-primary" />
      </span>
      <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
        Our mission
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Project UJJWAL is the SD CodeCraft Club's Diwali gift to Sanatan
        Dharma College, Ambala Cantt. — a living campus that brightens as our
        community learns, celebrates and lights it together.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.title}
            className="card-glow rounded-2xl border border-border bg-card/60 p-6"
          >
            <pillar.icon className="mb-3 h-6 w-6 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              {pillar.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {pillar.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild className="gap-2">
          <Link to="/quiz">
            <Flame className="h-4 w-4" /> Light a diya now
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link to="/about">About the club</Link>
        </Button>
      </div>
    </main>
  );
}
