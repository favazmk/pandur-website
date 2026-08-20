"use client";

import { useEffect, useRef, type RefObject } from "react";

/* ------------------------------------------------------------------
   The hero's three lines, one on screen at a time.

   This does NOT go through a motion value. The windows below are
   disjoint arithmetic — a line is fully gone before the next begins —
   but expressing them as three transforms still produced two lines on
   screen together, and the delivery was the part that could not be
   verified. So progress is measured here, from the section's own
   `getBoundingClientRect()`, and opacity is written straight onto the
   nodes. Same mechanism as ScrubVideo, same reason.

   `visibility` is set as well as `opacity`. A fully transparent
   element still occupies its stacking position, and these three are
   stacked on top of each other — hiding it outright is what makes
   "one at a time" a guarantee rather than a hope.
   ------------------------------------------------------------------ */

export type Beat = {
  text: string;
  note: string;
  /** the window this line owns, in scroll progress */
  in: number;
  out: number;
};

/** How long a line takes to arrive and to leave, in scroll progress. */
export const FADE = 0.07;

/** Below this a line is treated as gone and taken out of the stack. */
const GONE = 0.01;

export default function HeroBeats({
  targetRef,
  beats,
  active,
  className = "",
}: {
  targetRef: RefObject<HTMLElement | null>;
  beats: Beat[];
  /** false when the hero is not pinned — the first line simply stays up */
  active: boolean;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = wrap.current;
    const el = targetRef.current;
    if (!box || !el) return;

    const items = Array.from(box.children) as HTMLElement[];

    if (!active) {
      items.forEach((node, i) => {
        node.style.opacity = i === 0 ? "1" : "0";
        node.style.visibility = i === 0 ? "visible" : "hidden";
      });
      return;
    }

    let frame = 0;

    const write = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      if (travel <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / travel));

      items.forEach((node, i) => {
        const b = beats[i];
        let o = 0;
        if (p >= b.in && p <= b.out) {
          // the first line is already up at rest; the last one never leaves
          const rising = i === 0 ? 1 : (p - b.in) / FADE;
          const falling = i === beats.length - 1 ? 1 : (b.out - p) / FADE;
          o = Math.max(0, Math.min(1, rising, falling));
        }
        node.style.opacity = String(o);
        node.style.visibility = o < GONE ? "hidden" : "visible";
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetRef, beats, active]);

  return (
    <div ref={wrap} className={className}>
      {beats.map((b) => (
        <div
          key={b.in}
          className="absolute inset-x-0 top-0"
          // hidden until the effect runs, so nothing flashes stacked on load
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <p className="text-hero-split font-display font-black text-balance text-ink">
            {b.text}
          </p>
          <p className="text-eyebrow mt-4 text-ash lg:text-ink/70">{b.note}</p>
        </div>
      ))}
    </div>
  );
}
