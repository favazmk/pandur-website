"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";

export default function AboutHero() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  // Slow subtle parallax for the background elements
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={container}
      className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-cream"
    >
      {/* Abstract editorial background - very subtle Khorfakkan atmosphere */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {/*
         * `<picture>` rather than two `next/image`s hidden by CSS.
         *
         * This is the LCP element of the page, and both cuts carried
         * `priority` — so every visitor preloaded the landscape crop AND the
         * portrait one and discarded whichever the breakpoint hid. A phone
         * paid 830KB to display 227KB of it, at the exact moment it was
         * trying to paint.
         *
         * `next/image` has no art-direction switch, so real `<source media>`
         * is what expresses "one of these two, decided before the request".
         * The browser picks in the preload scanner, ahead of hydration, which
         * a `useIsMobile()` branch could not do — that would have to wait for
         * JS and would push the LCP out rather than pull it in. Both files are
         * already exported at the size they are shown at, so nothing is lost
         * by stepping outside the optimiser here.
         *
         * The filenames must not contain spaces. In `srcset` a space is the
         * separator before a descriptor, so "/brand/about hero mobilr.webp"
         * parses as the URL "/brand/about" followed by two descriptors — a
         * 404, and silently, because the browser just falls back to `src`.
         * That is why these two were renamed rather than URL-encoded.
         */}
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/brand/about-hero-mobile.webp"
          />
          <img
            src="/brand/about-hero-desktop.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-ink/60 z-10" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] font-display font-black text-cream uppercase tracking-tight drop-shadow-lg"
        >
          The Story<br />Behind Pandur.
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-8 text-lg md:text-xl font-bold text-cream/80 max-w-md uppercase tracking-widest drop-shadow-md"
        >
          Our Signature Taste. Made to Grow.
        </motion.p>
      </div>
    </section>
  );
}
