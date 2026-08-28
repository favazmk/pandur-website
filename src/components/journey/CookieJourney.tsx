"use client";

import { useRef } from "react";
import { useScroll, useSpring } from "motion/react";
import JourneyWorldLayer from "@/components/journey/JourneyWorldLayer";
import JourneyIngredients from "@/components/journey/JourneyIngredients";
import JourneyPlatform from "@/components/journey/JourneyPlatform";
import JourneyCrumbs from "@/components/journey/JourneyCrumbs";
import JourneyCookie from "@/components/journey/JourneyCookie";
import JourneyTeaScene from "@/components/journey/JourneyTeaScene";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/useMedia";

export default function CookieJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  /*
   * ONE variant is mounted, not both.
   *
   * These three scenes used to render their phone and desktop cuts side by
   * side with `hidden md:block` / `block md:hidden` deciding which was seen.
   * `display: none` hides a subtree from the screen; it does not stop Motion
   * from driving it. Every `useTransform` in the hidden cut still recomputed
   * and still wrote a style attribute on every scroll frame, so a phone paid
   * for the desktop scene it would never show — and downloaded its artwork.
   *
   * Switching on the breakpoint instead means one tree, half the per-frame
   * work, and only the artwork this device will actually display. The swap
   * lands at hydration, thousands of pixels above this section, so nothing
   * visibly changes over.
   */
  const isMobile = useIsMobile();

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

  const progress = reduced ? scrollYProgress : damped;

  return (
    <section
      ref={ref}
      id="cookie-journey"
      aria-label="Pandur Interactive Cookie Journey"
      className="relative h-[380vh] md:h-[450vh]"
    >
      <div className="sticky top-0 isolate flex h-screen w-full flex-col justify-between overflow-hidden">
        {/* Dynamic Multi-Flavour Background Color & Ambient Watermarks */}
        <JourneyWorldLayer progress={progress} reduced={reduced} />

        {/* Organic Ground Guide Ramps */}
        <JourneyPlatform progress={progress} reduced={reduced} />

        {/* Reactive Single Transparent Ingredient per Flavour */}
        <JourneyIngredients progress={progress} isMobile={isMobile} reduced={reduced} />

        {/* Deterministic Impact Crumb Particle Bursts */}
        <JourneyCrumbs progress={progress} reduced={reduced} />

        {/* The Main Hero: Physical Pandur Cookie Character */}
        <JourneyCookie progress={progress} isMobile={isMobile} reduced={reduced} />

        {/* Final Tea & Empty Ceramic Plate Setting */}
        <JourneyTeaScene progress={progress} isMobile={isMobile} reduced={reduced} />
      </div>
    </section>
  );
}
