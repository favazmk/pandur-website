"use client";

import { useTransform, motion, type MotionValue } from "motion/react";
import { CONSISTENCY_STAGES, OVEN_TIMELINE } from "@/lib/consistencyJourney";

/*
 * One counter on the oven timeline.
 *
 * Its own component so its two transforms are top-level hooks. Called from
 * inside the `.map()` they would be hooks in a callback — which happens to
 * work while the list length never changes, and stops working the moment
 * anything above it returns early.
 */
function TimelineNumber({
  progress,
  item,
  isLast,
  end,
}: {
  progress: MotionValue<number>;
  item: (typeof OVEN_TIMELINE)[number];
  isLast: boolean;
  end: number;
}) {
  // Each number fades in and out around its progress point
  const pOpacity = useTransform(
    progress,
    [item.progress - 0.02, item.progress, item.progress + 0.02],
    [0, 1, 0]
  );
  // Except the last one (45), which stays until the end text
  const finalOpacity = useTransform(
    progress,
    [item.progress - 0.02, item.progress, end * 0.8],
    [0, 1, 1]
  );

  return (
    <motion.div
      style={{ opacity: isLast ? finalOpacity : pOpacity }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <span className="text-6xl md:text-8xl font-black text-cocoa/20 font-display">
        {item.value}
      </span>
    </motion.div>
  );
}

export default function OvenStage({
  progress,
  animate,
}: {
  progress: MotionValue<number>;
  animate: boolean;
}) {
  const { start, end } = CONSISTENCY_STAGES.OVEN;

  // Fade out entire stage at the very end to prevent overlapping with text reveal
  const stageOpacity = useTransform(
    progress,
    [end - 0.02, end],
    [1, 0]
  );

  // Oven tunnel scale & opacity (zooms past the camera)
  const tunnelScale = useTransform(progress, [start, end], [0.8, 4.0]);

  // Giant 45 opacity: appears alongside the final text
  const giantOpacity = useTransform(progress, [end * 0.6, end * 0.7, end * 0.9, end * 0.98], [0, 0.1, 0.1, 0]);

  // Final text reveal: enters earlier, stays at full opacity, then fades out at the very end
  const textOpacity = useTransform(progress, [end * 0.6, end * 0.7, end * 0.9, end * 0.98], [0, 1, 1, 0]);
  const textY = useTransform(progress, [end * 0.6, end * 0.7], [20, 0]);

  return (
    <motion.div style={{ opacity: stageOpacity }} className="absolute inset-0 pointer-events-none">

      {/* Abstract Oven Tunnel (Radial Glow + Heat Waves) */}
      <motion.div
        style={animate ? { scale: tunnelScale } : undefined}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(197,34,31,0.1)_0%,rgba(122,71,24,0.05)_40%,transparent_70%)] blur-2xl" />
      </motion.div>

      {/* Floating 45 Background Number with Subtle Context Label */}
      <motion.div
        /* The zoom is motion; the fade is presence. Reduced motion keeps the
           second and drops the first. */
        style={animate ? { scale: tunnelScale, opacity: giantOpacity } : { opacity: giantOpacity }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span className="text-[40vw] leading-none font-display font-black text-cocoa">45</span>
        <span className="mt-4 text-xs md:text-sm font-black uppercase tracking-[0.3em] text-cocoa">
          Years in the oven
        </span>
      </motion.div>

      {/* Animated Timeline Counters */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs text-center z-0">
        {OVEN_TIMELINE.map((item, i) => (
          <TimelineNumber
            key={item.value}
            progress={progress}
            item={item}
            isLast={i === OVEN_TIMELINE.length - 1}
            end={end}
          />
        ))}
      </div>

      {/* Final Text Reveal */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-x-0 bottom-24 flex flex-col items-center justify-center text-center px-6 z-50"
      >
        <h2 className="text-3xl md:text-5xl font-display font-black text-cocoa uppercase tracking-tight">
          45 Years in the Oven.
        </h2>
        <p className="mt-4 text-sm md:text-base font-medium text-ash max-w-md">
          Four decades of bakery craft behind every batch.
        </p>
      </motion.div>

    </motion.div>
  );
}
