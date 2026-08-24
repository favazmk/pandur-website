"use client";

import { motion, type Variants } from "motion/react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function VisionMission() {
  return (
    <section className="relative bg-ink py-24 md:py-36 overflow-hidden">
      
      {/* Decorative Rotating Badge - Positioned in the corner but with high z-index to be on top */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-12 right-12 md:top-24 md:right-24 w-32 h-32 border border-cream/20 rounded-full flex items-center justify-center pointer-events-none opacity-80 hidden md:flex bg-ink z-50"
      >
        <span className="text-xs tracking-[0.3em] text-cream uppercase text-center w-24">
          Pandur Core Values
        </span>
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="border border-cream/15 relative bg-ink/50 backdrop-blur-sm"
        >
          {/* Top Bar */}
          <div className="border-b border-cream/15 p-6 flex justify-between items-center">
            <motion.span variants={itemVariants} className="text-cream/50 text-xs tracking-[0.2em] uppercase font-bold">
              Company Framework
            </motion.span>
            <motion.span variants={itemVariants} className="w-2 h-2 rounded-full bg-red-deep" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* MISSION */}
            <div className="border-b md:border-b-0 md:border-r border-cream/15 p-8 md:p-16 lg:p-24 relative group overflow-hidden">
              
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-red-deep/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {/* Large Watermark */}
              <div className="absolute -right-4 -bottom-4 text-[10rem] font-display font-black text-cream/5 pointer-events-none select-none tracking-tighter leading-none group-hover:scale-105 transition-transform duration-1000">
                01
              </div>

              <motion.div variants={itemVariants} className="relative z-10 mb-8 md:mb-16">
                <span className="inline-block py-1 px-3 border border-red-deep text-red-deep text-xs font-bold uppercase tracking-widest rounded-full">
                  Our Mission
                </span>
              </motion.div>
              
              <motion.p variants={itemVariants} className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-display font-black text-cream uppercase tracking-tight leading-[1.2]">
                Create bakery products that consumers love while continuously improving our quality, production capabilities, and innovation.
              </motion.p>
            </div>

            {/* VISION */}
            <div className="p-8 md:p-16 lg:p-24 relative group overflow-hidden">
              
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-cream/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Large Watermark */}
              <div className="absolute -right-4 -bottom-4 text-[10rem] font-display font-black text-cream/5 pointer-events-none select-none tracking-tighter leading-none group-hover:scale-105 transition-transform duration-1000">
                02
              </div>

              <motion.div variants={itemVariants} className="relative z-10 mb-8 md:mb-16">
                <span className="inline-block py-1 px-3 border border-cream/40 text-cream/80 text-xs font-bold uppercase tracking-widest rounded-full">
                  Our Vision
                </span>
              </motion.div>
              
              <motion.p variants={itemVariants} className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-display font-black text-cream uppercase tracking-tight leading-[1.2]">
                Build Pandur into a leading UAE-origin bakery brand, recognized for exceptional taste, consistent quality, and reliability.
              </motion.p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
