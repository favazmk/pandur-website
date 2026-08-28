"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import { CONSISTENCY_STAGES } from "@/lib/consistencyJourney";

type Clone = { id: number; trigger: number; dx: number; dy: number };

/*
 * One cloned cookie.
 *
 * Its own component so its two transforms are top-level hooks rather than
 * hooks inside a `.map()` callback.
 */
function CloneCookie({
  progress,
  clone,
  animate,
}: {
  progress: MotionValue<number>;
  clone: Clone;
  animate: boolean;
}) {
  // Pop out from center
  const cloneScale = useTransform(progress, [clone.trigger, clone.trigger + 0.04], [0, 1]);
  const cloneOp = useTransform(progress, [clone.trigger, clone.trigger + 0.02], [0, 1]);

  /*
   * Scale down the spread on mobile to keep them in view. `--is-mobile` and
   * `--is-desktop` are defined once on `:root` in globals.css; exactly one of
   * them is 1 at any width.
   */
  const place = {
    x: `calc(${clone.dx}px * var(--is-desktop) + ${clone.dx * 0.4}px * var(--is-mobile))`,
    y: `calc(${clone.dy}px * var(--is-desktop) + ${clone.dy * 0.4}px * var(--is-mobile))`,
  };

  return (
    <motion.div
      /* The pop is motion; the fade is presence. */
      style={animate ? { scale: cloneScale, opacity: cloneOp, ...place } : { opacity: cloneOp, ...place }}
      className="absolute inset-0 flex items-center justify-center z-10"
    >
      <Image
        src="/products/gcc-cookie.webp"
        alt="Pandur Cookie Clone"
        width={180}
        height={180}
        className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-xl"
      />
    </motion.div>
  );
}

export default function CloneStage({
  progress,
  animate,
}: {
  progress: MotionValue<number>;
  animate: boolean;
}) {
  const { start, end } = CONSISTENCY_STAGES.CLONES;

  // Stage appears after Oven
  const stageOpacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

  // Background conveyor line: draws itself in, then holds.
  const railScaleX = useTransform(progress, [start, start + 0.1], [0, 1]);
  const railOpacity = useTransform(progress, [start, start + 0.05], [0, 1]);

  // Clone configurations: 10 cookies + 1 central cookie tracing a perfectly spaced sideways "8" (infinity symbol)
  const clones: Clone[] = [
    { id: 1, trigger: start + 0.01, dx: 90, dy: -150 },     // Right lobe, top inner
    { id: 2, trigger: start + 0.015, dx: 260, dy: -150 },   // Right lobe, top outer
    { id: 3, trigger: start + 0.02, dx: 350, dy: 0 },       // Right lobe, far right
    { id: 4, trigger: start + 0.025, dx: 260, dy: 150 },    // Right lobe, bottom outer
    { id: 5, trigger: start + 0.03, dx: 90, dy: 150 },      // Right lobe, bottom inner
    // Crosses through the pre-existing central cookie at (0,0)
    { id: 6, trigger: start + 0.04, dx: -90, dy: -150 },    // Left lobe, top inner
    { id: 7, trigger: start + 0.045, dx: -260, dy: -150 },  // Left lobe, top outer
    { id: 8, trigger: start + 0.05, dx: -350, dy: 0 },      // Left lobe, far left
    { id: 9, trigger: start + 0.055, dx: -260, dy: 150 },   // Left lobe, bottom outer
    { id: 10, trigger: start + 0.06, dx: -90, dy: 150 },    // Left lobe, bottom inner
  ];

  // Text reveal: wait for clones to pop into place, then fade in
  const textOpacity = useTransform(progress, [start + 0.09, start + 0.12, end - 0.02, end], [0, 1, 1, 0]);
  const textY = useTransform(progress, [start + 0.09, start + 0.12], [20, 0]);

  return (
    <motion.div style={{ opacity: stageOpacity }} className="absolute inset-0 pointer-events-none flex items-center justify-center">

      {/* Background Conveyor Line */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-0.5 bg-ink/10 border-t border-dashed border-ink/20"
        style={animate ? { scaleX: railScaleX, opacity: railOpacity } : { opacity: railOpacity }}
      />

      {/* Center Original Cookie is handled by ConsistencyJourney wrapper */}

      {/* Cloned Cookies */}
      {clones.map((clone) => (
        <CloneCookie key={clone.id} progress={progress} clone={clone} animate={animate} />
      ))}

      {/* Typography */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-x-0 top-24 md:top-32 flex flex-col items-center justify-center text-center px-6 z-50"
      >
        <div className="bg-cream/85 md:bg-cream/40 md:backdrop-blur-md px-6 py-4 md:px-10 md:py-6 rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(58,35,24,0.1)]">
          <h2 className="text-3xl md:text-5xl font-display font-black text-cocoa uppercase tracking-tight">
            Every Batch Runs<br/>The Same Way.
          </h2>
          <p className="mt-2 md:mt-4 text-xs md:text-sm font-bold text-ash max-w-md uppercase tracking-widest">
            The cookie a shop orders in Ras Al Khaimah is the cookie they got in Sharjah.
          </p>
        </div>
      </motion.div>

    </motion.div>
  );
}
