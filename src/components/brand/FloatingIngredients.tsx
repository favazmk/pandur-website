"use client";

import { useEffect, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { spring } from "@/lib/motion";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/useMedia";
import type { FlavourSlug } from "@/lib/assets";

/* ------------------------------------------------------------------
   The four ingredient illustrations, drifting around a section.

   These are the delivered `public/ingredient/*.svg` files, used as they
   were supplied — no recolouring, no re-drawing, no raster fallback, and
   no blur/filter of any kind on top of them. Each SVG is a 768x512 frame
   whose ground is #FCF4E8, a shade off `--color-cream` (#FBF5EC), so on a
   cream section the frame itself disappears and only the ingredient reads
   as floating.

   Two nested elements per ingredient, and the split is load-bearing:

     motion.div  pointer parallax — the only transform JS ever writes
     img         the idle float — the only transform CSS ever writes

   One element cannot carry both. `transform` is a single property, so a
   Motion-driven tilt and a CSS keyframe float on the same node overwrite
   each other every frame and the animation visibly stutters.
   ------------------------------------------------------------------ */

/** Hard ceiling on the pointer lean. The brief's cap is 3-5deg; this is 4. */
const MAX_TILT = 4;

/** A few px of travel alongside the lean, so the tilt reads as depth. */
const MAX_SHIFT = 6;

type Drift = {
  slug: FlavourSlug;
  /** absolute placement + width, per breakpoint */
  place: string;
  /** peak vertical travel in px — the brief's arrow figure */
  y: number;
  /** peak rotation in deg, signed: negative is anticlockwise */
  rot: number;
  /** peak scale, held inside 0.98-1.02 */
  scale: number;
  /** seconds, 4-7, and no two alike */
  duration: number;
  /**
   * Negative on purpose. A positive delay leaves the tile frozen for
   * seconds after load and then starts all four in a visible wave; a
   * negative one starts it already part-way through its cycle, so the
   * group is desynced from the very first frame.
   */
  delay: number;
  /** how hard this tile leans into the pointer, 0-1 */
  depth: number;
};

/**
 * Corners only, and every tile is placed independently — no shared grid,
 * no mirrored pairs, no two the same size.
 *
 * Below `lg` each tile is anchored a couple of percent off its edge, so it
 * reads as an edge accent and leaves the middle of the hero to the headline;
 * from `lg` they pull in and sit fully on-screen. Every arrangement was
 * measured against the headline's box rather than eyeballed — at 375, 640,
 * 1280 and 1440 no tile touches the h1 or the eyebrow.
 */
const DRIFT: Drift[] = [
  {
    slug: "coconut",
    place:
      "left-[-2%] top-[12%] w-[clamp(78px,10.5vw,164px)] sm:left-[-1%] sm:top-[14%] lg:left-[4%] lg:top-[17%]",
    y: 8,
    rot: -2,
    scale: 1.02,
    duration: 5.6,
    delay: 0,
    depth: 1,
  },
  {
    slug: "cardamom",
    place:
      "right-[-3%] top-[7%] w-[clamp(72px,9.6vw,152px)] sm:right-[-2%] sm:top-[10%] lg:right-[6%] lg:top-[13%]",
    y: 10,
    rot: -2,
    scale: 1.015,
    duration: 6.8,
    delay: -2.1,
    depth: 0.7,
  },
  {
    slug: "peanut",
    place:
      "left-[-2%] bottom-[27%] w-[clamp(70px,9.2vw,146px)] sm:left-[1%] sm:bottom-[25%] lg:left-[5%] lg:bottom-[19%]",
    y: 6,
    rot: 3,
    scale: 0.985,
    duration: 4.4,
    delay: -1.3,
    depth: 0.85,
  },
  {
    slug: "butter",
    place:
      "right-[-2%] bottom-[31%] w-[clamp(76px,10vw,158px)] sm:right-[2%] sm:bottom-[29%] lg:right-[4%] lg:bottom-[23%]",
    y: 7,
    rot: 4,
    scale: 0.99,
    duration: 5,
    delay: -0.7,
    depth: 0.55,
  },
];

function Ingredient({
  drift,
  pointerX,
  pointerY,
  interactive,
}: {
  drift: Drift;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  interactive: boolean;
}) {
  // Hooks run on every render whether or not the tilt is used — `interactive`
  // decides what reaches `style`, never whether a hook is called.
  const rotateY = useTransform(pointerX, (v) => v * MAX_TILT * drift.depth);
  const rotateX = useTransform(pointerY, (v) => -v * MAX_TILT * drift.depth);
  const x = useTransform(pointerX, (v) => v * MAX_SHIFT * drift.depth);
  const y = useTransform(pointerY, (v) => v * MAX_SHIFT * drift.depth);

  return (
    <motion.div
      className={`absolute ${drift.place}`}
      style={
        interactive
          ? { rotateX, rotateY, x, y, transformPerspective: 900 }
          : undefined
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- the SVG ships
          as-is; next/image would need dangerouslyAllowSVG and gains nothing
          on a file the optimiser passes straight through. */}
      <img
        src={`/ingredient/${drift.slug}.svg`}
        alt=""
        /*
         * The intrinsic 768x512 is declared so the box reserves its 3:2
         * ratio before the file lands — the tile is absolutely positioned
         * and cannot shift the page, and this keeps it from resizing
         * itself either.
         */
        width={768}
        height={512}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        draggable={false}
        className="ingredient-float block h-auto w-full select-none"
        style={
          {
            "--f-y": `${drift.y}px`,
            "--f-rot": `${drift.rot}deg`,
            "--f-scale": drift.scale,
            "--f-dur": `${drift.duration}s`,
            "--f-delay": `${drift.delay}s`,
          } as CSSProperties
        }
      />
    </motion.div>
  );
}

/**
 * Drops the four ingredients into the nearest positioned ancestor. Purely
 * decorative: `aria-hidden`, empty alts, and no pointer target.
 *
 * Sits at `z-scene` and must be rendered AFTER any in-section canvas — same
 * layer, later in the DOM, so it paints over the 3D and still stays under
 * `z-content` copy.
 */
export default function FloatingIngredients({
  className = "",
}: {
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();
  const interactive = !reduced && !touch;

  // -1..1 across the viewport on each axis, softened by the shared spring.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, spring.soft);
  const pointerY = useSpring(rawY, spring.soft);

  useEffect(() => {
    if (!interactive) return;

    // One listener for all four tiles, coalesced to one write per frame.
    let frame = 0;
    let cx = 0;
    let cy = 0;

    const flush = () => {
      frame = 0;
      rawX.set((cx / window.innerWidth) * 2 - 1);
      rawY.set((cy / window.innerHeight) * 2 - 1);
    };

    const onMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [interactive, rawX, rawY]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-scene ${className}`}
    >
      {DRIFT.map((drift) => (
        <Ingredient
          key={drift.slug}
          drift={drift}
          pointerX={pointerX}
          pointerY={pointerY}
          interactive={interactive}
        />
      ))}
    </div>
  );
}
