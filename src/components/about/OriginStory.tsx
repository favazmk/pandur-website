"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import Image from "next/image";

export default function OriginStory() {
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
      className="relative min-h-screen bg-cream-deep py-24 md:py-40 overflow-hidden flex items-center"
    >
      {/* Decorative environment elements representing Khorfakkan / Coast / Mountains */}
      <motion.div style={{ y: y1 }} className="absolute -left-20 md:left-0 top-10 w-96 h-96 rounded-full bg-ink/5 blur-3xl" />
      <motion.div style={{ y: y2 }} className="absolute -right-20 md:right-20 bottom-10 w-[30rem] h-[30rem] rounded-full bg-red-deep/5 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          
          <div>
            <p className="text-red-deep font-bold tracking-widest uppercase text-sm mb-6">Our Origin</p>
            <h2 className="text-4xl md:text-6xl font-display font-black text-ink uppercase tracking-tight leading-[1.1]">
              Khorfakkan,
              <br />UAE.
            </h2>
            <p className="mt-8 text-lg text-ash max-w-md leading-relaxed">
              Pandur is the signature cookie brand of Royal Quality Bakes LLC. Born on the Eastern coast of the UAE, our roots are deeply embedded in local culture, while our manufacturing standards are world-class.
            </p>
          </div>

          <div className="relative h-[60vh] md:h-[80vh] w-full flex flex-col justify-end">
            
            {/* Factory Image Background */}
            <motion.div 
              style={{ y: y1 }}
              className="absolute inset-0 w-full h-full rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="/brand/factory.webp"
                alt="Royal Quality Bakes LLC Factory"
                fill
                className="object-cover"
              />
              {/* Subtle dark gradient to ensure text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            </motion.div>
            
            {/* Restored Text Content */}
            <motion.div 
              style={{ y: y2 }}
              className="relative z-10 p-8 md:p-12"
            >
              <h3 className="text-5xl md:text-9xl font-display font-black text-ink/20 drop-shadow-sm uppercase tracking-tighter leading-none mb-[-2rem] ml-[-1rem]">
                Origin
              </h3>
              <div className="h-px bg-red-deep w-full max-w-xs mt-12 mb-6" />
              <p className="text-sm font-bold uppercase tracking-widest text-cream">Royal Quality Bakes LLC</p>
              <p className="text-xs text-cream/70 mt-1">Established in the UAE</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
