import { useEffect, useRef, useState } from "react";
import { Disc3, Music2, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { MUSIC_PLAYLIST } from "@/audio";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [error, setError] = useState("");
  const track = MUSIC_PLAYLIST[trackIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    setPlaying(false);
    setError("");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [trackIndex]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    setError("");
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      setError("Song nahi chala. Check karo ki file public/audio folder mein hai aur filename playlist mein sahi hai.");
    }
  };

  const changeTrack = (direction: number) => {
    if (!MUSIC_PLAYLIST.length) return;
    setTrackIndex((current) => (current + direction + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] w-[min(340px,calc(100vw-2rem))]">
      {expanded && (
        <div className="mb-2 rounded-2xl border border-primary/30 bg-background/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Disc3 className={`h-6 w-6 ${playing ? "animate-spin" : ""}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display font-semibold text-foreground">{track?.title ?? "Add your songs"}</p>
              <p className="truncate text-xs text-muted-foreground">{track?.artist ?? "Edit audio.ts"}</p>
            </div>
          </div>
          {track ? (
            <>
              <audio
                ref={audioRef}
                src={track.src}
                preload="metadata"
                onEnded={() => changeTrack(1)}
                onError={() => { setPlaying(false); setError("Audio file nahi mili. Filename aur public/audio folder check karo."); }}
              />
              <div className="mb-3 flex items-center justify-center gap-4">
                <button type="button" aria-label="Previous song" onClick={() => changeTrack(-1)} className="rounded-full p-2 text-foreground hover:bg-secondary"><SkipBack className="h-5 w-5" /></button>
                <button type="button" aria-label={playing ? "Pause music" : "Play music"} onClick={() => void togglePlayback()} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:opacity-90">{playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}</button>
                <button type="button" aria-label="Next song" onClick={() => changeTrack(1)} className="rounded-full p-2 text-foreground hover:bg-secondary"><SkipForward className="h-5 w-5" /></button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input aria-label="Music volume" className="w-full accent-primary" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
                <span className="w-9 text-right text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
              </div>
              {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
              <p className="mt-3 text-center text-[11px] text-muted-foreground">Your playlist · songs play after you add audio files</p>
            </>
          ) : (
            <div className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
              Abhi playlist khaali hai. `src/components/audio.ts` edit karo aur apni MP3 files `public/audio/` mein rakho. Instructions `public/audio/README.md` mein hain.
            </div>
          )}
        </div>
      )}
      <button type="button" onClick={() => setExpanded((value) => !value)} className="ml-auto flex items-center gap-2 rounded-full border border-primary/40 bg-card/95 px-4 py-3 text-sm font-semibold text-foreground shadow-xl backdrop-blur-lg transition hover:border-primary hover:bg-secondary" aria-expanded={expanded}>
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary"><Music2 className="h-4 w-4" />{playing && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />}</span>
        <span>{playing ? "Music playing" : "Festival music"}</span>
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
    </div>
  );
}
