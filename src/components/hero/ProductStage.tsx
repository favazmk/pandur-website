"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import { BEAT, CROSSOVER, HERO_PRODUCTS } from "@/lib/heroLayers";

/* ------------------------------------------------------------------
   The two packs, trading places once across the pin.

   Both are genuine alpha cut-outs, so this rebuilds the look of the
   delivered scene shots from parts rather than zooming a flat photo —
   which is the whole reason for layering them.

   They go through `next/image`: the sources are ~2MB PNGs and the
   optimiser serves AVIF/WebP at the rendered size without touching the
   files on disk. The lead pack is `priority` because it is the LCP
   candidate; the trailing one is not.

   `drop-shadow` rather than `box-shadow` — the shadow has to follow the
   cut-out silhouette, not the bounding box, or the pack reads as a
   sticker laid on the page. It shadows the transparent PNG; it does not
   blur the artwork.
   ------------------------------------------------------------------ */

const SHADOW =
  "drop-shadow-[0_28px_38px_rgba(58,35,24,0.16)] drop-shadow-[0_6px_10px_rgba(58,35,24,0.10)]";

export default function ProductStage({
  progress,
  animate,
}: {
  progress: MotionValue<number>;
  /** false on mobile and under reduced motion — the stage renders landed */
  animate: boolean;
}) {
  const [lead, trail] = HERO_PRODUCTS;

  // Butter leads at rest and hands over to cardamom. The stops are the beat
  // table: nothing moves before `hold`, everything has settled by `swap`.
  const stops = [0, BEAT.hold, BEAT.swap, 1];

  const leadOpacity = useTransform(progress, stops, [1, 1, 0.32, 0.32]);
  const leadScale = useTransform(progress, stops, [1, 1, 0.82, 0.8]);
  const leadX = useTransform(progress, stops, ["0%", "0%", "-9%", "-10%"]);
  const leadY = useTransform(progress, stops, ["0%", "0%", "6%", "7%"]);

  const trailOpacity = useTransform(progress, stops, [0.34, 0.34, 1, 1]);
  const trailScale = useTransform(progress, stops, [0.82, 0.82, 1, 1]);
  const trailX = useTransform(progress, stops, ["8%", "8%", "0%", "0%"]);
  const trailY = useTransform(progress, stops, ["5%", "5%", "0%", "0%"]);

  // zIndex cannot tween, so it steps — at the crossover, where the two are
  // closest in opacity and the swap is invisible.
  const leadZ = useTransform(progress, [0, CROSSOVER, CROSSOVER + 0.001, 1], [2, 2, 1, 1]);
  const trailZ = useTransform(progress, [0, CROSSOVER, CROSSOVER + 0.001, 1], [1, 1, 2, 2]);

  return (
    <div className="relative aspect-[5/4] w-full sm:aspect-[4/3] lg:aspect-square">
      <motion.div
        className={`absolute ${lead.place}`}
        style={
          animate
            ? {
                opacity: leadOpacity,
                scale: leadScale,
                x: leadX,
                y: leadY,
                zIndex: leadZ,
              }
            : { zIndex: 2 }
        }
      >
        <Image
          src={lead.src}
          alt={lead.alt}
          width={lead.width}
          height={lead.height}
          priority
          sizes="(max-width: 640px) 74vw, (max-width: 1024px) 52vw, 34vw"
          className={`h-auto w-full ${SHADOW}`}
        />
      </motion.div>

      <motion.div
        className={`absolute ${trail.place}`}
        style={
          animate
            ? {
                opacity: trailOpacity,
                scale: trailScale,
                x: trailX,
                y: trailY,
                zIndex: trailZ,
              }
            : { zIndex: 1, opacity: 0.34, scale: 0.82 }
        }
      >
        <Image
          src={trail.src}
          alt={trail.alt}
          width={trail.width}
          height={trail.height}
          sizes="(max-width: 640px) 66vw, (max-width: 1024px) 46vw, 30vw"
          className={`h-auto w-full ${SHADOW}`}
        />
      </motion.div>
    </div>
  );
}
