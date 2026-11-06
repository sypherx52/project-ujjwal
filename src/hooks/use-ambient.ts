// Ambient festive drone (soft shehnai-like pad) generated with WebAudio —
// no audio files needed. Keeps volume very low so it never startles anyone.
import { useCallback, useEffect, useRef, useState } from "react";

export function useAmbientMusic() {
  const [playing, setPlaying] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  const start = useCallback(() => {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    try {
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      // A warm perfect-fifth drone: D3, A3, D4.
      const oscs = [146.83, 220.0, 293.66].map((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        gain.gain.value = i === 0 ? 0.5 : 0.22;
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        return osc;
      });

      // Slow "breathing" swell.
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.012;
      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);
      lfo.start();

      master.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2.5);

      stopRef.current = () => {
        try {
          const t = ctx.currentTime;
          master.gain.cancelScheduledValues(t);
          master.gain.setValueAtTime(master.gain.value, t);
          master.gain.linearRampToValueAtTime(0, t + 0.8);
          oscs.forEach((o) => o.stop(t + 0.9));
          lfo.stop(t + 0.9);
          setTimeout(() => void ctx.close().catch(() => {}), 1000);
        } catch {
          // context already closed
        }
      };
    } catch {
      // audio unavailable — the toggle just stays silent
    }
  }, []);

  const toggle = useCallback(() => {
    setPlaying((prev) => {
      if (prev) {
        stopRef.current?.();
        stopRef.current = null;
        return false;
      }
      start();
      return true;
    });
  }, [start]);

  useEffect(() => () => stopRef.current?.(), []);

  return { playing, toggle };
}
