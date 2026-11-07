
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

import campus1 from "@/assets/campus/Campus-1.jpg";
import campus2 from "@/assets/campus/campus-2.jpg";
import campus3 from "@/assets/campus/campus-3.jpeg";
import campus4 from "@/assets/campus/campus-4.jpeg";

import {
  LEVEL_NAMES,
  LEVEL_DESCRIPTIONS,
} from "@/lib/illumination";

type SceneProps = {
  warmth: number;
  level: number;
  diyas: number;
  milestone: number;
  className?: string;
};

type Position = [number, number];

const DIYAS_PER_BATCH = 5;
const MAX_DIYAS_PER_PHOTO = 25;
const TOTAL_PHOTOS = 4;

// Shared position adjustment for homepage and Gallery.
const POSITION_SHIFT_X = 8;
const POSITION_SHIFT_Y = -10;

function adjustPosition([x, y]: Position): Position {
  return [
    Math.max(3, Math.min(97, x + POSITION_SHIFT_X)),
    Math.max(5, Math.min(90, y + POSITION_SHIFT_Y)),
  ];
}

const PHOTOS: {
  src: string;
  name: string;
  description: string;
  positions: Position[];
}[] = [
  {
    src: campus1,
    name: "Our College Entrance",
    description:
      "The main entrance of Sanatan Dharma College, welcoming everyone to our campus celebration.",
    positions: [
      [8, 80], [18, 85], [28, 78], [38, 86],
      [48, 80], [58, 86], [68, 79], [78, 85],
      [89, 79], [14, 62], [26, 65], [38, 59],
      [50, 66], [62, 60], [74, 65], [86, 59],
      [20, 43], [40, 46], [60, 43], [80, 46],
      [5, 52], [95, 52], [30, 28], [50, 25], [70, 28],
    ].map(adjustPosition),
  },
  {
    src: campus2,
    name: "Our College Garden",
    description:
      "A peaceful green space on campus, glowing with the warmth of Diwali.",
    positions: [
      [8, 82], [18, 85], [28, 80], [38, 86],
      [48, 81], [58, 86], [68, 80], [78, 85],
      [89, 81], [13, 63], [25, 65], [37, 61],
      [63, 61], [75, 65], [87, 63], [20, 43],
      [35, 46], [65, 46], [80, 43], [50, 72],
      [5, 52], [95, 52], [30, 28], [50, 25], [70, 28],
    ].map(adjustPosition),
  },
  {
    src: campus3,
    name: "Our College Ground",
    description:
      "The college ground where students come together, celebrate and create memories.",
    positions: [
      [7, 83], [17, 86], [27, 81], [37, 86],
      [47, 82], [57, 86], [67, 81], [77, 86],
      [89, 82], [12, 65], [24, 68], [36, 63],
      [48, 67], [60, 63], [72, 67], [86, 63],
      [20, 45], [40, 48], [60, 45], [80, 48],
      [5, 52], [95, 52], [30, 28], [50, 25], [70, 28],
    ].map(adjustPosition),
  },
  {
    src: campus4,
    name: "Our College Building",
    description:
      "The architectural structure of our college, illuminated by the spirit of togetherness.",
    positions: [
      [8, 82], [18, 86], [28, 82], [38, 86],
      [48, 82], [58, 86], [68, 82], [78, 86],
      [90, 82], [12, 64], [24, 67], [36, 63],
      [48, 67], [60, 63], [74, 67], [87, 63],
      [20, 44], [40, 47], [60, 44], [80, 47],
      [5, 52], [95, 52], [30, 28], [50, 25], [70, 28],
    ].map(adjustPosition),
  },
];

/**
 * Every group of 5 contributions goes to the next photo.
 * Each photo can display a maximum of 25 diyas.
 */
export function getPhotoDiyaCounts(totalDiyas: number): number[] {
  const total = Math.max(0, Math.floor(totalDiyas));

  const completedBatches = Math.floor(total / DIYAS_PER_BATCH);
  const currentBatch = total % DIYAS_PER_BATCH;

  const completeCycles = Math.floor(
    completedBatches / TOTAL_PHOTOS
  );

  const remainingBatches = completedBatches % TOTAL_PHOTOS;

  return PHOTOS.map((_, photoIndex) => {
    const completedPhotoBatches =
      completeCycles +
      (photoIndex < remainingBatches ? 1 : 0);

    const currentPhotoBatch =
      photoIndex === remainingBatches ? currentBatch : 0;

    const count =
      completedPhotoBatches * DIYAS_PER_BATCH +
      currentPhotoBatch;

    return Math.min(count, MAX_DIYAS_PER_PHOTO);
  });
}

function Diya({
  delay,
  sparkling,
  onClick,
  onMove,
  interactive = true,
}: {
  delay: number;
  sparkling: boolean;
  onClick: () => void;
  onMove: (x: number, y: number) => void;
  interactive?: boolean;
}) {
  const [dragging, setDragging] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerRef = useRef<number | null>(null);
  const movedRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  function clearLongPress() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!interactive) return;

    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    clearLongPress();

    pointerRef.current = event.pointerId;
    movedRef.current = false;

    startRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    const button = event.currentTarget;
    const pointerId = event.pointerId;

    timerRef.current = setTimeout(() => {
      setDragging(true);

      try {
        button.setPointerCapture(pointerId);
      } catch {
        // Pointer may already have been released.
      }

      timerRef.current = null;
    }, 300);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!interactive) return;
    if (pointerRef.current !== event.pointerId) return;
    if (!dragging) return;

    const dx = event.clientX - startRef.current.x;
    const dy = event.clientY - startRef.current.y;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      movedRef.current = true;
    }

    const scene = event.currentTarget.closest(
      '[data-testid="campus-scene"]'
    );

    if (!scene) return;

    const rect = scene.getBoundingClientRect();

    const x = Math.max(
      2,
      Math.min(98, ((event.clientX - rect.left) / rect.width) * 100)
    );

    const y = Math.max(
      5,
      Math.min(95, ((event.clientY - rect.top) / rect.height) * 100)
    );

    onMove(x, y);
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    clearLongPress();

    if (pointerRef.current === event.pointerId) {
      pointerRef.current = null;
    }

    setDragging(false);
  }

  function handleClick() {
    if (!interactive) return;

    if (movedRef.current) {
      movedRef.current = false;
      return;
    }

    onClick();
  }

  useEffect(() => {
    return () => clearLongPress();
  }, []);

  return (
    <button
      type="button"
      disabled={!interactive}
      aria-label={
        interactive
          ? "Hold and drag this diya, or click to sparkle"
          : "Lit diya"
      }
      title={
        interactive
          ? "Hold to move • Click to sparkle"
          : "Lit diya"
      }
      onPointerDown={interactive ? handlePointerDown : undefined}
      onPointerMove={interactive ? handlePointerMove : undefined}
      onPointerUp={interactive ? handlePointerUp : undefined}
      onPointerCancel={interactive ? handlePointerUp : undefined}
      onClick={interactive ? handleClick : undefined}
      className={`relative border-0 bg-transparent p-0 ${
        dragging ? "scale-125" : "hover:scale-110"
      }`}
      style={{
        width: 28,
        height: 24,
        cursor: interactive
          ? dragging
            ? "grabbing"
            : "grab"
          : "default",
        touchAction: interactive ? "none" : "auto",
        transition: "transform 150ms ease",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        className="absolute bottom-1 left-1/2 h-2 w-5 -translate-x-1/2 rounded-full"
        style={{
          background: "linear-gradient(180deg,#ffb347,#9b3519)",
          boxShadow: "0 2px 5px #0008",
        }}
      />

      <span
        className={`scene-flame absolute bottom-3 left-1/2 ${
          sparkling ? "scene-flame-active" : ""
        }`}
        style={{
          width: sparkling ? 12 : 7,
          height: sparkling ? 18 : 10,
          transform: "translateX(-50%)",
          animationDelay: `${delay}s`,
          borderRadius: "50% 50% 45% 45%",
          background: "linear-gradient(to top,#ff7b22,#ffd56b)",
          boxShadow: "0 0 8px #ffae42",
        }}
      />

      <span
        className={`scene-glow absolute -left-1 -top-2 h-10 w-10 ${
          sparkling ? "scene-glow-active" : ""
        }`}
        style={{
          borderRadius: "50%",
          background: "#ffae35",
          filter: "blur(10px)",
          opacity: sparkling ? 0.9 : 0.3,
          pointerEvents: "none",
        }}
      />

      {sparkling && (
        <span className="scene-spark-burst absolute left-1/2 top-1/2 z-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="scene-spark"
              style={{
                transform: `rotate(${i * 18}deg) translateY(-${
                  12 + (i % 4) * 7
                }px)`,
                animationDelay: `${(i % 5) * 0.05}s`,
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
}

/**
 * Read-only campus photo used by the Gallery.
 */
export function CampusGalleryPhoto({
  photoIndex,
  diyas,
  warmth,
  level,
  className = "",
  fit = "cover",
}: {
  photoIndex: number;
  diyas: number;
  warmth: number;
  level: number;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const [sparklingDiya, setSparklingDiya] = useState<number | null>(null);

  const safePhotoIndex = Math.max(
    0,
    Math.min(PHOTOS.length - 1, photoIndex)
  );

  const photo = PHOTOS[safePhotoIndex];
  const photoCounts = getPhotoDiyaCounts(diyas);
  const visibleDiyas = photoCounts[safePhotoIndex] ?? 0;

  useEffect(() => {
    if (visibleDiyas === 0) {
      setSparklingDiya(null);
      return;
    }

    const interval = window.setInterval(() => {
      setSparklingDiya(
        Math.floor(Math.random() * visibleDiyas)
      );
    }, 3500);

    return () => window.clearInterval(interval);
  }, [visibleDiyas, safePhotoIndex]);

  useEffect(() => {
    if (sparklingDiya === null) return;

    const timeout = window.setTimeout(() => {
      setSparklingDiya(null);
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [sparklingDiya]);

  return (
    <div
      className={`relative isolate overflow-hidden bg-black ${className}`}
    >
      <img
        src={photo.src}
        alt={photo.name}
        className={`absolute inset-0 h-full w-full ${
          fit === "contain" ? "object-contain" : "object-cover"
        }`}
        style={{
          filter: `brightness(${0.68 + warmth * 0.3})`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 35%, #170b20aa 100%)",
          opacity: 0.65,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 75%, #ffae343d, transparent 70%)",
          opacity: 0.25 + Math.min(1, visibleDiyas / 25) * 0.75,
        }}
      />

      {photo.positions.slice(0, visibleDiyas).map((position, index) => {
        const [x, y] = position;

        return (
          <div
            key={`${safePhotoIndex}-${index}`}
            className="absolute z-10"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Diya
              delay={(index % 5) * 0.25}
              sparkling={sparklingDiya === index}
              onClick={() => setSparklingDiya(index)}
              onMove={() => undefined}
              interactive={false}
            />
          </div>
        );
      })}

      {level >= 2 &&
        Array.from({ length: Math.min(level * 3, 15) }).map(
          (_, index) => (
            <span
              key={`star-${index}`}
              className="scene-star absolute z-10"
              style={{
                left: `${8 + ((index * 37) % 84)}%`,
                top: `${10 + ((index * 23) % 65)}%`,
                width: 4,
                height: 4,
                background: "#ffe5a0",
                boxShadow: "0 0 12px #ffc45c",
                animationDelay: `${index * 0.3}s`,
              }}
            />
          )
        )}

      <div className="absolute bottom-3 right-3 z-20 rounded-full border border-amber-200/30 bg-black/60 px-3 py-1 text-xs font-semibold text-amber-200">
        {visibleDiyas} / 25 diyas
      </div>
    </div>
  );
}

export function CampusScene({
  warmth,
  level,
  diyas,
  milestone,
  className = "",
}: SceneProps) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [sparklingDiya, setSparklingDiya] = useState<string | null>(null);

  const [photoPositions, setPhotoPositions] = useState<
    Record<number, Record<number, Position>>
  >({});

  const totalDiyas = Math.max(0, Math.floor(diyas));
  const photoDiyaCounts = getPhotoDiyaCounts(totalDiyas);

  const photo = PHOTOS[activePhoto] ?? PHOTOS[0];
  const visibleDiyas = photoDiyaCounts[activePhoto] ?? 0;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePhoto((current) => (current + 1) % PHOTOS.length);
      setSparklingDiya(null);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!sparklingDiya) return;

    const timer = window.setTimeout(() => {
      setSparklingDiya(null);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [sparklingDiya]);

  useEffect(() => {
    if (visibleDiyas === 0) return;

    const timer = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * visibleDiyas);
      setSparklingDiya(`${activePhoto}-${randomIndex}`);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [activePhoto, visibleDiyas]);

  const progress = Math.min(
    1,
    totalDiyas / Math.max(1, milestone)
  );

  const safeLevel = Math.min(
    Math.max(0, level),
    LEVEL_NAMES.length - 1
  );

  return (
    <div
      className={`relative isolate overflow-hidden rounded-3xl border border-primary/30 bg-black shadow-2xl ${className}`}
      data-testid="campus-scene"
    >
      {PHOTOS.map((item, index) => (
        <img
          key={item.name}
          src={item.src}
          alt={item.name}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms]"
          style={{
            opacity: activePhoto === index ? 1 : 0,
            filter: `brightness(${0.68 + warmth * 0.3})`,
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 35%, #170b20aa 100%)",
          opacity: 0.65 + progress * 0.2,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at 50% 75%, #ffae343d, transparent 70%)",
          opacity: 0.25 + progress * 0.75,
        }}
      />

      {photo.positions.slice(0, visibleDiyas).map((position, index) => {
        const id = `${activePhoto}-${index}`;
        const [x, y] =
          photoPositions[activePhoto]?.[index] ?? position;

        return (
          <div
            key={id}
            className="absolute z-10"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: sparklingDiya === id ? 30 : 10,
            }}
          >
            <Diya
              delay={(index % 5) * 0.25}
              sparkling={sparklingDiya === id}
              onClick={() => setSparklingDiya(id)}
              onMove={(newX, newY) => {
                setPhotoPositions((current) => ({
                  ...current,
                  [activePhoto]: {
                    ...current[activePhoto],
                    [index]: [newX, newY],
                  },
                }));
              }}
            />
          </div>
        );
      })}

      {level >= 2 &&
        Array.from({ length: Math.min(level * 3, 15) }).map(
          (_, index) => (
            <span
              key={`star-${index}`}
              className="scene-star absolute z-10"
              style={{
                left: `${8 + ((index * 37) % 84)}%`,
                top: `${10 + ((index * 23) % 65)}%`,
                width: 4,
                height: 4,
                background: "#ffe5a0",
                boxShadow: "0 0 12px #ffc45c",
                animationDelay: `${index * 0.3}s`,
              }}
            />
          )
        )}

      {level >= 5 && (
        <div className="pointer-events-none absolute inset-0 z-10">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={`firework-${index}`}
              className="scene-firework absolute"
              style={{
                left: `${12 + index * 11}%`,
                top: `${12 + (index % 3) * 12}%`,
                width: 35,
                height: 35,
                background:
                  "radial-gradient(circle,#fff4b5,#ffae3480,transparent 70%)",
                animationDelay: `${index * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between gap-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-5 pt-16">
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-amber-100 sm:text-lg">
            {photo.name}
          </p>

          <p className="mt-1 text-xs text-white/75 sm:text-sm">
            {photo.description}
          </p>

          <p className="mt-1 text-xs text-amber-200/80">
            {LEVEL_NAMES[safeLevel]} · {LEVEL_DESCRIPTIONS[safeLevel]}
          </p>

          <p className="mt-1 text-xs text-white/65">
            {visibleDiyas} / {MAX_DIYAS_PER_PHOTO} diyas on this photo
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-display text-2xl font-bold text-amber-300 sm:text-3xl">
            🪔 {totalDiyas}
          </p>

          <p className="text-xs text-white/75">
            Total campus diyas
          </p>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-20 flex gap-2">
        {PHOTOS.map((item, index) => (
          <button
            key={item.name}
            type="button"
            aria-label={`Show ${item.name}`}
            aria-pressed={activePhoto === index}
            onClick={() => {
              setActivePhoto(index);
              setSparklingDiya(null);
            }}
            className={`h-2.5 rounded-full transition-all ${
              activePhoto === index
                ? "w-7 bg-amber-300"
                : "w-2.5 bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
