"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import Image from "next/image";

export default function CompanyStory() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-20%"]);

  return (
    <section 
      ref={container}
      className="relative min-h-screen bg-cream py-24 md:py-40 overflow-hidden flex items-center"
    >
      {/* Decorative environment elements */}
      <motion.div style={{ y: y1 }} className="absolute -left-20 md:left-0 top-10 w-96 h-96 rounded-full bg-ink/5 blur-3xl" />
      <motion.div style={{ y: y2 }} className="absolute -right-20 md:right-20 bottom-10 w-[30rem] h-[30rem] rounded-full bg-red-deep/5 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          
          <div>
            <p className="text-red-deep font-bold tracking-widest uppercase text-sm mb-6">Operations</p>
            <h2 className="text-4xl md:text-6xl font-display font-black text-ink uppercase tracking-tight leading-[1.1]">
              The Company
              <br />Behind the
              <br />Product.
            </h2>
            <div className="mt-8 text-lg text-ash max-w-md leading-relaxed space-y-4">
              <p>
                Pandur brings together traditional bakery expertise with modern food manufacturing and advanced packaging capabilities.
              </p>
              <p>
                We understand consumer preferences, and we&apos;ve structured our operations around production efficiency and strict market requirements.
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-6 pt-12 border-t border-ink/10">
              <div>
                <span className="block text-3xl font-display font-black text-ink">Modern</span>
                <span className="block text-xs uppercase tracking-widest text-ash mt-1">Manufacturing</span>
              </div>
              <div>
                <span className="block text-3xl font-display font-black text-ink">Traditional</span>
                <span className="block text-xs uppercase tracking-widest text-ash mt-1">Bakery Expertise</span>
              </div>
            </div>
          </div>

          <div className="relative h-[60vh] md:h-[80vh] w-full flex flex-col justify-end">
            
            {/* Massive Image Background */}
            <motion.div 
              style={{ y: y1 }}
              className="absolute inset-0 w-full h-full rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="/products/retail-shelf.jpg" 
                alt="Bakery Products on Retail Shelf"
                fill
                className="object-cover"
              />
              {/* Subtle dark gradient to ensure text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
            </motion.div>
            
            {/* Embedded Text Content */}
            <motion.div 
              style={{ y: y2 }}
              className="relative z-10 p-8 md:p-12"
            >
              <h3 className="text-7xl md:text-9xl font-display font-black text-cream/80 drop-shadow-2xl uppercase tracking-tighter leading-none mb-[-2rem] ml-[-1rem]">
                Market
              </h3>
              <div className="h-px bg-red-deep w-full max-w-xs mt-12 mb-6" />
              <p className="text-sm font-bold uppercase tracking-widest text-cream">Retail Presence</p>
              <p className="text-xs text-cream/70 mt-1">Available across leading stores</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
