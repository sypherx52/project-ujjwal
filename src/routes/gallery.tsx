
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import {
  CampusGalleryPhoto,
  getPhotoDiyaCounts,
} from "@/components/campus-scene";

import { useCampusStats } from "@/hooks/use-campus";
import { computeIllumination } from "@/lib/illumination";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { Flame, Sparkles } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Campus Gallery — SDC Ujjwal" },
      {
        name: "description",
        content:
          "Explore the four live illuminated campus scenes of Sanatan Dharma College, Ambala Cantt.",
      },
      { property: "og:title", content: "Campus Gallery — SDC Ujjwal" },
      {
        property: "og:description",
        content: "Watch our campus light up with every diya contribution.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

const ITEMS = [
  {
    title: "Our College Entrance",
    caption:
      "The main entrance of Sanatan Dharma College, welcoming everyone to our campus celebration.",
  },
  {
    title: "Our College Garden",
    caption:
      "A peaceful green space on campus, glowing with the warmth of Diwali.",
  },
  {
    title: "Our College Ground",
    caption:
      "The college ground where students come together, celebrate and create memories.",
  },
  {
    title: "Our College Building",
    caption:
      "The architectural structure of our college, illuminated by the spirit of togetherness.",
  },
];

function GalleryPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const stats = useCampusStats();
  const data = stats.data;

  const diyas = data?.total_diyas ?? 0;
  const milestone = data?.milestone ?? 100;

  const illumination = computeIllumination(diyas, milestone);

  // Uses the same distribution function as the homepage.
  const photoDiyaCounts = getPhotoDiyaCounts(diyas);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Our campus, illuminated together
        </p>

        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Campus Gallery
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Explore all four campus scenes as they glow with everyone's diya
          contributions. Select any scene to view it up close.
        </p>

        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
          <Flame className="h-4 w-4" />
          <strong>{diyas}</strong> total contributions
          <span className="text-muted-foreground">·</span>
          <span>
            {Math.round(illumination.progress * 100)}% illuminated
          </span>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Every 5 contributions light the next campus photo. Each photo can
          hold up to 25 diyas.
        </p>
      </div>

      {/* All four live campus photos */}
      <div className="grid gap-5 sm:grid-cols-2">
        {ITEMS.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`View ${item.title}`}
            className="card-glow group overflow-hidden rounded-2xl border border-border bg-card text-left transition-transform hover:-translate-y-1"
          >
            <CampusGalleryPhoto
              photoIndex={index}
              diyas={diyas}
              warmth={illumination.warmth}
              level={illumination.level}
              className="h-64 w-full"
            />

            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h2>

                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {photoDiyaCounts[index]} / 25
                </span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Enlarged photo dialog */}
      <Dialog
        open={openIndex !== null}
        onOpenChange={(open) => !open && setOpenIndex(null)}
      >
        <DialogContent className="max-w-4xl border-primary/30 bg-card p-2 sm:p-3">
          {openIndex !== null && ITEMS[openIndex] ? (
            <div>
              <CampusGalleryPhoto
                photoIndex={openIndex}
                diyas={diyas}
                warmth={illumination.warmth}
                level={illumination.level}
                className="h-[65vh] min-h-[300px] max-h-[650px] w-full rounded-xl"
                fit="contain"
              />

              <div className="px-3 pb-2 pt-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <DialogTitle className="font-display text-lg font-semibold text-foreground">
                    {ITEMS[openIndex].title}
                  </DialogTitle>

                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {photoDiyaCounts[openIndex]} / 25 diyas
                  </span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {ITEMS[openIndex].caption}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Quiz link */}
      <div className="mt-10 text-center">
        <Button asChild className="gap-2">
          <Link to="/quiz">
            <Flame className="h-4 w-4" />
            Help light the real campus
          </Link>
        </Button>
      </div>
    </main>
  );
}
