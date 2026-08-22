"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import { CONSISTENCY_STAGES, QUALITY_CHECKPOINTS, DESTINATIONS } from "@/lib/consistencyJourney";

export default function QualityStage({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  const { start, end } = CONSISTENCY_STAGES.QUALITY;

  // Fade in over the clones, fade out before shelf
  const stageOpacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

  // Text reveal: appears early, holds, fades out right before spreading
  const textOpacity = useTransform(progress, [start + 0.02, start + 0.06, end - 0.12, end - 0.08], [0, 1, 1, 0]);
  const textY = useTransform(progress, [start + 0.02, start + 0.06], [20, 0]);

  // Cookie Spread for Destinations: happens earlier so it holds for a moment
  const spreadProgress = useTransform(progress, [end - 0.12, end - 0.04], [0, 1]);

  if (reduced) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
        <h2 className="text-display font-display font-black text-cocoa">CONSISTENT, EVERY BATCH.</h2>
        <p className="mt-4 text-lead text-ash max-w-md text-center">Controlled production, repeatable results.</p>
      </div>
    );
  }

  return (
    <motion.div style={{ opacity: stageOpacity }} className="absolute inset-0 pointer-events-none flex items-center justify-center">
      
      {/* Typography */}
      <motion.div 
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-x-0 bottom-24 md:bottom-32 flex flex-col items-center justify-center text-center px-6 z-50"
      >
        <div className="bg-cream/40 backdrop-blur-md px-6 py-4 md:px-10 md:py-6 rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(58,35,24,0.1)]">
          <h2 className="text-3xl md:text-5xl font-display font-black text-cocoa uppercase tracking-tight">
            Consistent,<br/>Every Batch.
          </h2>
          <p className="mt-2 md:mt-4 text-xs md:text-sm font-bold text-ash max-w-md uppercase tracking-widest">
            Controlled production, repeatable results.
          </p>
        </div>
      </motion.div>

      {/* Quality Checkpoints */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex flex-row items-center justify-between px-4 md:px-24 z-0">
        {QUALITY_CHECKPOINTS.map((cp) => {
          // Checkpoint appears, then gets stamped as progress passes it
          const cpOpacity = useTransform(progress, [start + 0.02, start + 0.06], [0, 1]);
          const stampScale = useTransform(progress, [cp.p, cp.p + 0.02], [2, 1]);
          const stampOpacity = useTransform(progress, [cp.p, cp.p + 0.02], [0, 1]);

          return (
            <motion.div key={cp.id} style={{ opacity: cpOpacity }} className="relative flex flex-col items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-ink/10 flex items-center justify-center bg-cream">
                <motion.div 
                  style={{ scale: stampScale, opacity: stampOpacity }}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-deep text-cream flex items-center justify-center"
                >
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
              <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-ash">
                {cp.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Center Original Cookie is handled by ConsistencyJourney wrapper */}

      {/* Cookies spreading to Destinations */}
      {DESTINATIONS.map((dest, i) => {
        // Calculate radial drift
        const rad = dest.angle * (Math.PI / 180);
        const dx = Math.cos(rad) * dest.radius;
        const dy = Math.sin(rad) * dest.radius;
        
        return (
          <motion.div
            key={dest.name}
            style={{ 
              x: useTransform(spreadProgress, [0, 1], [0, dx], { clamp: false }),
              y: useTransform(spreadProgress, [0, 1], [0, dy], { clamp: false }),
              opacity: useTransform(spreadProgress, [0, 0.5], [0, 1]),
            }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <motion.div
              style={{
                scale: 1, // Will wrap in CSS vars to handle scaling down mobile spread
                x: `calc(var(--is-mobile, 0) * ${-dx * 0.3}px)`,
                y: `calc(var(--is-mobile, 0) * ${-dy * 0.3}px)`,
              }}
              className="relative flex items-center justify-center"
            >
              <Image
                src="/products/gcc-cookie.png"
                alt="Pandur Cookie Clone"
                width={180}
                height={180}
                className="w-16 h-16 md:w-28 md:h-28 object-contain drop-shadow-lg relative z-10"
              />
              {/* Destination Label pushed outwards radially */}
              <motion.div 
                style={{ 
                  opacity: useTransform(spreadProgress, [0.4, 0.8], [0, 1]),
                  x: `calc(Math.cos(${rad}) * (50px * var(--is-mobile, 1) + 80px * var(--is-desktop, 0)))`,
                  y: `calc(Math.sin(${rad}) * (50px * var(--is-mobile, 1) + 80px * var(--is-desktop, 0)))`
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <span className="whitespace-nowrap text-[8px] md:text-[10px] font-black uppercase tracking-widest text-cocoa bg-cream/90 backdrop-blur-sm px-2 py-1 rounded-full border border-ink/10 shadow-sm">
                  {dest.name}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* CSS Vars for Responsive Media Queries inside style attributes */}
      <style dangerouslySetInnerHTML={{__html: `
        :root { --is-desktop: 0; --is-mobile: 1; }
        @media (min-width: 768px) { :root { --is-desktop: 1; --is-mobile: 0; } }
      `}} />
    </motion.div>
  );
}
