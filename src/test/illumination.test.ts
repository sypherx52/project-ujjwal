import { describe, expect, it } from "vitest";
import { LEVEL_THRESHOLDS, computeIllumination } from "@/lib/illumination";

// The campus must NEVER start pitch dark (user's core design rule) and must
// cross the 10/25/50/75/100 milestone levels as diyas accumulate.
describe("computeIllumination", () => {
  it("keeps baseline warmth above zero at 0 diyas — campus is recognizable twilight", () => {
    const at = computeIllumination(0, 100);
    expect(at.level).toBe(0);
    expect(at.progress).toBe(0);
    expect(at.warmth).toBeGreaterThan(0);
  });

  it("crosses each milestone threshold at exactly 10/25/50/75/100", () => {
    expect(LEVEL_THRESHOLDS).toEqual([10, 25, 50, 75, 100]);
    expect(computeIllumination(9, 100).level).toBe(0);
    expect(computeIllumination(10, 100).level).toBe(1);
    expect(computeIllumination(24, 100).level).toBe(1);
    expect(computeIllumination(25, 100).level).toBe(2);
    expect(computeIllumination(49, 100).level).toBe(2);
    expect(computeIllumination(50, 100).level).toBe(3);
    expect(computeIllumination(74, 100).level).toBe(3);
    expect(computeIllumination(75, 100).level).toBe(4);
    expect(computeIllumination(99, 100).level).toBe(4);
    expect(computeIllumination(100, 100).level).toBe(5);
  });

  it("grows warmth gradually with every diya and caps at 1", () => {
    expect(computeIllumination(50, 100).warmth).toBeGreaterThan(
      computeIllumination(10, 100).warmth,
    );
    expect(computeIllumination(100, 100).warmth).toBe(1);
    expect(computeIllumination(150, 100).warmth).toBe(1);
  });

  it("handles a zero or negative milestone without dividing by zero", () => {
    const at = computeIllumination(5, 0);
    expect(Number.isFinite(at.progress)).toBe(true);
    expect(at.progress).toBeLessThanOrEqual(1);
  });
});
