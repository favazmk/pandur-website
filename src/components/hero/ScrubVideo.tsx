"use client";

import { useEffect, useRef, type RefObject } from "react";

/* ------------------------------------------------------------------
   A video whose playhead is scroll, not time.

   It is never played. `currentTime` is written from how far the pinned
   section has travelled, so scrolling down runs it forward and
   scrolling up runs it backward at whatever rate the visitor moves.

   TWO THINGS THIS DELIBERATELY DOES NOT DO, both of which broke it:

   1. It does not hold the duration in React state. `preload="auto"`
      on a server-rendered element means the browser can finish
      loading metadata BEFORE React hydrates and attaches a
      `loadedmetadata` handler — the event fires into the void, the
      state stays 0, and a guard on it swallows every scroll update
      silently. The duration is read off the element at write time
      instead, where it cannot be stale.

   2. It does not measure through a scroll library. Progress comes
      from the section's own `getBoundingClientRect()` on a plain
      scroll listener, so it is independent of Lenis, of Motion's
      frame loop, and of anything else that might not be running.

   Writes are coalesced to one per animation frame: scroll fires far
   more often than the display refreshes, and seeking a decoder more
   than once a frame only queues work it throws away.
   ------------------------------------------------------------------ */

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

    let frame = 0;

    const write = () => {
      frame = 0;
      const d = v.duration;
      if (!d || Number.isNaN(d)) return;

      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      if (travel <= 0) return;

      const p = Math.min(1, Math.max(0, -r.top / travel));
      /*
       * Held a hair short of the end. Seeking exactly to `duration` puts some
       * browsers into the ended state, which blanks the frame at the one
       * moment the hero is fully in view.
       */
      v.currentTime = p * (d - 0.05);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // However the metadata arrives — before hydration or after — sync then.
    v.addEventListener("loadedmetadata", write);
    v.addEventListener("durationchange", write);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      v.removeEventListener("loadedmetadata", write);
      v.removeEventListener("durationchange", write);
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
