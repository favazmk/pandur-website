"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import { CONSISTENCY_STAGES, OVEN_TIMELINE } from "@/lib/consistencyJourney";

export default function OvenStage({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced?: boolean;
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

  if (reduced) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
        <h2 className="text-display font-display font-black text-cocoa">45 YEARS IN THE OVEN.</h2>
        <p className="mt-4 text-lead text-ash max-w-md text-center">Four decades of bakery craft behind every batch.</p>
      </div>
    );
  }

  return (
    <motion.div style={{ opacity: stageOpacity }} className="absolute inset-0 pointer-events-none">
      
      {/* Abstract Oven Tunnel (Radial Glow + Heat Waves) */}
      <motion.div 
        style={{ scale: tunnelScale }}
        className="absolute inset-0 flex items-center justify-center transform-origin-center"
      >
        <div className="w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(197,34,31,0.1)_0%,rgba(122,71,24,0.05)_40%,transparent_70%)] blur-2xl" />
      </motion.div>

      {/* Floating 45 Background Number with Subtle Context Label */}
      <motion.div 
        style={{ scale: tunnelScale, opacity: giantOpacity }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span className="text-[40vw] leading-none font-display font-black text-cocoa">45</span>
        <span className="mt-4 text-xs md:text-sm font-black uppercase tracking-[0.3em] text-cocoa">
          Years in the oven
        </span>
      </motion.div>

      {/* Animated Timeline Counters */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs text-center z-0">
        {OVEN_TIMELINE.map((item, i) => {
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
              key={item.value}
              style={{ opacity: i === OVEN_TIMELINE.length - 1 ? finalOpacity : pOpacity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-6xl md:text-8xl font-black text-cocoa/20 font-display">
                {item.value}
              </span>
            </motion.div>
          );
        })}
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
