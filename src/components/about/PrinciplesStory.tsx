"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const PRINCIPLES = [
  { id: "exp", title: "Experience", desc: "45 years of continuous improvement and bakery heritage." },
  { id: "con", title: "Consistency", desc: "Every batch matches our strict quality standards." },
  { id: "tas", title: "Taste", desc: "A distinctive flavor profile that consumers love." },
  { id: "she", title: "Shelf Life", desc: "Six months of guaranteed freshness." },
  { id: "dis", title: "Distribution", desc: "Optimized packaging for efficient logistics." },
  { id: "gro", title: "Growth", desc: "A brand built to scale across the GCC." }
];

export default function PrinciplesStory() {
  const [activeId, setActiveId] = useState(PRINCIPLES[0].id);

  return (
    <section className="relative bg-cream py-24 md:py-40 border-t border-ink/5">
      <div className="mx-auto max-w-6xl px-6">
        
        <div className="mb-16">
          <p className="text-red-deep font-bold tracking-widest uppercase text-sm mb-6">What We Stand For</p>
        </div>

        {/* Editorial Layout: List of principles */}
        <div className="flex flex-col gap-0 border-t border-ink/10">
          {PRINCIPLES.map((principle) => {
            const isActive = activeId === principle.id;

            return (
              <div 
                key={principle.id}
                className="group border-b border-ink/10 py-6 md:py-10 cursor-pointer transition-colors hover:bg-ink/5"
                onMouseEnter={() => setActiveId(principle.id)}
                onClick={() => setActiveId(principle.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between px-4">
                  <h3 className={`font-display font-black uppercase tracking-tight transition-all duration-500 ${isActive ? 'text-3xl md:text-6xl text-ink' : 'text-2xl md:text-3xl text-ink/30'}`}>
                    {principle.title}
                  </h3>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="md:w-1/3 mt-4 md:mt-0"
                      >
                        <p className="text-ash text-lg leading-relaxed border-l-2 border-red-deep pl-6">
                          {principle.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
