"use client";

import { useRef } from "react";
import { useScroll, useSpring } from "motion/react";
import JourneyWorldLayer from "@/components/journey/JourneyWorldLayer";
import JourneyIngredients from "@/components/journey/JourneyIngredients";
import JourneyPlatform from "@/components/journey/JourneyPlatform";
import JourneyCrumbs from "@/components/journey/JourneyCrumbs";
import JourneyCookie from "@/components/journey/JourneyCookie";
import JourneyTeaScene from "@/components/journey/JourneyTeaScene";
import { usePrefersReducedMotion } from "@/lib/useMedia";

export default function CookieJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

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
        <div className="hidden md:block">
          <JourneyIngredients progress={progress} isMobile={false} reduced={reduced} />
        </div>
        <div className="block md:hidden">
          <JourneyIngredients progress={progress} isMobile={true} reduced={reduced} />
        </div>

        {/* Deterministic Impact Crumb Particle Bursts */}
        <JourneyCrumbs progress={progress} reduced={reduced} />

        {/* The Main Hero: Physical Pandur Cookie Character */}
        <div className="hidden md:block">
          <JourneyCookie progress={progress} isMobile={false} reduced={reduced} />
        </div>
        <div className="block md:hidden">
          <JourneyCookie progress={progress} isMobile={true} reduced={reduced} />
        </div>

        {/* Final Tea & Empty Ceramic Plate Setting */}
        <div className="hidden md:block">
          <JourneyTeaScene progress={progress} isMobile={false} reduced={reduced} />
        </div>
        <div className="block md:hidden">
          <JourneyTeaScene progress={progress} isMobile={true} reduced={reduced} />
        </div>
      </div>
    </section>
  );
}
