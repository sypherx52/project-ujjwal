import { createFileRoute, Link } from "@tanstack/react-router";
import gateImg from "@/assets/gallery/gate.jpg";
import rangoliImg from "@/assets/gallery/rangoli.jpg";
import lanternsImg from "@/assets/gallery/lanterns.jpg";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/traditions")({
  head: () => ({
    meta: [
      { title: "Diwali Traditions — Project Ujjwal" },
      {
        name: "description",
        content:
          "The traditions behind the festival of lights — diyas, rangoli, lanterns, sweets and fireworks — celebrated by Sanatan Dharma College, Ambala Cantt.",
      },
      { property: "og:title", content: "Diwali Traditions — Project Ujjwal" },
      {
        property: "og:description",
        content: "Diyas, rangoli, lanterns, sweets and light — the heart of Diwali.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TraditionsPage,
});

const TRADITIONS = [
  {
    title: "Diyas — the first light",
    text: "Clay lamps filled with mustard oil and a cotton wick are the soul of Deepavali, literally a “row of lights”. Each diya is a small promise: darkness loses, knowledge wins. On our virtual campus, every diya you light stands for one correct answer.",
  },
  {
    title: "Rangoli — art at the doorstep",
    text: "Coloured powders, rice paste and flower petals are drawn into intricate patterns at entrances to welcome guests and invite good fortune. Our courtyard rangoli appears on campus once enough diyas glow around it.",
  },
  {
    title: "Lanterns & kandils",
    text: "Paper lanterns hang from balconies and shopfronts across North India, glowing like tiny skies. Watch the walkway lanterns sway over the campus as the celebration levels rise.",
  },
  {
    title: "Lakshmi Puja",
    text: "On Diwali night, families pray to Lakshmi, the goddess of wealth and prosperity, and to Ganesha, the remover of obstacles. Doors and windows are kept open — light and openness invite abundance.",
  },
  {
    title: "Sweets & feasts",
    text: "Laddoos, barfis, jalebis and kheer are exchanged between homes, classrooms and hostels. Every box of sweets carries the same message: “may you be well, may you be bright.”",
  },
  {
    title: "Fireworks — the grand finale",
    text: "When the last diya is lit, the sky answers. Fireworks mark the joy of a community that lit its own darkness away — exactly what happens here when we reach Grand Illumination.",
  },
];

function TraditionsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Diwali Traditions
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          The customs that inspired every corner of our virtual campus — from
          the first diya to the final firework.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRADITIONS.map((t) => (
          <article
            key={t.title}
            className="card-glow rounded-2xl border border-border bg-card/60 p-5"
          >
            <h2 className="font-display text-lg font-semibold text-primary">
              {t.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <figure className="overflow-hidden rounded-2xl border border-border">
          <img src={gateImg} alt="A college entrance glowing with diyas" className="h-44 w-full object-cover" loading="lazy" />
          <figcaption className="bg-card px-3 py-2 text-xs text-muted-foreground">
            Doorways are lit so Lakshmi finds the way in.
          </figcaption>
        </figure>
        <figure className="overflow-hidden rounded-2xl border border-border">
          <img src={rangoliImg} alt="A colourful rangoli pattern" className="h-44 w-full object-cover" loading="lazy" />
          <figcaption className="bg-card px-3 py-2 text-xs text-muted-foreground">
            Rangoli welcomes every guest to the celebration.
          </figcaption>
        </figure>
        <figure className="overflow-hidden rounded-2xl border border-border">
          <img src={lanternsImg} alt="Festive lanterns glowing at dusk" className="h-44 w-full object-cover" loading="lazy" />
          <figcaption className="bg-card px-3 py-2 text-xs text-muted-foreground">
            Kandils turn every street into a festival of light.
          </figcaption>
        </figure>
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg" className="gap-2">
          <Link to="/quiz">
            <Flame className="h-5 w-5" /> Light your own diya
          </Link>
        </Button>
      </div>
    </main>
  );
}
