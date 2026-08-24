"use client";

import { useTransform, motion, type MotionValue } from "motion/react";
import { CONSISTENCY_STAGES, SHELF_TIMELINE } from "@/lib/consistencyJourney";
import { polar } from "@/lib/motion";

/*
 * One mark on the shelf-life dial.
 *
 * Its own component so its opacity transform is a top-level hook rather than
 * a hook inside a `.map()` callback.
 */
function TimelineMark({
  progress,
  mark,
}: {
  progress: MotionValue<number>;
  mark: (typeof SHELF_TIMELINE)[number];
}) {
  /*
   * Position on the circle uses the explicit angle provided in SHELF_TIMELINE.
   *
   * The radius is `--dial-label-r`, defined on `.shelf-dial` in globals.css and
   * derived from the same `--dial-r` the ring is sized from — so the marks
   * cannot drift off the circle again. It has to be a CSS length rather than a
   * pixel figure worked out here: the value depends on the viewport width, and
   * only CSS can re-evaluate that on resize without a re-render.
   *
   * The trigonometry stays in JS — `calc()` has no `Math.cos()` — and only the
   * finished unitless ratio goes into the calc, where it multiplies the length.
   * `polar` rather than raw `Math.cos`/`Math.sin`: the result is serialised into
   * an SSR'd style string, and the two engines disagree in the last bit. See
   * the note on `polar` in lib/motion.
   */
  const { cos, sin } = polar(mark.angle);

  const markOpacity = useTransform(progress, [mark.progress - 0.02, mark.progress], [0, 1]);

  return (
    <motion.div
      style={{
        opacity: markOpacity,
        x: `calc(${cos} * var(--dial-label-r))`,
        y: `calc(${sin} * var(--dial-label-r))`,
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
}

export default function ShelfLifeStage({
  progress,
  animate,
}: {
  progress: MotionValue<number>;
  animate: boolean;
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
  const textOpacity = useTransform(progress, [start + 0.05, start + 0.08], [0, 1]);
  const textY = useTransform(progress, [start + 0.05, start + 0.08], [20, 0]);

  return (
    <motion.div style={{ opacity: stageOpacity }} className="shelf-dial absolute inset-0 pointer-events-none flex items-center justify-center bg-cocoa">

      {/* Timeline Dial SVG */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          /* 2.5x `--dial-r`, because the circle is drawn at r=160 on a
             400-unit viewBox. See `.shelf-dial` in globals.css. */
          style={{ width: "var(--dial-size)", height: "var(--dial-size)" }}
        >
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
            style={animate ? { strokeDashoffset: dashOffset } : { strokeDashoffset: 0 }}
            className="rotate-180" // Start at 9 o'clock (left)
          />
        </svg>
      </div>

      {/* Timeline Labels */}
      {SHELF_TIMELINE.map((mark) => (
        <TimelineMark
          key={mark.label}
          progress={progress}
          mark={mark}
        />
      ))}

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

    </motion.div>
  );
}
