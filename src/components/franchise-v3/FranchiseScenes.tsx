"use client";

import { motion, MotionValue, useTransform } from "motion/react";
import { ReactNode } from "react";

type SceneProps = {
  progress: MotionValue<number>;
};

// ==========================================
// SCENE 1: HERO [0.00 - 0.15]
// ==========================================
export function HeroScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0, 0.1, 0.15], [1, 1, 0]);
  const y = useTransform(progress, [0, 0.15], ["0%", "-20%"]);
  const display = useTransform(progress, (p) => p > 0.18 ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-10"
      style={{ opacity, y, display }}
    >
      <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-ink tracking-tight">
        LET&apos;S GROW
        <br />
        TOGETHER.
      </h1>
      <p className="mt-6 max-w-2xl text-lg md:text-xl text-ash font-medium">
        Discover four ways to partner with the region&apos;s fastest-growing cookie brand.
      </p>
    </motion.div>
  );
}

// ==========================================
// SCENE 2: FOUR CARDS [0.15 - 0.30]
// ==========================================
type FourCardsProps = SceneProps & { cards: ReactNode };
export function FourCardsScene({ progress, cards }: FourCardsProps) {
  // Fade in at 0.15, peak 0.2-0.25, fade out by 0.30
  const opacity = useTransform(progress, [0.12, 0.18, 0.27, 0.30], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.12, 0.18], [0.95, 1]);
  const y = useTransform(progress, [0.12, 0.18], ["5%", "0%"]);
  const display = useTransform(progress, (p) => (p < 0.10 || p > 0.32) ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20 w-full"
      style={{ opacity, scale, y, display }}
    >
      <div className="w-full max-w-7xl px-4 md:px-8 max-h-screen overflow-y-auto pt-[20vh] pb-32 no-scrollbar">
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
  const opacity = useTransform(progress, [0.28, 0.32, 0.45, 0.48], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.28, 0.32], [0.9, 1]);
  const display = useTransform(progress, (p) => (p < 0.25 || p > 0.50) ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      style={{ opacity, scale, display }}
    >
      <h2 className="absolute top-[15vh] text-3xl md:text-5xl font-display font-black text-ink">
        WHY PARTNER WITH PANDUR?
      </h2>

      {/* Orbit of principles */}
      <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
        {PRINCIPLES.map((title, i) => {
          // Angle spaced evenly
          const angle = (i * (360 / PRINCIPLES.length)) - 90;
          const rad = (angle * Math.PI) / 180;
          const distance = 250; // pixels from center on desktop
          
          // Calculate active state based on progress slice (0.32 to 0.45)
          const start = 0.32 + (i * (0.13 / PRINCIPLES.length));
          const end = start + (0.13 / PRINCIPLES.length);
          
          // Highlight active principle
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const itemOpacity = useTransform(progress, [start - 0.02, start, end, end + 0.02], [0.3, 1, 1, 0.3]);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const itemScale = useTransform(progress, [start - 0.02, start, end, end + 0.02], [0.9, 1.1, 1.1, 0.9]);

          return (
            <motion.div
              key={title}
              className="absolute text-center"
              style={{
                x: Math.cos(rad) * distance,
                y: Math.sin(rad) * distance,
                opacity: itemOpacity,
                scale: itemScale
              }}
            >
              <p className="font-display font-bold text-red-deep md:text-lg max-w-[140px] leading-tight">
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
  const opacity = useTransform(progress, [0.46, 0.50, 0.60, 0.63], [0, 1, 1, 0]);
  const pathLength = useTransform(progress, [0.48, 0.61], [0, 1]);
  const display = useTransform(progress, (p) => (p < 0.44 || p > 0.65) ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      style={{ opacity, display }}
    >
      <h2 className="absolute top-[12vh] text-3xl md:text-5xl font-display font-black text-ink text-center">
        HOW THE PARTNERSHIP FITS
      </h2>

      <div className="relative w-full max-w-2xl h-[70vh] mx-auto mt-20">
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
              d="M 50 0 C 50 10, 10 15, 10 25 C 10 35, 90 40, 90 50 C 90 60, 10 65, 10 75 C 10 85, 50 90, 50 100"
              fill="none" 
              stroke="#A95324" 
              strokeWidth="1"
              style={{ pathLength }}
            />
          </svg>
        </div>

        {/* Node Labels */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between py-0">
          {NODES.map((node, i) => {
            const start = 0.49 + (i * 0.03);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const nodeOpacity = useTransform(progress, [start, start + 0.02], [0, 1]);
            
            return (
              <motion.div 
                key={node.id}
                className={`flex w-full items-center ${node.align === 'left' ? 'justify-start' : 'justify-end'}`}
                style={{ opacity: nodeOpacity }}
              >
                <div className={`bg-white/90 backdrop-blur-sm border border-ink/10 p-4 rounded-xl shadow-sm w-40 md:w-56 ${node.align === 'left' ? 'ml-8 md:ml-16' : 'mr-8 md:mr-16'}`}>
                  <h3 className="font-display font-black text-ink text-lg md:text-xl leading-none">{node.label}</h3>
                  <p className="text-ash text-xs uppercase tracking-wider mt-1">{node.desc}</p>
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
  const opacity = useTransform(progress, [0.61, 0.65, 0.73, 0.75], [0, 1, 1, 0]);
  
  // Progress sub-ranges for drawing paths
  const p1 = useTransform(progress, [0.64, 0.66], [0, 1]);
  const p2 = useTransform(progress, [0.66, 0.68], [0, 1]);
  const p3 = useTransform(progress, [0.68, 0.70], [0, 1]);
  const p4 = useTransform(progress, [0.70, 0.72], [0, 1]);
  const display = useTransform(progress, (p) => (p < 0.59 || p > 0.77) ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      style={{ opacity, display }}
    >
      <div className="relative w-full max-w-4xl aspect-square md:aspect-[16/9] flex items-center justify-center">
        {/* Center label below cookie */}
        <div className="absolute top-[60%] text-center">
          <h3 className="font-display font-black text-3xl text-ink">PANDUR</h3>
        </div>

        {/* Four paths radiating out */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <motion.line x1="50" y1="50" x2="15" y2="25" stroke="#A95324" strokeWidth="0.5" strokeDasharray="1 1" style={{ pathLength: p1 }} />
          <motion.line x1="50" y1="50" x2="85" y2="25" stroke="#A95324" strokeWidth="0.5" strokeDasharray="1 1" style={{ pathLength: p2 }} />
          <motion.line x1="50" y1="50" x2="15" y2="85" stroke="#A95324" strokeWidth="0.5" strokeDasharray="1 1" style={{ pathLength: p3 }} />
          <motion.line x1="50" y1="50" x2="85" y2="85" stroke="#A95324" strokeWidth="0.5" strokeDasharray="1 1" style={{ pathLength: p4 }} />
        </svg>

        {/* Corner labels */}
        <motion.div className="absolute top-[20%] left-[10%] bg-white px-4 py-2 rounded-full border border-ink/10 shadow-sm" style={{ opacity: p1 }}>
          <span className="font-bold text-sm">DISTRIBUTION</span>
        </motion.div>
        <motion.div className="absolute top-[20%] right-[10%] bg-white px-4 py-2 rounded-full border border-ink/10 shadow-sm" style={{ opacity: p2 }}>
          <span className="font-bold text-sm">RETAIL</span>
        </motion.div>
        <motion.div className="absolute bottom-[10%] left-[10%] bg-white px-4 py-2 rounded-full border border-ink/10 shadow-sm" style={{ opacity: p3 }}>
          <span className="font-bold text-sm">FOOD SERVICE</span>
        </motion.div>
        <motion.div className="absolute bottom-[10%] right-[10%] bg-white px-4 py-2 rounded-full border border-ink/10 shadow-sm" style={{ opacity: p4 }}>
          <span className="font-bold text-sm">TERRITORY</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 6: GROWTH [0.75 - 0.88]
// ==========================================
export function GrowthScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0.73, 0.77, 0.86, 0.88], [0, 1, 1, 0]);
  
  // Rings expanding outwards to signify growth
  const uaeScale = useTransform(progress, [0.76, 0.80], [0, 1]);
  const gccScale = useTransform(progress, [0.80, 0.84], [0, 1]);
  const beyondScale = useTransform(progress, [0.84, 0.87], [0, 1]);
  const display = useTransform(progress, (p) => (p < 0.71 || p > 0.90) ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      style={{ opacity, display }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg viewBox="0 0 100 100" className="w-[80vmin] h-[80vmin]">
          {/* Subtle stylized map representation */}
          <path d="M40,60 Q50,40 70,50 T80,80 T40,60" fill="currentColor" />
        </svg>
      </div>

      <h2 className="absolute top-[15vh] text-3xl md:text-5xl font-display font-black text-ink text-center max-w-2xl px-6">
        START IN THE UAE. GROW ACROSS THE GCC.
      </h2>

      <div className="relative w-[50vmin] h-[50vmin] flex items-center justify-center">
        <motion.div className="absolute w-24 h-24 rounded-full border-2 border-red-deep/40 flex items-center justify-center" style={{ scale: uaeScale }}>
          <span className="absolute -top-6 text-xs font-bold text-red-deep">UAE</span>
        </motion.div>
        <motion.div className="absolute w-64 h-64 rounded-full border-2 border-red-deep/30 flex items-center justify-center" style={{ scale: gccScale }}>
          <span className="absolute -top-6 text-xs font-bold text-red-deep">GCC</span>
        </motion.div>
        <motion.div className="absolute w-[400px] h-[400px] rounded-full border-2 border-red-deep/10 flex items-center justify-center" style={{ scale: beyondScale }}>
          <span className="absolute -top-6 text-xs font-bold text-red-deep/50">BEYOND</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 7: JOURNEY [0.88 - 0.95]
// ==========================================
export function JourneyScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0.86, 0.90, 0.94, 0.96], [0, 1, 1, 0]);
  
  const step = useTransform(progress, [0.88, 0.95], [0, 4]);
  const s1 = useTransform(step, [0, 1], [0, 1]);
  const s2 = useTransform(step, [1, 2], [0, 1]);
  const s3 = useTransform(step, [2, 3], [0, 1]);
  const s4 = useTransform(step, [3, 4], [0, 1]);
  const display = useTransform(progress, (p) => (p < 0.84 || p > 0.98) ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      style={{ opacity, display }}
    >
      <div className="flex w-full max-w-4xl justify-between px-10">
        <div className="text-center w-1/4">
          <motion.div style={{ opacity: s1 }}>
            <h3 className="font-display font-black text-xl text-ink">DISCOVER</h3>
          </motion.div>
        </div>
        <div className="text-center w-1/4">
          <motion.div style={{ opacity: s2 }}>
            <h3 className="font-display font-black text-xl text-ink">CONNECT</h3>
          </motion.div>
        </div>
        <div className="text-center w-1/4">
          <motion.div style={{ opacity: s3 }}>
            <h3 className="font-display font-black text-xl text-ink">STOCK</h3>
          </motion.div>
        </div>
        <div className="text-center w-1/4">
          <motion.div style={{ opacity: s4 }}>
            <h3 className="font-display font-black text-xl text-ink">GROW</h3>
          </motion.div>
        </div>
      </div>
      
      {/* Progress line */}
      <div className="w-full max-w-3xl h-1 bg-ink/10 mt-10 rounded-full overflow-hidden">
        <motion.div className="h-full bg-red-deep origin-left" style={{ scaleX: useTransform(step, [0, 4], [0, 1]) }} />
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 8: CTA [0.95 - 1.00]
// ==========================================
export function CTAScene({ progress }: SceneProps) {
  const opacity = useTransform(progress, [0.94, 0.97], [0, 1]);
  
  const labelsY = useTransform(progress, [0.95, 1], ["20px", "0px"]);
  const labelsOpacity = useTransform(progress, [0.95, 0.98], [0, 1]);
  const display = useTransform(progress, (p) => p < 0.92 ? "none" : "flex");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-auto z-40"
      style={{ opacity, display }}
    >
      {/* Background Labels */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center gap-10 opacity-10 font-display font-black text-6xl md:text-9xl whitespace-nowrap -z-10 text-ink/20 pointer-events-none overflow-hidden"
        style={{ y: labelsY, opacity: labelsOpacity }}
      >
        <span>DISTRIBUTION</span>
        <span>RETAIL</span>
        <span>TERRITORY</span>
      </motion.div>

      <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-ink mb-10 max-w-4xl mx-auto drop-shadow-sm mt-32">
        YOUR NEXT GROWTH MOVE STARTS HERE.
      </h2>
      
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
