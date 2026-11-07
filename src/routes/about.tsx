import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Flame,
  GraduationCap,
  Heart,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SDC Ujjwal" },
      {
        name: "description",
        content:
          "SDC Ujjwal is a Diwali celebration developed by SD CodeCraft Club of Sanatan Dharma College, Ambala Cantt.",
      },
      { property: "og:title", content: "About — SDC Ujjwal" },
      {
        property: "og:description",
        content: "Happy Diwali from SD CodeCraft Club!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="text-center">
        <Sparkles className="mx-auto mb-3 h-10 w-10 text-primary" />

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          A celebration of light and togetherness
        </p>

        <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">
          About SDC Ujjwal
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Ujjwal means bright — and that is the whole idea. This Diwali,
          our college lights itself up one correct answer at a time.
        </p>
      </div>

      <div className="divider-gold mx-auto my-10 w-56" />

      <section className="card-glow rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <GraduationCap className="mt-1 h-8 w-8 shrink-0 text-primary" />

          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Sanatan Dharma College, Ambala Cantt.
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This shared virtual campus belongs to every student, teacher
              and alumnus of SD College. It brings our Diwali celebration
              online, where everyone can contribute a little light.
            </p>
          </div>
        </div>
      </section>

      <section className="card-glow mt-6 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <Code2 className="mt-1 h-8 w-8 shrink-0 text-primary" />

          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Built by the SD CodeCraft Club
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Designed and developed by students, for our college community.
              From the quiz to the shared campus illumination, this project
              celebrates what students can create when they learn and build
              together.
            </p>
          </div>
        </div>
      </section>

      <section className="card-glow mt-6 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <Flame className="mt-1 h-8 w-8 shrink-0 text-primary" />

          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              How the light works
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Every correct quiz answer lights one diya on the shared campus.
              Every 25 contributions fill another campus photograph. As the
              total grows, the campus becomes brighter and reaches new
              illumination milestones.
            </p>
          </div>
        </div>
      </section>

      <section className="card-glow mt-6 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <Heart className="mt-1 h-8 w-8 shrink-0 text-primary" />

          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Our mission
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Knowledge is the brightest diya of all. We believe learning,
              like Diwali, is better when shared. No fees, no barriers —
              just a college lighting up together, one answer at a time.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="gap-2">
          <Link to="/quiz">
            <Flame className="h-5 w-5" /> Play the quiz
          </Link>
        </Button>

        <Button asChild size="lg" variant="outline" className="gap-2">
          <Link to="/campus">See the campus</Link>
        </Button>
      </div>
    </main>
  );
}