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

/**
 * The smallest playhead move worth asking the decoder for.
 *
 * Every write to `currentTime` is a seek, and a seek is not free: the decoder
 * walks from the preceding keyframe to the requested time. Writing it once per
 * animation frame asks for ~60 of those a second, which a desktop absorbs and
 * a phone does not — that is the hero warming the handset up.
 *
 * The film is 24fps, so anything finer than 1/24s cannot change the picture.
 * Rounding requests to that grid drops the seek rate by more than half and is
 * invisible by construction: the frame it would have shown IS the frame it
 * shows. The damping above still runs per frame, so the motion stays smooth —
 * only the requests the decoder cannot act on are dropped.
 */
const FRAME = 1 / 24;

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
        /*
         * No metadata yet, so there is nothing to seek to. STOP the loop
         * rather than rescheduling it.
         *
         * It used to re-request a frame here, which meant that on any device
         * where the metadata never arrived — a phone that downgraded
         * `preload`, a failed request — this ran sixty times a second forever,
         * doing nothing, for the life of the page. The media listeners at the
         * bottom of this effect call `onScroll` on `loadedmetadata`,
         * `durationchange`, `loadeddata` and `canplay`, and any one of them
         * restarts the loop the moment there is something to seek to. A scroll
         * restarts it too. So stopping here costs nothing and cannot strand us.
         */
        frame = 0;
        return;
      }

      /*
       * Priming (below) plays the element for an instant. If anything else
       * ever resumes it, writing `currentTime` underneath a playing video
       * fights the playback clock and the picture judders. Cheap to assert.
       */
      if (!v.paused) v.pause();

      /*
       * Held a hair short of the end. Seeking exactly to `duration` puts some
       * browsers into the ended state, which blanks the frame at the one
       * moment the hero is fully in view.
       */
      const want = target * (d - 0.05);
      if (current < 0) current = want;

      const gap = want - current;
      current = Math.abs(gap) < SETTLED ? want : current + gap * EASE;

      /*
       * Two guards, and they are doing different jobs.
       *
       * `v.seeking` means the decoder has not finished the last request. Piling
       * another one on top does not make it arrive sooner — it lengthens the
       * queue, and on mobile that queue is what turns a scroll into a stutter.
       * Skipping the write here costs nothing: `current` has already advanced,
       * so the next frame asks for a position that is newer still.
       *
       * The FRAME quantise then drops any request that would land on the video
       * frame already on screen.
       */
      if (!v.seeking) {
        const next = Math.round(current / FRAME) * FRAME;
        if (Math.abs(next - v.currentTime) >= FRAME) v.currentTime = next;
      }

      frame = Math.abs(want - current) > 0 ? requestAnimationFrame(loop) : 0;
    };

    const onScroll = () => {
      const p = measure();
      if (p === null) return;
      target = p;
      if (!frame) frame = requestAnimationFrame(loop);
    };

    /*
     * WAKE THE DECODER UP.
     *
     * `preload="auto"` is a hint, and phones are the devices most likely to
     * refuse it: iOS Safari treats it as `metadata` and on a cellular
     * connection often as `none`, and Android Chrome downgrades it under Data
     * Saver. Worse, a `<video>` that has never been played will, on iOS, keep
     * showing its poster no matter what you write to `currentTime` — the
     * decoder pipeline is not running, so a seek has nothing to paint into.
     * That is the "hero sometimes just does not play" case: not a slow
     * download, an element that was never started.
     *
     * Muted + `playsInline` means a play() is permitted without a user
     * gesture, so the fix is to start it and immediately stop it. That is
     * enough to bring the decoder up and make seeks paint. The pause is in the
     * promise callback, so it lands within a frame — no visible motion.
     *
     * If autoplay IS refused (a stricter setting, low power mode), the catch
     * leaves us primed to try again on the visitor's first real interaction,
     * where permission is guaranteed. `once: true` so it costs nothing after.
     */
    let disposed = false;

    const prime = () => {
      if (disposed) return;
      // The browser may not have started fetching at all; ask explicitly.
      if (v.networkState === v.NETWORK_EMPTY) v.load();
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          if (!disposed) v.pause();
          onScroll();
        }).catch(() => {
          // Refused. Fall back to the first gesture, which cannot be refused.
          if (!disposed) {
            window.addEventListener("touchstart", prime, { once: true, passive: true });
            window.addEventListener("pointerdown", prime, { once: true, passive: true });
          }
        });
      } else {
        try { v.pause(); } catch { /* older engines return no promise */ }
        onScroll();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    /*
     * However the data arrives — before hydration or long after — sync then.
     * `loadeddata` and `canplay` are here as well as the metadata events
     * because a phone that deferred the download reaches them late, and each
     * one is a chance to restart a loop that stopped with no duration.
     */
    v.addEventListener("loadedmetadata", onScroll);
    v.addEventListener("durationchange", onScroll);
    v.addEventListener("loadeddata", onScroll);
    v.addEventListener("canplay", onScroll);
    prime();
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      disposed = true;
      v.removeEventListener("loadedmetadata", onScroll);
      v.removeEventListener("durationchange", onScroll);
      v.removeEventListener("loadeddata", onScroll);
      v.removeEventListener("canplay", onScroll);
      window.removeEventListener("touchstart", prime);
      window.removeEventListener("pointerdown", prime);
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
