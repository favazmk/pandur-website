"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import { CONSISTENCY_STAGES } from "@/lib/consistencyJourney";

export default function CloneStage({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  const { start, end } = CONSISTENCY_STAGES.CLONES;

  // Stage appears after Oven
  const stageOpacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

  // Clone configurations (12 total cookies, clustered)
  const clones = [
    { id: 1, trigger: start + 0.02, dx: -240, dy: -120 },
    { id: 2, trigger: start + 0.04, dx: 240, dy: 120 },
    { id: 3, trigger: start + 0.06, dx: -120, dy: 120 },
    { id: 4, trigger: start + 0.08, dx: 120, dy: -120 },
    { id: 5, trigger: start + 0.10, dx: -360, dy: 0 },
    { id: 6, trigger: start + 0.12, dx: 360, dy: 0 },
    { id: 7, trigger: start + 0.13, dx: -240, dy: 120 },
    { id: 8, trigger: start + 0.14, dx: 240, dy: -120 },
    { id: 9, trigger: start + 0.15, dx: -120, dy: -120 },
    { id: 10, trigger: start + 0.16, dx: 120, dy: 120 },
    { id: 11, trigger: start + 0.17, dx: -360, dy: -120 },
    { id: 12, trigger: start + 0.18, dx: 360, dy: 120 },
  ];

  // Text reveal: fade in, hold steady, then fade out
  const textOpacity = useTransform(progress, [start + 0.1, start + 0.15, end - 0.05, end], [0, 1, 1, 0]);
  const textY = useTransform(progress, [start + 0.1, start + 0.15], [20, 0]);

  if (reduced) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 bg-cream">
        <h2 className="text-display font-display font-black text-cocoa">EVERY BATCH RUNS THE SAME WAY.</h2>
        <p className="mt-4 text-lead text-ash max-w-md text-center">The cookie a shop orders in Kalba is the cookie they got in Sharjah.</p>
      </div>
    );
  }

  return (
    <motion.div style={{ opacity: stageOpacity }} className="absolute inset-0 pointer-events-none flex items-center justify-center">
      
      {/* Background Conveyor Line */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-0.5 bg-ink/10 border-t border-dashed border-ink/20"
        style={{
          scaleX: useTransform(progress, [start, start + 0.1], [0, 1]),
          opacity: useTransform(progress, [start, start + 0.05], [0, 1]),
        }}
      />

      {/* Center Original Cookie is handled by ConsistencyJourney wrapper */}

      {/* Cloned Cookies */}
      {clones.map((clone) => {
        // Pop out from center
        const cloneScale = useTransform(progress, [clone.trigger, clone.trigger + 0.04], [0, 1]);
        const cloneOp = useTransform(progress, [clone.trigger, clone.trigger + 0.02], [0, 1]);
        
        return (
          <motion.div
            key={clone.id}
            style={{ 
              scale: cloneScale, 
              opacity: cloneOp,
              // Scale down the spread on mobile to keep them in view
              x: `calc((${clone.dx}px * var(--is-desktop, 1)) + (${clone.dx * 0.4}px * var(--is-mobile, 0)))`,
              y: `calc((${clone.dy}px * var(--is-desktop, 1)) + (${clone.dy * 0.4}px * var(--is-mobile, 0)))`,
            }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <Image
              src="/products/gcc-cookie.png"
              alt="Pandur Cookie Clone"
              width={180}
              height={180}
              className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-xl"
            />
          </motion.div>
        );
      })}

      {/* Typography */}
      <motion.div 
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-x-0 top-24 md:top-32 flex flex-col items-center justify-center text-center px-6 z-50"
      >
        <div className="bg-cream/40 backdrop-blur-md px-6 py-4 md:px-10 md:py-6 rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(58,35,24,0.1)]">
          <h2 className="text-3xl md:text-5xl font-display font-black text-cocoa uppercase tracking-tight">
            Every Batch Runs<br/>The Same Way.
          </h2>
          <p className="mt-2 md:mt-4 text-xs md:text-sm font-bold text-ash max-w-md uppercase tracking-widest">
            The cookie a shop orders in Kalba is the cookie they got in Sharjah.
          </p>
        </div>
      </motion.div>

      {/* CSS Vars for Responsive Media Queries inside style attributes */}
      <style dangerouslySetInnerHTML={{__html: `
        :root { --is-desktop: 0; --is-mobile: 1; }
        @media (min-width: 768px) { :root { --is-desktop: 1; --is-mobile: 0; } }
      `}} />
    </motion.div>
  );
}
