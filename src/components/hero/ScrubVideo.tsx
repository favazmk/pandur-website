"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

/* ------------------------------------------------------------------
   A video whose playhead is scroll, not time.

   It is never played. `currentTime` is written directly from scroll
   progress, so scrolling down runs it forward and scrolling up runs
   it backward at whatever rate the visitor moves.

   The delivered file carried a single keyframe, which makes a seek to
   an arbitrary frame decode from the beginning — the reason scrubbed
   video usually stutters. `public/hero/cookie.mp4` is re-encoded with
   a keyframe every 4 frames, so a seek decodes at most three.

   Writes are coalesced to one per animation frame. Scroll events fire
   far more often than the display refreshes, and seeking a decoder
   more than once a frame only queues work it will throw away.
   ------------------------------------------------------------------ */

export default function ScrubVideo({
  progress,
  src,
  poster,
  className = "",
}: {
  progress: MotionValue<number>;
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  // Latest target, and whether a write is already queued for this frame.
  const target = useRef(0);
  const frame = useRef(0);

  useMotionValueEvent(progress, "change", (p) => {
    if (!duration) return;
    /*
     * Held a hair short of the end. Seeking exactly to `duration` puts some
     * browsers into the ended state, which blanks the frame at the one moment
     * the hero is fully in view.
     */
    target.current = Math.min(Math.max(p, 0), 1) * (duration - 0.05);
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const v = ref.current;
      if (v) v.currentTime = target.current;
    });
  });

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    []
  );

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
      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
      className={className}
    />
  );
}
