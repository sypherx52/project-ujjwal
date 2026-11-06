// Illumination model for the virtual campus.
// The campus NEVER starts pitch dark: base warmth keeps the scene in
// recognizable twilight even at 0 diyas (user's core design rule).

export const LEVEL_THRESHOLDS = [10, 25, 50, 75, 100];

export const LEVEL_NAMES = [
  "Twilight Campus",
  "The Gate Awakens",
  "Pathways of Light",
  "Courtyard Glow",
  "Gardens Aglow",
  "Grand Illumination",
] as const;

export const LEVEL_DESCRIPTIONS = [
  "A warm evening settles over SD College. A few diyas flicker softly.",
  "The entrance gate begins to glow with the first wave of diyas.",
  "Walkways and lamps light the way across campus.",
  "Windows brighten and the courtyard rangoli comes alive.",
  "Gardens and festive corners shimmer with marigold light.",
  "SD College stands fully illuminated — fireworks light the sky!",
] as const;

export type Illumination = {
  /** 0–5, how many milestone thresholds have been crossed */
  level: number;
  /** 0–1 progress toward the milestone goal */
  progress: number;
  /** 0.15–1: warmth drives scene colors; never 0, campus is never pitch dark */
  warmth: number;
};

export function computeIllumination(diyas: number, milestone: number): Illumination {
  const safeMilestone = Math.max(1, Math.floor(milestone));
  const safeDiyas = Math.max(0, Math.floor(diyas));
  const progress = Math.min(1, safeDiyas / safeMilestone);
  let level = 0;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (safeDiyas >= threshold) level += 1;
  }
  return { level, progress, warmth: 0.15 + 0.85 * progress };
}
