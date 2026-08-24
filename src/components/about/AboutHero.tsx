"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import Image from "next/image";

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
        {/* Desktop Image */}
        <Image
          src="/brand/about hero desktop.png" 
          alt="About Pandur"
          fill
          priority
          className="object-cover hidden md:block"
        />
        {/* Mobile Image */}
        <Image
          src="/brand/about hero mobilr.png" 
          alt="About Pandur"
          fill
          priority
          className="object-cover block md:hidden"
        />
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
