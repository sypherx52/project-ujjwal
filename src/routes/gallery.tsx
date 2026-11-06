import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import gateImg from "@/assets/gallery/gate.jpg";
import rangoliImg from "@/assets/gallery/rangoli.jpg";
import lanternsImg from "@/assets/gallery/lanterns.jpg";
import fireworksImg from "@/assets/gallery/fireworks.jpg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Festival Gallery — Project Ujjwal" },
      {
        name: "description",
        content:
          "Diwali scenes from the Project Ujjwal celebration at Sanatan Dharma College, Ambala Cantt. — the gate, rangoli, lanterns and fireworks.",
      },
      { property: "og:title", content: "Festival Gallery — Project Ujjwal" },
      {
        property: "og:description",
        content: "Light, colour and celebration from our Diwali festival.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

const ITEMS = [
  {
    src: gateImg,
    title: "The College Gate Awakens",
    caption:
      "The entrance of Sanatan Dharma College glows with the first wave of diyas.",
  },
  {
    src: rangoliImg,
    title: "Rangoli of a Thousand Colors",
    caption:
      "Courtyard rangoli drawn by hand, coloured powders glowing in diya light.",
  },
  {
    src: lanternsImg,
    title: "Lanterns over the Walkways",
    caption:
      "Festive lanterns sway above the pathways that connect every classroom.",
  },
  {
    src: fireworksImg,
    title: "Grand Illumination Fireworks",
    caption:
      "The finale: fireworks over a campus fully lit by everyone's answers.",
  },
];

function GalleryPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Festival Gallery
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Glimpses of the celebration we are building toward — tap any scene to
          view it up close.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {ITEMS.map((item, index) => (
          <button
            key={item.title}
            onClick={() => setOpenIndex(index)}
            className="card-glow group overflow-hidden rounded-2xl border border-border bg-card text-left transition-transform hover:-translate-y-1"
          >
            <img
              src={item.src}
              alt={item.title}
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.caption}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button asChild className="gap-2">
          <Link to="/quiz">
            <Flame className="h-4 w-4" /> Help light the real campus
          </Link>
        </Button>
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <DialogContent className="max-w-3xl border-primary/30 bg-card p-2 sm:p-3">
          {openIndex !== null && ITEMS[openIndex] ? (
            (() => {
              const item = ITEMS[openIndex];
              return (
                <div>
                  <img
                    src={item.src}
                    alt={item.title}
                    className="max-h-[70vh] w-full rounded-xl object-contain"
                  />
                  <div className="px-3 pb-2 pt-3">
                    <DialogTitle className="font-display text-lg font-semibold text-foreground">
                      {item.title}
                    </DialogTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.caption}
                    </p>
                  </div>
                </div>
              );
            })()
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
