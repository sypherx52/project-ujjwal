import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Code2, Flame, GraduationCap, Heart, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Project Ujjwal" },
      {
        name: "description",
        content:
          "Project Ujjwal is a Diwali celebration by the SD CodeCraft Club of Sanatan Dharma College, Ambala Cantt. — one shared campus, lit by every correct answer.",
      },
      { property: "og:title", content: "About — Project Ujjwal" },
      {
        property: "og:description",
        content:
          "A Diwali celebration by the SD CodeCraft Club of Sanatan Dharma College, Ambala Cantt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="text-center">
        <Sparkles className="mx-auto mb-3 h-10 w-10 text-primary" />
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          About Project Ujjwal
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          “Ujjwal” means bright — and that is the whole idea. This Diwali, our
          college lights itself up one correct answer at a time.
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
              For decades our campus has celebrated Diwali together — diyas on
              every windowsill, rangoli in the courtyard, sweets in the staff
              room. Project Ujjwal carries that tradition online: a shared
              virtual campus that belongs to every student, teacher and alum of
              SD College, and that no single person can light alone.
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
              Designed and developed by the student coding club of SD College.
              The quiz questions, the campus artwork and the illumination levels
              were all crafted as a club project for Diwali 2026 — proof that a
              small group of students can build something the whole college
              plays with, together, across every device.
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
              The campus starts in warm twilight — beautiful, but waiting. Every
              correct quiz answer from anyone, anywhere, lights one diya on the
              shared scene. At 10 diyas the gate awakens; at 25 the pathways
              glow; at 50 the courtyard comes alive; at 75 the gardens shimmer;
              and at 100 the whole college reaches Grand Illumination, with
              fireworks over the skyline.
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
              Knowledge is the brightest diya of all. We want every student to
              feel that learning — like Diwali — is better when shared. No
              sign-up walls, no fees, no competition that leaves anyone out:
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
