"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import { CONSISTENCY_STAGES, SHELF_TIMELINE } from "@/lib/consistencyJourney";

export default function ShelfLifeStage({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  const { start, end } = CONSISTENCY_STAGES.SHELF;

  // Stage appears at the end
  const stageOpacity = useTransform(progress, [start, start + 0.05], [0, 1]);

  // Timeline dial drawing
  const dialProgress = useTransform(progress, [start + 0.02, end - 0.05], [0, 1]);
  // SVG stroke-dasharray is circumference (2 * PI * r)
  // For r=160, circ = 1005.3
  const dashOffset = useTransform(dialProgress, [0, 1], [1005.3, 0]);

  // Final text reveal: appears earlier to give user time to read before section ends
  const textOpacity = useTransform(progress, [end - 0.1, end - 0.05], [0, 1]);
  const textY = useTransform(progress, [end - 0.1, end - 0.05], [20, 0]);

  if (reduced) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 bg-cocoa">
        <h2 className="text-display font-display font-black text-cream">BUILT FOR THE SHELF.</h2>
        <p className="mt-4 text-lead text-dough max-w-md text-center">Six months, without trading away taste.</p>
      </div>
    );
  }

  return (
    <motion.div style={{ opacity: stageOpacity }} className="absolute inset-0 pointer-events-none flex items-center justify-center bg-cocoa">
      
      {/* Timeline Dial SVG */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <svg width="400" height="400" viewBox="0 0 400 400" className="w-[320px] h-[320px] md:w-[480px] md:h-[480px]">
          {/* Background track */}
          <circle cx="200" cy="200" r="160" fill="none" stroke="#E8C89A" strokeWidth="2" strokeOpacity="0.15" />
          {/* Active drawing track */}
          <motion.circle 
            cx="200" cy="200" r="160" 
            fill="none" 
            stroke="#E8C89A" 
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1005.3"
            style={{ strokeDashoffset: dashOffset }}
            className="transform-origin-center -rotate-90" // Start at 12 o'clock
          />
        </svg>
      </div>

      {/* Timeline Labels */}
      {SHELF_TIMELINE.map((mark, i) => {
        // Calculate position on the circle
        // The dial maps progress [start+0.02, end-0.05] to [0, 1] (0 to 360 deg)
        // E.g. progress 0.78 corresponds to a specific angle
        
        // This is a simplified positioning for the timeline labels in CSS space
        // 0.78 -> ~0%, 0.96 -> 100% of the dial
        const fraction = (mark.progress - (start + 0.02)) / ((end - 0.05) - (start + 0.02));
        const angle = fraction * 360 - 90; // -90 to start at top
        const rad = angle * (Math.PI / 180);
        
        // Radius matching the SVG (scaled for CSS layout)
        const radiusDesktop = 240;
        const radiusMobile = 160;
        
        const markOpacity = useTransform(progress, [mark.progress - 0.02, mark.progress], [0, 1]);

        return (
          <motion.div
            key={mark.label}
            style={{ 
              opacity: markOpacity,
              x: `calc(${Math.cos(rad) * radiusDesktop}px * var(--is-desktop, 1) + ${Math.cos(rad) * radiusMobile}px * var(--is-mobile, 0))`,
              y: `calc(${Math.sin(rad) * radiusDesktop}px * var(--is-desktop, 1) + ${Math.sin(rad) * radiusMobile}px * var(--is-mobile, 0))`,
            }}
            className="absolute inset-0 flex items-center justify-center z-0"
          >
            <div className="flex items-center gap-3 absolute">
              <div className="w-2 h-2 rounded-full bg-dough" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-cream">
                {mark.label}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Center Original Cookie is handled by ConsistencyJourney wrapper */}

      {/* Final Typography Reveal */}
      <motion.div 
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-x-0 bottom-24 md:bottom-32 flex flex-col items-center justify-center text-center px-6 z-50"
      >
        <div className="bg-ink/30 backdrop-blur-md px-6 py-4 md:px-10 md:py-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-display font-black text-cream uppercase tracking-tight">
            Built for the Shelf.
          </h2>
          <div className="mt-4 md:mt-6 flex items-center justify-center gap-3">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-deep text-cream flex items-center justify-center shrink-0">
              <svg width="10" height="8" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-xs md:text-sm font-bold text-dough max-w-md uppercase tracking-widest text-left">
              Six months, without trading away taste.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CSS Vars for Responsive Layout */}
      <style dangerouslySetInnerHTML={{__html: `
        :root { --is-desktop: 0; --is-mobile: 1; }
        @media (min-width: 768px) { :root { --is-desktop: 1; --is-mobile: 0; } }
      `}} />
    </motion.div>
  );
}
