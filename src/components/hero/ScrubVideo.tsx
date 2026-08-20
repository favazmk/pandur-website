"use client";

import { useEffect, useRef, type RefObject } from "react";

/* ------------------------------------------------------------------
   A video whose playhead is scroll, not time.

   It is never played. `currentTime` is driven by how far the pinned
   section has travelled, so scrolling down runs it forward and
   scrolling up runs it backward at whatever rate the visitor moves.

   THE PLAYHEAD IS DAMPED, NOT WRITTEN DIRECTLY. Mapping scroll
   straight onto `currentTime` means the film stops the instant the
   wheel stops, which is what reads as a jerk — the page keeps gliding
   under Lenis while the picture has already frozen. Instead the scroll
   position sets a TARGET and the playhead eases toward it every frame,
   so the film keeps moving for a few frames after the wheel does and
   arrives rather than stops.

   TWO THINGS THIS DELIBERATELY DOES NOT DO, both of which broke it:

   1. It does not hold the duration in React state. `preload="auto"`
      on a server-rendered element means the browser can finish
      loading metadata BEFORE React hydrates and attaches a
      `loadedmetadata` handler — the event fires into the void, the
      state stays 0, and a guard on it swallows every scroll update
      silently. The duration is read off the element at write time,
      where it cannot be stale.

   2. It does not measure through a scroll library. Progress comes
      from the section's own `getBoundingClientRect()` on a plain
      scroll listener, so it is independent of Lenis, of Motion's
      frame loop, and of anything else that might not be running.
   ------------------------------------------------------------------ */

/**
 * How much of the remaining distance the playhead covers each frame.
 * Lower is smoother and laggier. At 0.12 the film settles in about a
 * fifth of a second — long enough to glide, short enough that it never
 * feels disconnected from the wheel.
 */
const EASE = 0.12;

/** Below this the playhead has arrived and the loop can stop. */
const SETTLED = 0.004;

export default function ScrubVideo({
  /** the pinned section — its travel past the viewport is the playhead */
  targetRef,
  src,
  poster,
  className = "",
}: {
  targetRef: RefObject<HTMLElement | null>;
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = targetRef.current;
    const v = ref.current;
    if (!el || !v) return;

    let target = 0;
    let current = -1; // -1 until the first frame, so it starts where it should
    let frame = 0;

    const measure = () => {
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      if (travel <= 0) return null;
      return Math.min(1, Math.max(0, -r.top / travel));
    };

    const loop = () => {
      const d = v.duration;
      if (!d || Number.isNaN(d)) {
        // metadata not in yet — keep the loop alive rather than dropping it
        frame = requestAnimationFrame(loop);
        return;
      }

      /*
       * Held a hair short of the end. Seeking exactly to `duration` puts some
       * browsers into the ended state, which blanks the frame at the one
       * moment the hero is fully in view.
       */
      const want = target * (d - 0.05);
      if (current < 0) current = want;

      const gap = want - current;
      current = Math.abs(gap) < SETTLED ? want : current + gap * EASE;
      v.currentTime = current;

      frame = Math.abs(want - current) > 0 ? requestAnimationFrame(loop) : 0;
    };

    const onScroll = () => {
      const p = measure();
      if (p === null) return;
      target = p;
      if (!frame) frame = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // However the metadata arrives — before hydration or after — sync then.
    v.addEventListener("loadedmetadata", onScroll);
    v.addEventListener("durationchange", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      v.removeEventListener("loadedmetadata", onScroll);
      v.removeEventListener("durationchange", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetRef]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      // Decorative: the copy over it carries the meaning, and a scrubbed
      // video is not something a screen reader can usefully narrate.
      aria-hidden
      tabIndex={-1}
      className={className}
    />
  );
}
