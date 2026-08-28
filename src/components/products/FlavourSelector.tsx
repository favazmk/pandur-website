"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SCENES } from "@/lib/showcase";
import { FLAVOUR_PROPS, cropStyle } from "@/lib/showcaseProps";

import WhatsAppCTA from "@/components/cta/WhatsAppCTA";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const PRODUCTS_ORDER = ["butter", "cardamom", "coconut", "peanut"] as const;

const PACK_IMAGES: Record<string, string> = {
  butter: "/products/pack-butter.jpg",
  cardamom: "/products/pack-cardamom.jpg",
  coconut: "/products/pack-coconut.jpg",
  peanut: "/products/pack-peanut.jpg",
};

const SELECTOR_SCENES = PRODUCTS_ORDER.map(slug => {
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

export default function FlavourSelector() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeScene = SELECTOR_SCENES[activeIndex];
  const activeProps = FLAVOUR_PROPS[activeScene.id] || [];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-1000 ease-in-out" style={{ backgroundColor: activeScene.bg }}>
      
      {/* Background Ingredient Art */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {activeProps.filter(p => p.plane === 'back').map((prop, i) => (
              <div 
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${prop.place.x}%`,
                  top: `${prop.place.y}%`,
                  width: `${prop.place.size * 1.5}%`,
                }}
              >
                <div style={{
                  ...cropStyle(prop.crop),
                  transform: `rotate(${prop.rotate}deg)`,
                  filter: `blur(${prop.blur || 4}px)`,
                }} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-center py-12 lg:py-0">
        
        {/* Left side: Typography List */}
        <div className="order-2 lg:order-1 flex flex-col gap-6 md:gap-8">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-ink/50 mb-4">Which one is yours?</h2>
          
          <div className="flex flex-col gap-3 md:gap-8">
            {SELECTOR_SCENES.map((scene, i) => {
              const isActive = activeIndex === i;
              return (
                <button
                  key={scene.id}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  className="text-left group"
                >
                  <div className="flex items-center gap-6">
                    <span className={`transition-all duration-500 font-display font-black text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter
                      ${isActive ? 'text-ink translate-x-4 md:translate-x-8' : 'text-ink/20 group-hover:text-ink/40'}
                    `}>
                      {scene.name}
                    </span>
                    {isActive && (
                      <motion.div layoutId="selector-dot" className="w-4 h-4 rounded-full bg-ink" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 md:mt-10 pl-4 md:pl-8 lg:pl-8">
            <WhatsAppCTA 
              label="ENQUIRE ABOUT THIS FLAVOUR"
              message={WHATSAPP_MESSAGES.productSpecific(activeScene.name)}
              variant="primary"
              context={`product_${activeScene.id}`}
            />
          </div>
        </div>

        {/* Right side: Product Reveal */}
        <div className="order-1 lg:order-2 relative w-full max-w-[260px] sm:max-w-md mx-auto aspect-square lg:aspect-auto lg:h-[80vh] flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, x: 100, rotateY: 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute w-full h-full lg:max-w-lg lg:aspect-square"
              style={{ perspective: 1000 }}
            >
              <Image 
                src={activeScene.packImage} 
                alt={activeScene.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-[2rem] drop-shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
