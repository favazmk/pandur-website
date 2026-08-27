"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SplitLine, Reveal } from "@/components/motion/Text";
import EnquiryForm from "@/components/forms/EnquiryForm";

const INTERESTS = [
  "Distribution",
  "Retail Stockist",
  "Food Service",
  "Territory Partner"
];

export default function FranchiseCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Background items (depth)
  const bgScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.3, 0]);

  // Main CTA text fades in and moves up
  const ctaOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.3, 0.8], [50, 0]);

  const handleScrollToForm = () => {
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-cream">
      {/* Animated Scroll Scene */}
      <section 
        ref={containerRef} 
        className="relative h-[150vh] overflow-hidden"
      >
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center">
          
          {/* Background Flavour Silhouettes */}
          <motion.div 
            className="absolute inset-0 z-0 flex items-center justify-center gap-10 md:gap-32 pointer-events-none"
            style={{ scale: bgScale, opacity: bgOpacity }}
          >
            <div className="w-32 h-32 md:w-64 md:h-64 mt-[-20vh] rotate-12 blur-sm">
              <img src="/products/hero-coconut-box-scene.png" alt="Silhouette" className="w-full h-full object-contain mix-blend-multiply opacity-50" />
            </div>
            <div className="w-48 h-48 md:w-80 md:h-80 mt-[20vh] -rotate-12 blur-sm">
              <img src="/products/hero-peanut-box-scene.png" alt="Silhouette" className="w-full h-full object-contain mix-blend-multiply opacity-50" />
            </div>
          </motion.div>

          {/* Foreground CTA Text */}
          <motion.div 
            className="relative z-10 text-center px-6"
            style={{ opacity: ctaOpacity, y: ctaY }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-ink mb-6 max-w-4xl mx-auto drop-shadow-sm">
              YOUR NEXT GROWTH MOVE STARTS HERE.
            </h2>
            <p className="text-ash text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
              Let's build a long-term partnership around Pandur.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleScrollToForm}
                className="w-full sm:w-auto px-8 py-4 bg-red-deep text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-ink transition-colors"
              >
                PARTNER WITH PANDUR
              </button>
              <button 
                onClick={handleScrollToForm}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-ink text-ink rounded-full font-bold uppercase tracking-widest text-sm hover:bg-ink/5 transition-colors"
              >
                CONTACT US
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Static Enquiry Form (exactly as before) */}
      <section id="enquire" className="relative bg-cream-deep px-6 py-24 md:py-32 z-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <SplitLine
              as="h2"
              text="Let's grow together."
              className="text-display font-display font-black text-ink"
            />
          </div>

          <div className="mt-14">
            <EnquiryForm
              topic="franchise"
              interestOptions={INTERESTS}
              submitLabel="Submit Enquiry"
            />
          </div>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ash">
              Commercial terms — investment, territory rights, minimum volumes and
              margins — are agreed case by case and are not published here.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
