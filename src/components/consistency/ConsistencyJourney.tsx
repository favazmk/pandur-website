"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScroll, useSpring, useTransform, motion } from "motion/react";
import { useClientValue, usePrefersReducedMotion } from "@/lib/useMedia";

// Sub-stages
import OvenStage from "./OvenStage";
import CloneStage from "./CloneStage";
import QualityStage from "./QualityStage";
import ShelfLifeStage from "./ShelfLifeStage";

/* ==================================================================
   FROM OVEN TO SHELF — one pinned section, four stages, one timeline.

   The same shape as the flavour showcase: a tall track, a stage inside
   it that is `sticky` and one viewport high, and one `useScroll`
   MotionValue that every stage composes off. No state, no scroll
   listener, so a scroll frame writes transforms and never renders.

   REDUCED MOTION is a value, not a branch. Every stage renders the
   same elements and calls the same hooks either way; `animate` only
   decides whether the decorative transforms — the oven zoom, the
   clone pop, the radial spread, the cookie's spin — are wired up.
   Presence still crossfades, so nothing becomes unreachable.

   Two things follow from that, and both are deliberate:

     - No stage may return early on `reduced`. `usePrefersReducedMotion`
       reads false through hydration and flips true straight after, so
       an early return changes the hook count between two renders and
       React tears the whole tree down.
     - The track's height belongs to `.consistency-track` in
       globals.css, not to a Tailwind class here. Deciding 1500vh vs
       200vh in JS would resize the section after hydration and drag
       the scroll position with it.
   ================================================================== */

export default function ConsistencyJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  /*
   * `useClientValue` over `useSyncExternalStore`, the same helper the hero and
   * the showcase use: an explicit server snapshot, so there is no hydration
   * mismatch and no cascading render on mount.
   */
  const mounted = useClientValue(() => true, false);
  const animate = mounted && !reduced;

  // Master timeline for the entire section.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const damped = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 36,
    mass: 0.2,
    restDelta: 0.0001,
  });

  /* Reduced motion takes the raw value: nothing should lag behind the scroll
     for someone who asked the interface to stop moving on its own. */
  const progress = reduced ? scrollYProgress : damped;

  // Persistent Cookie: rotates with scroll, stays exactly centered.
  const cookieRotate = useTransform(progress, [0, 1], [0, 360 * 3]); // 3 full rotations over the entire section

  return (
    <section
      ref={ref}
      id="consistency-journey"
      aria-label="Pandur Production and Consistency Journey"
      /* Height lives in globals.css — see the note above. */
      className="consistency-track relative bg-cream"
    >
      <div className="sticky top-0 isolate flex h-screen w-full flex-col items-center justify-center overflow-hidden">

        {/* PERSISTENT CENTRAL HERO COOKIE (NEVER FADES) */}
        <motion.div
          style={animate ? { rotate: cookieRotate } : undefined}
          className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
        >
          <Image
            src="/products/gcc-cookie.webp"
            alt="Pandur Cookie"
            width={280}
            height={280}
            // Fixed size mapping across breakpoints to match exactly what the clones/stages expect
            className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Stage 01 — 45 Years in the Oven */}
        <OvenStage progress={progress} animate={animate} />

        {/* Stage 02 — Every Batch (Clones) */}
        <CloneStage progress={progress} animate={animate} />

        {/* Stage 03 — Quality Checkpoints & Destinations */}
        <QualityStage progress={progress} animate={animate} />

        {/* Stage 04 — Six Months on Shelf */}
        <ShelfLifeStage progress={progress} animate={animate} />

      </div>
    </section>
  );
}
