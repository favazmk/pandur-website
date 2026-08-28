"use client";

import { motion, MotionValue, useTransform, useMotionValue, useMotionValueEvent } from "motion/react";
import { ReactNode, useRef } from "react";
import { polar } from "@/lib/motion";

type SceneProps = {
  progress: MotionValue<number>;
};

// ==========================================
// SCENE 1: HERO [0.00 - 0.15]
// ==========================================
export function HeroScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0, 0.08, 0.12], [1, 1, 0]);
  const y = useTransform(progress, [0, 0.12], ["0%", "-20%"]);
  const display = useTransform(progress, (p) => p > 0.15 ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-10 overflow-hidden"
      style={{ opacity, y, display }}
    >
      <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-ink tracking-tight">
        LET&apos;S GROW
        <br />
        TOGETHER.
      </h1>
      <p className="mt-6 max-w-2xl text-lg md:text-xl text-ash font-medium">
        Four ways to build with Pandur.
      </p>
    </motion.div>
  );
}

// ==========================================
// SCENE 2: FOUR CARDS [0.15 - 0.30]
// ==========================================
type FourCardsProps = SceneProps & { cards: ReactNode };
export function FourCardsScene({ progress, cards }: FourCardsProps) {
  const opacity = useTransform(progress, [0.10, 0.15], [0, 1]);
  // Move up continuously so it scrolls naturally off the top of the screen
  const y = useTransform(progress, [0.10, 0.35], ["40%", "-100%"]);
  const display = useTransform(progress, (p) => (p < 0.09 || p > 0.36) ? "none" : "flex");

  return (
    <motion.div
      className="absolute top-0 w-full min-h-screen flex flex-col items-center justify-center pointer-events-auto z-20"
      style={{ opacity, y, display }}
    >
      <div className="w-full max-w-7xl px-4 md:px-8 pt-20 md:pt-[15vh] pb-32">
        {/* Render the untouched cards passed from the page.tsx */}
        {cards}
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 3: WHY PARTNER [0.30 - 0.48]
// ==========================================
const PRINCIPLES = [
  "45 YEARS OF EXPERIENCE",
  "QUALITY & CONSISTENCY",
  "SIX-MONTH SHELF LIFE",
  "DISTINCTIVE TASTE",
  "GROWING UAE PRESENCE",
  "GCC GROWTH POTENTIAL"
];

export function WhyPartnerScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0.34, 0.36, 0.46, 0.48], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.34, 0.36], [0.9, 1]);
  const display = useTransform(progress, (p) => (p < 0.33 || p > 0.49) ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none overflow-hidden"
      style={{ opacity, scale, display }}
    >
      <h2 className="absolute top-[10vh] md:top-[15vh] text-3xl md:text-5xl font-display font-black text-ink px-4 text-center">
        WHY PARTNER WITH PANDUR?
      </h2>

      <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
        {/* Central Monogram */}
        <div className="absolute w-20 h-20 bg-cream rounded-full border border-ink/10 shadow-sm flex items-center justify-center z-20">
          <span className="font-display font-black text-ink text-xs tracking-widest">PANDUR</span>
        </div>

        {/* Network Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="-250 -250 500 500">
          {PRINCIPLES.map((_, i) => {
            const angle = (i * (360 / PRINCIPLES.length)) - 90;
            const { cos, sin } = polar(angle);
            
            const start = 0.38 + (i * (0.05 / PRINCIPLES.length));
            const end = start + (0.05 / PRINCIPLES.length);
            
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const pathLength = useTransform(progress, [start, end], [0, 1]);
            
            return (
              <motion.line
                key={`line-${i}`}
                x1={`calc(${cos} * min(38vw, 250px))`} 
                y1={`calc(${sin} * min(38vw, 250px))`} 
                x2="0" y2="0"
                stroke="var(--color-ink)"
                strokeOpacity="0.2"
                strokeWidth="1"
                style={{ pathLength }}
              />
            );
          })}
        </svg>

        {PRINCIPLES.map((title, i) => {
          const angle = (i * (360 / PRINCIPLES.length)) - 90;
          const { cos, sin } = polar(angle);
          
          const start = 0.38 + (i * (0.05 / PRINCIPLES.length));
          const end = start + (0.05 / PRINCIPLES.length);
          
          // Nodes remain active once reached
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const itemOpacity = useTransform(progress, [start, end], [0.1, 1]);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const itemScale = useTransform(progress, [start, end, end + 0.02], [0.9, 1.1, 1]);

          return (
            <motion.div
              key={title}
              className="absolute text-center bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-xl shadow-sm border border-ink/5"
              style={{
                x: `calc(${cos} * min(38vw, 250px))`,
                y: `calc(${sin} * min(38vw, 250px))`,
                opacity: itemOpacity,
                scale: itemScale,
                // Adjust translation to center the text blocks properly
                transform: "translate(-50%, -50%)"
              }}
            >
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-deep mx-auto mb-1 md:mb-2" />
              <p className="font-display font-bold text-ink max-w-[80px] md:max-w-[120px] leading-tight text-[10px] md:text-sm">
                {title}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 4: BUSINESS FLOW [0.48 - 0.63]
// ==========================================
const NODES = [
  { id: "pandur", label: "PANDUR", desc: "Production & Supply", align: "right" },
  { id: "partner", label: "PARTNER", desc: "Distribution & Logistics", align: "left" },
  { id: "business", label: "YOUR BUSINESS", desc: "Retail or HORECA", align: "right" },
  { id: "customer", label: "CUSTOMER", desc: "The end consumer", align: "left" },
  { id: "growth", label: "GROWTH", desc: "Shared success", align: "right" },
];

export function BusinessFlowScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0.47, 0.49, 0.58, 0.60], [0, 1, 1, 0]);
  const pathLength = useTransform(progress, [0.49, 0.56], [0, 1]);
  const display = useTransform(progress, (p) => (p < 0.46 || p > 0.61) ? "none" : "flex");

  const pathRef = useRef<SVGPathElement>(null);
  const dotX = useMotionValue("50%");
  const dotY = useMotionValue("0%");

  useMotionValueEvent(pathLength, "change", (latest) => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      const point = pathRef.current.getPointAtLength(latest * length);
      dotX.set(`${point.x}%`);
      dotY.set(`${point.y}%`);
    }
  });

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none overflow-hidden"
      style={{ opacity, display }}
    >
      <h2 className="absolute top-[8vh] md:top-[12vh] text-3xl md:text-5xl font-display font-black text-ink text-center px-4">
        HOW THE PARTNERSHIP FITS
      </h2>

      <div className="relative w-full max-w-2xl h-[70vh] mx-auto mt-20 md:mt-10">
        {/* SVG Route */}
        <div className="absolute inset-0 z-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M 50 0 C 50 10, 10 15, 10 25 C 10 35, 90 40, 90 50 C 90 60, 10 65, 10 75 C 10 85, 50 90, 50 100"
              fill="none" 
              stroke="rgba(169,83,36,0.2)" 
              strokeWidth="0.5"
            />
            <motion.path 
              ref={pathRef}
              d="M 50 0 C 50 10, 10 15, 10 25 C 10 35, 90 40, 90 50 C 90 60, 10 65, 10 75 C 10 85, 50 90, 50 100"
              fill="none" 
              stroke="#A95324" 
              strokeWidth="1"
              style={{ pathLength }}
            />
          </svg>
          
          {/* The moving marker */}
          <motion.div 
            className="absolute w-4 h-4 bg-red-deep rounded-full shadow-[0_0_15px_rgba(169,83,36,0.8)] z-20"
            style={{ 
              left: dotX, 
              top: dotY,
              transform: "translate(-50%, -50%)"
            }}
          />
        </div>

        {/* Node Labels */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between py-0">
          {NODES.map((node, i) => {
            const start = 0.50 + (i * 0.012);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const nodeOpacity = useTransform(progress, [start, start + 0.02], [0, 1]);
            
            return (
              <motion.div 
                key={node.id}
                className={`flex w-full items-center ${node.align === 'left' ? 'justify-start' : 'justify-end'}`}
                style={{ opacity: nodeOpacity }}
              >
                <div className={`bg-white/90 backdrop-blur-sm border border-ink/10 p-3 md:p-4 rounded-xl shadow-sm max-w-[42vw] md:w-56 ${node.align === 'left' ? 'ml-3 md:ml-16' : 'mr-3 md:mr-16'}`}>
                  <h3 className="font-display font-black text-ink text-sm md:text-xl leading-none">{node.label}</h3>
                  <p className="text-ash text-[10px] md:text-xs uppercase tracking-wider mt-1 md:mt-2 leading-tight">{node.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 5: ECOSYSTEM [0.63 - 0.75]
// ==========================================
export function EcosystemScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0.59, 0.61, 0.70, 0.72], [0, 1, 1, 0]);
  
  // Progress sub-ranges for drawing paths
  const p1 = useTransform(progress, [0.62, 0.64], [0, 1]);
  const p2 = useTransform(progress, [0.64, 0.66], [0, 1]);
  const p3 = useTransform(progress, [0.66, 0.68], [0, 1]);
  const p4 = useTransform(progress, [0.68, 0.70], [0, 1]);
  const display = useTransform(progress, (p) => (p < 0.58 || p > 0.73) ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden"
      style={{ opacity, display }}
    >
      <div className="relative w-full max-w-4xl aspect-square md:aspect-[16/9] flex items-center justify-center">
        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full border border-ink/10 shadow-lg flex items-center justify-center">
            <h3 className="font-display font-black text-sm md:text-lg text-ink">PANDUR</h3>
          </div>
        </div>

        {/* Four curved paths radiating out */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path d="M 50 50 Q 15 50 15 25" fill="none" stroke="#A95324" strokeWidth="0.5" strokeLinecap="round" style={{ pathLength: p1 }} />
          <motion.path d="M 50 50 Q 85 50 85 25" fill="none" stroke="#A95324" strokeWidth="0.5" strokeLinecap="round" style={{ pathLength: p2 }} />
          <motion.path d="M 50 50 Q 15 50 15 85" fill="none" stroke="#A95324" strokeWidth="0.5" strokeLinecap="round" style={{ pathLength: p3 }} />
          <motion.path d="M 50 50 Q 85 50 85 85" fill="none" stroke="#A95324" strokeWidth="0.5" strokeLinecap="round" style={{ pathLength: p4 }} />
        </svg>

        {/* Corner labels */}
        <motion.div className="absolute top-[12%] md:top-[20%] left-[2%] md:left-[10%] bg-white px-3 py-2 md:px-6 md:py-3 rounded-full border border-ink/10 shadow-sm z-10" style={{ opacity: p1 }}>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-deep animate-pulse" />
            <span className="font-bold text-[10px] md:text-sm tracking-wide">DISTRIBUTION</span>
          </div>
        </motion.div>
        <motion.div className="absolute top-[12%] md:top-[20%] right-[2%] md:right-[10%] bg-white px-3 py-2 md:px-6 md:py-3 rounded-full border border-ink/10 shadow-sm z-10" style={{ opacity: p2 }}>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-deep animate-pulse" style={{ animationDelay: "0.2s" }} />
            <span className="font-bold text-[10px] md:text-sm tracking-wide">RETAIL</span>
          </div>
        </motion.div>
        <motion.div className="absolute bottom-[8%] md:bottom-[10%] left-[2%] md:left-[10%] bg-white px-3 py-2 md:px-6 md:py-3 rounded-full border border-ink/10 shadow-sm z-10" style={{ opacity: p3 }}>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-deep animate-pulse" style={{ animationDelay: "0.4s" }} />
            <span className="font-bold text-[10px] md:text-sm tracking-wide">FOOD SERVICE</span>
          </div>
        </motion.div>
        <motion.div className="absolute bottom-[8%] md:bottom-[10%] right-[2%] md:right-[10%] bg-white px-3 py-2 md:px-6 md:py-3 rounded-full border border-ink/10 shadow-sm z-10" style={{ opacity: p4 }}>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-deep animate-pulse" style={{ animationDelay: "0.6s" }} />
            <span className="font-bold text-[10px] md:text-sm tracking-wide">TERRITORY</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 6: GROWTH [0.75 - 0.88]
// ==========================================
export function GrowthScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0.71, 0.73, 0.83, 0.85], [0, 1, 1, 0]);
  
  // Rings expanding outwards to signify growth
  const uaeScale = useTransform(progress, [0.74, 0.76], [0, 1]);
  const gccScale = useTransform(progress, [0.76, 0.78], [0, 1]);
  const beyondScale = useTransform(progress, [0.78, 0.80], [0, 1]);
  const display = useTransform(progress, (p) => (p < 0.70 || p > 0.86) ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none overflow-hidden"
      style={{ opacity, display }}
    >
      <h2 className="absolute top-[10vh] md:top-[15vh] text-3xl md:text-5xl font-display font-black text-ink text-center max-w-2xl px-4">
        START IN THE UAE. GROW ACROSS THE GCC.
      </h2>

      <div className="relative w-[50vmin] h-[50vmin] flex items-center justify-center mt-20 md:mt-20">
        <motion.div className="absolute w-12 h-12 rounded-full bg-red-deep flex items-center justify-center z-30" style={{ scale: uaeScale }}>
          <span className="absolute -top-8 text-xs font-bold text-ink">UAE</span>
        </motion.div>
        <motion.div className="absolute w-40 h-40 rounded-full border-[1.5px] border-ash/30 flex items-center justify-center z-20" style={{ scale: gccScale }}>
          <span className="absolute -top-8 text-xs font-bold text-ash">GCC</span>
        </motion.div>
        <motion.div className="absolute w-80 h-80 rounded-full border-[1.5px] border-ash/10 flex items-center justify-center z-10" style={{ scale: beyondScale }}>
          <span className="absolute -top-8 text-xs font-bold text-ash/60">BEYOND</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 7: JOURNEY [0.88 - 0.95]
// ==========================================
export function JourneyScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0.84, 0.86, 0.92, 0.94, 0.98, 1.0], [0, 1, 1, 0.2, 0.2, 0]);
  
  const step = useTransform(progress, [0.86, 0.90], [0, 4]);
  const s1 = useTransform(step, [0, 1], [0, 1]);
  const s2 = useTransform(step, [1, 2], [0, 1]);
  const s3 = useTransform(step, [2, 3], [0, 1]);
  const s4 = useTransform(step, [3, 4], [0, 1]);
  const display = useTransform(progress, (p) => (p < 0.83) ? "none" : "flex");

  // Transformation into the background before CTA
  const sceneScale = useTransform(progress, [0.92, 0.94], [1, 0.6]);
  const sceneY = useTransform(progress, [0.92, 0.94], ["0%", "-10%"]);
  const blurValue = useTransform(progress, [0.92, 0.94], [0, 4]);
  const filter = useTransform(blurValue, (b) => `blur(${b}px)`);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none overflow-hidden"
      style={{ opacity, display, scale: sceneScale, y: sceneY, filter }}
    >
      <div className="flex w-full max-w-4xl justify-between px-2 md:px-10">
        <div className="text-center w-1/4 flex flex-col items-center">
          <motion.div style={{ opacity: s1 }} className="flex flex-col items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 md:mb-4 text-red-deep w-6 h-6 md:w-10 md:h-10">
              {/* Discover: signal/lens */}
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <h3 className="font-display font-black text-[10px] md:text-sm lg:text-xl text-ink">DISCOVER</h3>
          </motion.div>
        </div>
        <div className="text-center w-1/4 flex flex-col items-center">
          <motion.div style={{ opacity: s2 }} className="flex flex-col items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 md:mb-4 text-red-deep w-6 h-6 md:w-10 md:h-10">
              {/* Connect: linked nodes */}
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <h3 className="font-display font-black text-[10px] md:text-sm lg:text-xl text-ink">CONNECT</h3>
          </motion.div>
        </div>
        <div className="text-center w-1/4 flex flex-col items-center">
          <motion.div style={{ opacity: s3 }} className="flex flex-col items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 md:mb-4 text-red-deep w-6 h-6 md:w-10 md:h-10">
              {/* Stock: shelf */}
              <line x1="4" y1="20" x2="20" y2="20" />
              <line x1="4" y1="10" x2="20" y2="10" />
              <rect x="6" y="14" width="4" height="6" />
              <rect x="14" y="4" width="4" height="6" />
            </svg>
            <h3 className="font-display font-black text-[10px] md:text-sm lg:text-xl text-ink">STOCK</h3>
          </motion.div>
        </div>
        <div className="text-center w-1/4 flex flex-col items-center">
          <motion.div style={{ opacity: s4 }} className="flex flex-col items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 md:mb-4 text-red-deep w-6 h-6 md:w-10 md:h-10">
              {/* Grow: expanding network */}
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v7M22 12h-7M12 22v-7M2 12h7" />
              <path d="M19.07 4.93l-4.95 4.95M19.07 19.07l-4.95-4.95M4.93 19.07l4.95-4.95M4.93 4.93l4.95 4.95" />
            </svg>
            <h3 className="font-display font-black text-[10px] md:text-sm lg:text-xl text-ink">GROW</h3>
          </motion.div>
        </div>
      </div>
      
      {/* Progress line */}
      <div className="w-[90%] md:w-full max-w-3xl h-1 bg-ink/10 mt-6 md:mt-10 rounded-full overflow-hidden mx-auto">
        <motion.div className="h-full bg-red-deep origin-left" style={{ scaleX: useTransform(step, [0, 4], [0, 1]) }} />
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 8: CTA [0.95 - 1.00]
// ==========================================
export function CTAScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0.94, 0.96], [0, 1]);
  const display = useTransform(progress, (p) => p < 0.93 ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-auto z-40 overflow-hidden"
      style={{ opacity, display }}
    >

      <h2 className="text-3xl md:text-6xl lg:text-7xl font-display font-black text-ink mb-4 md:mb-6 max-w-4xl mx-auto drop-shadow-sm mt-10 md:mt-32">
        YOUR NEXT GROWTH MOVE STARTS HERE.
      </h2>
      <p className="text-xl text-ash font-medium max-w-2xl mx-auto mb-10">
        Let&apos;s build a long-term partnership around Pandur.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-20">
        <button 
          onClick={() => document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" })}
          className="w-full sm:w-auto px-8 py-4 bg-red-deep text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-ink transition-colors"
        >
          PARTNER WITH PANDUR
        </button>
        <button 
          onClick={() => document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" })}
          className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-ink text-ink rounded-full font-bold uppercase tracking-widest text-sm hover:bg-ink/5 transition-colors"
        >
          CONTACT US
        </button>
      </div>
    </motion.div>
  );
}
