"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import Image from "next/image";

export default function RetailStory() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  
  // Parallax elements
  const boxY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section 
      ref={container}
      className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-ink"
    >
      {/* Background Image: Retail Shelf */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-[140%] -top-[20%]"
      >
        <Image
          src="/products/retail-shelf.jpg"
          alt="Retail Environment"
          fill
          className="object-cover opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent opacity-90" />
      </motion.div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div>
          <p className="text-red-deep font-bold tracking-widest uppercase text-sm mb-6 drop-shadow-md">Retail Ready</p>
          <h2 className="text-4xl md:text-6xl font-display font-black text-ink uppercase tracking-tight leading-[1.1]">
            Made for
            <br />Modern Retail.
          </h2>
          <div className="mt-8 space-y-4 max-w-sm">
             <p className="text-lg font-bold text-ink/80 uppercase tracking-widest border-b border-ink/10 pb-4">
              1. Individual Sachet
            </p>
            <p className="text-lg font-bold text-ink/80 uppercase tracking-widest border-b border-ink/10 pb-4">
              2. Retail Carton
            </p>
            <p className="text-lg font-bold text-ink/80 uppercase tracking-widest border-b border-ink/10 pb-4">
              3. Supermarket Shelf
            </p>
          </div>
        </div>

        {/* 3D Depth Composition */}
        <div className="relative h-[400px] flex items-center justify-center">
          <motion.div 
            style={{ y: boxY }}
            className="relative w-64 h-64 md:w-96 md:h-96 z-20"
          >
            <Image
              src="/products/hero-butter-box.png"
              alt="Retail Carton"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 z-10 opacity-80 blur-[2px] translate-x-12 translate-y-12">
             <Image
              src="/products/hero-butter-sachet.png"
              alt="Sachet"
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
