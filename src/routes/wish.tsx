import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Gift, Sparkles } from "lucide-react";

export const Route = createFileRoute("/wish")({
  head: () => ({
    meta: [
      { title: "Wish Cards — Project Ujjwal" },
      {
        name: "description",
        content:
          "Create and download a glowing Diwali wish card from Sanatan Dharma College, Ambala Cantt. — part of Project Ujjwal by the SD CodeCraft Club.",
      },
      { property: "og:title", content: "Wish Cards — Project Ujjwal" },
      {
        property: "og:description",
        content: "Design a glowing Diwali wish card and share it with your people.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishPage,
});

const PRESETS = [
  "May your diya burn the brightest this Diwali!",
  "Wishing you light, laughter and full marks this festive season.",
  "From our campus to your home — Shubh Deepavali!",
  "May knowledge light every corner of your life.",
];

/** Draws the premium wish card onto a canvas and returns a PNG data URL. */
function renderWishCard(name: string, message: string): string {
  const W = 1200;
  const H = 675;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Midnight navy → deep maroon backdrop
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0d1026");
  bg.addColorStop(0.55, "#241224");
  bg.addColorStop(1, "#3a1620");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Warm horizon glow
  const glow = ctx.createRadialGradient(W / 2, H * 0.9, 40, W / 2, H * 0.9, 620);
  glow.addColorStop(0, "rgba(255, 170, 70, 0.35)");
  glow.addColorStop(1, "rgba(255, 170, 70, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Gold frame
  ctx.strokeStyle = "#e8b44a";
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  // Corner diya flames
  const flame = (x: number, y: number) => {
    const f = ctx.createRadialGradient(x, y, 2, x, y, 46);
    f.addColorStop(0, "rgba(255, 220, 140, 0.9)");
    f.addColorStop(1, "rgba(255, 150, 60, 0)");
    ctx.fillStyle = f;
    ctx.beginPath();
    ctx.arc(x, y, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffd27a";
    ctx.beginPath();
    ctx.ellipse(x, y, 5, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  flame(70, 70);
  flame(W - 70, 70);
  flame(70, H - 70);
  flame(W - 70, H - 70);

  ctx.textAlign = "center";
  ctx.fillStyle = "#e8b44a";
  ctx.font = "600 26px Georgia, serif";
  ctx.fillText("PROJECT UJJWAL", W / 2, 118);
  ctx.font = "400 18px Georgia, serif";
  ctx.fillStyle = "rgba(240, 220, 180, 0.75)";
  ctx.fillText("Illuminate Knowledge, Celebrate Diwali", W / 2, 150);

  // Message, wrapped
  ctx.fillStyle = "#f6ecd8";
  ctx.font = "italic 34px Georgia, serif";
  const words = (message || "Shubh Deepavali!").split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > W - 260 && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  const startY = H / 2 - ((lines.length - 1) * 50) / 2 + 10;
  lines.forEach((l, i) => ctx.fillText(l, W / 2, startY + i * 50));

  // Signature
  ctx.font = "500 24px Georgia, serif";
  ctx.fillStyle = "#e8b44a";
  ctx.fillText(`— ${name || "A friend of Ujjwal"}`, W / 2, H - 150);
  ctx.font = "400 17px Georgia, serif";
  ctx.fillStyle = "rgba(240, 220, 180, 0.7)";
  ctx.fillText("Sanatan Dharma College, Ambala Cantt. · Diwali 2026", W / 2, H - 112);

  return canvas.toDataURL("image/png");
}

function WishPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    setError(null);
    if (message.trim().length < 3) {
      setError("Write a short wish first — even one line is enough.");
      return;
    }
    try {
      setCardUrl(renderWishCard(name.trim(), message.trim()));
    } catch {
      setError("Your browser blocked card creation. Please try again.");
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 text-center">
        <Gift className="mx-auto mb-3 h-10 w-10 text-primary" />
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Make a Wish Card
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Write your Diwali wish for friends, family or the whole college — we
          turn it into a glowing card you can download and share.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card-glow rounded-2xl border border-border bg-card p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wish-name">Your name</Label>
              <Input
                id="wish-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                maxLength={40}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wish-message">Your wish</Label>
              <Textarea
                id="wish-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="May this Diwali fill your home with light and laughter…"
                rows={4}
                maxLength={220}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setMessage(preset)}
                  className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {preset}
                </button>
              ))}
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="w-full gap-2" onClick={generate}>
              <Sparkles className="h-4 w-4" /> Create my card
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {cardUrl ? (
            <>
              <img
                src={cardUrl}
                alt="Your Diwali wish card"
                className="card-glow w-full max-w-md rounded-2xl border border-primary/30"
              />
              <a href={cardUrl} download="ujjwal-wish-card.png">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Download card
                </Button>
              </a>
            </>
          ) : (
            <div className="flex h-72 w-full max-w-md items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 text-center text-sm text-muted-foreground">
              Your glowing card appears here after you create it.
            </div>
          )}
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Want to light an actual diya too?{" "}
        <Link to="/quiz" className="text-primary underline">
          Answer one quiz question
        </Link>
        .
      </p>
    </main>
  );
}
