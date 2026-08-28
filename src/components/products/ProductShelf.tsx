"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { SCENES } from "@/lib/showcase";

const PRODUCTS_ORDER = ["butter", "cardamom", "coconut", "peanut"] as const;

const PACK_IMAGES: Record<string, string> = {
  butter: "/products/hero-butter-box-scene2.webp",
  cardamom: "/products/hero-cardamom-box.webp",
  coconut: "/products/hero-coconut-box-scene.webp",
  peanut: "/products/hero-peanut-box-scene.webp",
};

const SHELF_PRODUCTS = PRODUCTS_ORDER.map(slug => {
  const base = SCENES.find(s => s.id === slug)!;
  return {
    ...base,
    packImage: PACK_IMAGES[slug],
    bg: slug === "butter" ? "#dfe8b2" 
      : slug === "cardamom" ? "#31581e" 
      : slug === "coconut" ? "#dcc29a" 
      : "#a95324"
  };
});

export default function ProductShelf() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 md:py-40 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-5xl md:text-7xl font-display font-black text-ink uppercase tracking-tight">
          The Full Range
        </h2>
        <p className="mt-6 text-xl text-ash max-w-2xl mx-auto">
          Four distinct characters, each developed to deliver a memorable bite.
        </p>
      </div>

      <div className="relative w-full max-w-[1440px] mx-auto">
        {/* Mobile: horizontal scroll snap. Desktop: CSS grid */}
        <div className="flex md:grid md:grid-cols-4 gap-6 px-6 overflow-x-auto snap-x snap-mandatory pb-12 md:pb-0 scrollbar-hide">
          {SHELF_PRODUCTS.map((product, i) => (
            <div 
              key={product.id} 
              className="relative flex-none w-[80vw] md:w-auto snap-center group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div 
                className="absolute inset-0 rounded-[2rem] transition-colors duration-500 md:opacity-0 md:group-hover:opacity-100"
                style={{ backgroundColor: product.bg }}
              />
              
              <div className="relative z-10 pt-12 px-6 pb-24 md:pb-32 flex flex-col items-center">
                <motion.div
                  animate={{ 
                    y: hoveredIndex === i ? -20 : 0,
                    scale: hoveredIndex === i ? 1.05 : 1
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative w-full aspect-square md:aspect-[3/4]"
                >
                  <Image 
                    src={product.packImage} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 80vw, 25vw"
                    className={`object-contain drop-shadow-xl transition-all duration-500 group-hover:drop-shadow-2xl ${product.id === 'butter' ? 'scale-[0.85]' : ''}`}
                  />
                </motion.div>
                
                <div className="absolute bottom-8 left-0 right-0 text-center px-6 transition-all duration-500 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  <h3 className="text-3xl font-display font-black" style={{ color: hoveredIndex === i ? product.ink : 'inherit' }}>
                    {product.name}
                  </h3>
                  <div className="mt-4 flex justify-center gap-4 text-[10px] font-bold tracking-widest uppercase opacity-60">
                    <span>16 Pcs</span>
                    <span>&middot;</span>
                    <span>6 Months</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
