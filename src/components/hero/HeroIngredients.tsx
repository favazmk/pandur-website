"use client";

import type { CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import {
  FLOAT_CADENCE,
  HERO_INGREDIENTS,
  PARALLAX,
  type HeroIngredient,
} from "@/lib/heroLayers";

/* ------------------------------------------------------------------
   The ingredient illustrations, on two planes around the products.

   Two transforms are in play per layer and they cannot share an
   element: CSS keyframes drive the idle float, and Motion drives the
   scroll parallax. `transform` is one property, so the two would
   overwrite each other every frame. Outer div takes the scroll, inner
   div takes the float.

   Artwork is placed as delivered — no recolour, no redraw, no filter.
   Depth is expressed through scale, ink and travel, never through blur.
   ------------------------------------------------------------------ */

function Layer({
  layer,
  progress,
  parallax,
}: {
  layer: HeroIngredient;
  progress: MotionValue<number>;
  /** false on mobile and under reduced motion — the float still runs */
  parallax: boolean;
}) {
  const travel =
    (layer.plane === "far" ? PARALLAX.far : PARALLAX.near) * layer.depth;

  // Hooks run every render; `parallax` decides what reaches `style`.
  const y = useTransform(progress, [0, 1], [0, travel]);

  const c = FLOAT_CADENCE[layer.cadence % FLOAT_CADENCE.length];

  return (
    <motion.div
      className={`absolute ${layer.place}`}
      style={parallax ? { y } : undefined}
    >
      <div
        className="ingredient-float"
        style={
          {
            // Far layers sit back by being smaller and fainter, which is what
            // distance actually looks like on a flat page. Never by blurring.
            opacity: 0.45 + layer.depth * 0.55,
            "--f-y": `${c.y}px`,
            "--f-rot": `${c.rot}deg`,
            "--f-scale": c.scale,
            "--f-dur": `${c.duration}s`,
            "--f-delay": `${c.delay}s`,
          } as CSSProperties
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ships as-is;
            next/image would need dangerouslyAllowSVG and gains nothing on a
            file the optimiser passes straight through. */}
        <img
          src={`/ingredient/${layer.slug}.webp`}
          alt=""
          aria-hidden
          width={768}
          height={512}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          draggable={false}
          className="block h-auto w-full select-none"
        />
      </div>
    </motion.div>
  );
}

export default function HeroIngredients({
  plane,
  progress,
  parallax,
}: {
  plane: "far" | "near";
  progress: MotionValue<number>;
  parallax: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${
        plane === "far" ? "z-scene" : "z-rail"
      }`}
    >
      {HERO_INGREDIENTS.filter((l) => l.plane === plane).map((l) => (
        <Layer key={l.slug} layer={l} progress={progress} parallax={parallax} />
      ))}
    </div>
  );
}
