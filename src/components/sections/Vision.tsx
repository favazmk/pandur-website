"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { SplitLine } from "@/components/motion/Text";
import { usePrefersReducedMotion } from "@/lib/useMedia";
import WhatsAppCTA from "@/components/cta/WhatsAppCTA";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

/**
 * Vision section ("Next: the GCC.").
 *
 * Pinned on dark cocoa/ink background with a golden baked cookie
 * that zooms and rotates smoothly on scroll behind the brand's GCC expansion claim.
 */
export default function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Zoom / scale effect driven directly by scroll
  const cookieScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.65, 1.25, 2.4]);
  const cookieOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.8, 1],
    [0.1, 0.85, 0.95, 0.8, 0.15]
  );
  const cookieRotate = useTransform(scrollYProgress, [0, 1], [-16, 22]);

  const ringScale = useTransform(scrollYProgress, [0, 1], [0.55, 2.6]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.4, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[65svh] md:min-h-[75svh] items-center justify-center overflow-hidden bg-ink py-24 md:py-36 px-4 sm:px-6"
    >
      {/* Concentric expanding wave rings */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/40"
          style={{ scale: ringScale, opacity: ringOpacity }}
        />
      )}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34vmin] w-[34vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/20"
      />

      {/* Zooming golden baked cookie visual */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 w-[min(72vw,460px)] -translate-x-1/2 -translate-y-1/2 select-none"
        style={
          reduced
            ? { opacity: 0.75, scale: 1 }
            : {
                scale: cookieScale,
                opacity: cookieOpacity,
                rotate: cookieRotate,
              }
        }
      >
        <Image
          src="/products/gcc-cookie.webp"
          alt=""
          width={800}
          height={800}
          className="h-auto w-full drop-shadow-[0_20px_50px_rgba(215,150,60,0.32)] drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)]"
        />
      </motion.div>

      {/* Headline resting on top */}
      <div className="relative z-10 px-6 text-center max-w-2xl">
        <span className="text-[0.75rem] md:text-[0.85rem] font-bold uppercase tracking-[0.28em] text-dough block mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          Our Vision
        </span>
        <SplitLine
          as="h2"
          text="Next: Across the GCC."
          className="text-display font-display font-black text-cream drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
        />
        <p className="mt-4 text-xs sm:text-sm md:text-base font-medium text-dough/85 max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          To build Pandur into a leading UAE-origin bakery brand across the GCC and international markets.
        </p>
        <div className="mt-8 flex justify-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <WhatsAppCTA 
            label="ENQUIRE ON WHATSAPP" 
            message={WHATSAPP_MESSAGES.homeGeneral} 
            variant="secondary"
            context="home_vision" 
          />
        </div>
      </div>
    </section>
  );
}
