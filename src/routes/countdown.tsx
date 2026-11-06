import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles } from "lucide-react";

export const Route = createFileRoute("/countdown")({
  head: () => ({
    meta: [
      { title: "Countdown to Diwali — Project Ujjwal" },
      {
        name: "description",
        content:
          "Counting down to Diwali 2026 at Sanatan Dharma College, Ambala Cantt. — how many days until the campus reaches Grand Illumination.",
      },
      { property: "og:title", content: "Countdown to Diwali — Project Ujjwal" },
      {
        property: "og:description",
        content: "How long until the festival of lights begins?",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CountdownPage,
});

// Diwali 2026 — the night of Lakshmi Puja (IST midnight, UTC+5:30).
const DIWALI_TS = new Date("2026-11-08T00:00:00+05:30").getTime();

function CountdownPage() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = now === null ? null : Math.max(0, DIWALI_TS - now);
  const days = diff === null ? "—" : Math.floor(diff / 86_400_000);
  const hours = diff === null ? "—" : Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = diff === null ? "—" : Math.floor((diff % 3_600_000) / 60_000);
  const seconds = diff === null ? "—" : Math.floor((diff % 60_000) / 1000);
  const arrived = diff !== null && diff === 0;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-14 text-center">
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-champagne">
        <Sparkles className="h-3.5 w-3.5" /> Diwali 2026 · Sanatan Dharma College, Ambala Cantt.
      </p>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
        {arrived ? "The festival has begun!" : "Countdown to the Festival of Lights"}
      </h1>
      <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
        {arrived
          ? "Shubh Deepavali from Project Ujjwal — the campus is glowing tonight."
          : "Every second brings the campus closer to Grand Illumination."}
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { value: days, label: "Days" },
          { value: hours, label: "Hours" },
          { value: minutes, label: "Minutes" },
          { value: seconds, label: "Seconds" },
        ].map((unit) => (
          <div key={unit.label} className="card-glow rounded-2xl border border-primary/30 bg-card/70 px-4 py-6">
            <p className="font-display text-4xl font-bold text-glow-gold text-primary sm:text-5xl">
              {unit.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              {unit.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="gap-2">
          <Link to="/quiz">
            <Flame className="h-5 w-5" /> Warm up the campus now
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="gap-2">
          <Link to="/wish">Send a wish card</Link>
        </Button>
      </div>
    </main>
  );
}
