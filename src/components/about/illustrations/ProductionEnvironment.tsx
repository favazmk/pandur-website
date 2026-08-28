"use client";

import { motion, MotionValue, useTransform } from "motion/react";

interface Props {
  progress: MotionValue<number>;
}

export default function ProductionEnvironment({ progress }: Props) {
  // Background Parallax
  const bgX = useTransform(progress, [0, 1], ["0%", "-60%"]);
  const bgY = useTransform(progress, [0, 1], ["0%", "-60%"]);

  // Midground Parallax (The actual factory line, 0 to -83.333% so the 6th panel ends up on screen)
  const midX = useTransform(progress, [0, 1], ["0%", "-83.333%"]);
  const midY = useTransform(progress, [0, 1], ["0%", "-83.333%"]);

  // Foreground Parallax (Moves faster, 0 to -100%)
  const fgX = useTransform(progress, [0, 1], ["0%", "-100%"]);
  const fgY = useTransform(progress, [0, 1], ["0%", "-100%"]);

  // Specific micro-animations for stages
  // MIX: 0 - 0.16
  const mixSpin = useTransform(progress, [0, 0.16, 0.26], [0, 360, 360]);
  
  // BAKE: 0.16 - 0.33
  const ovenGlow = useTransform(progress, [0.06, 0.25, 0.41], [0.3, 0.8, 0.3]);
  const ovenTrayX = useTransform(progress, [0.06, 0.41], ["-20%", "120%"]);
  
  // COOL: 0.33 - 0.50
  const fanSpin = useTransform(progress, [0.23, 0.6], [0, 720]);
  
  // QUALITY: 0.50 - 0.66
  const laserScale = useTransform(progress, [0.55, 0.62], [1, 1.5]);
  const laserOpacity = useTransform(progress, [0.55, 0.58, 0.62], [0, 1, 0]);
  
  // PACK: 0.66 - 0.83
  const packSeal = useTransform(progress, [0.70, 0.80], [1, 0.8]);
  const packSlide = useTransform(progress, [0.70, 0.83], ["0%", "100%"]);

  // MAGNETIC: 0.83 - 1.0
  const magPulse = useTransform(progress, [0.85, 0.9, 0.95, 1], [0.7, 1.1, 0.7, 1.1]);
  const magOpacity = useTransform(progress, [0.85, 0.9, 0.95, 1], [0.3, 1, 0.3, 1]);

  return (
    <div className="relative w-full h-full overflow-visible">
      
      {/* 
        We use CSS variables to handle the responsive transform.
        On mobile, we transform Y. On desktop, we transform X.
      */}
      <motion.div 
        style={{
          "--bg-x": bgX, "--bg-y": bgY,
          "--mid-x": midX, "--mid-y": midY,
          "--fg-x": fgX, "--fg-y": fgY,
        } as React.CSSProperties}
        className="absolute inset-0 w-full h-full"
      >
        
        {/* ================= BACKGROUND LAYER ================= */}
        <div className="absolute top-0 left-0 w-full h-[600vh] md:w-[600vw] md:h-full
                        transform translate-y-[var(--bg-y)] md:translate-y-0 md:translate-x-[var(--bg-x)]
                        flex flex-col md:flex-row pointer-events-none opacity-20">
          
          {/* Continuous architectural background (windows, columns) */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-none w-full h-[50vh] md:w-[50vw] md:h-full border-b md:border-b-0 md:border-r border-[#33412B] flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="#33412B" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="#33412B" strokeWidth="0.5" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="#33412B" strokeWidth="0.5" />
              </svg>
            </div>
          ))}
        </div>


        {/* ================= MIDGROUND LAYER (THE FACTORY LINE) ================= */}
        <div className="absolute top-0 left-0 w-full h-[600vh] md:w-[600vw] md:h-full
                        transform translate-y-[var(--mid-y)] md:translate-y-0 md:translate-x-[var(--mid-x)]
                        flex flex-col md:flex-row items-center justify-start pointer-events-none">
          
          {/* Continuous Conveyor Belt */}
          {/* Mobile: Vertical line in center */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 md:hidden bg-gradient-to-r from-[#D8B56A]/20 via-[#F3EEE4] to-[#D8B56A]/20 border-x border-[#33412B]/40 z-0" />
          {/* Desktop: Horizontal line in center */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 hidden md:block bg-gradient-to-b from-[#D8B56A]/20 via-[#F3EEE4] to-[#D8B56A]/20 border-y border-[#33412B]/40 z-0" />
          
          {/* 1. MIXING STATION */}
          <div className="flex-none w-full h-[100vh] md:w-[100vw] md:h-full flex items-center justify-center relative z-10">
            <div className="absolute top-[15%] md:top-auto md:bottom-24 left-6 md:left-24 z-20 max-w-xs bg-[#F3EEE4]/90 backdrop-blur-md p-4 rounded-2xl border border-[#33412B]/10 shadow-lg">
              <span className="block text-3xl md:text-4xl font-display font-black text-[#33412B]">01 / MIXING</span>
              <p className="mt-2 text-xs md:text-sm text-[#33412B]/90 font-medium">
                Ingredients come together under strictly controlled mixing conditions to ensure perfect dough consistency.
              </p>
            </div>
            <svg viewBox="0 0 500 500" className="w-[85vw] h-[85vw] md:w-[45vw] md:h-[45vw] max-w-[600px] max-h-[600px]">
              {/* Structural Base */}
              <rect x="150" y="350" width="160" height="50" rx="4" fill="#33412B" />
              <rect x="120" y="380" width="220" height="20" rx="2" fill="#8A6B38" />

              {/* Input Pipes & Hoppers */}
              <path d="M 200 20 L 200 80 M 260 20 L 260 80" stroke="#33412B" strokeWidth="12" strokeLinecap="round" />
              <path d="M 180 80 L 280 80 L 250 140 L 210 140 Z" fill="#F3EEE4" stroke="#33412B" strokeWidth="6" />
              <circle cx="230" cy="110" r="15" fill="#D8B56A" />

              {/* Main Tank Body */}
              <rect x="110" y="140" width="240" height="220" rx="40" fill="#F3EEE4" stroke="#33412B" strokeWidth="8" />
              <path d="M 110 200 L 350 200 M 110 260 L 350 260" stroke="#33412B" strokeWidth="2" strokeDasharray="6 6" />

              {/* Glass Observation Window */}
              <circle cx="230" cy="250" r="70" fill="#E8E2D2" stroke="#33412B" strokeWidth="6" />
              <path d="M 180 230 Q 230 190 270 240" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

              {/* Complex Motor / Gears on side */}
              <rect x="50" y="200" width="60" height="100" rx="10" fill="#8A6B38" stroke="#33412B" strokeWidth="6" />
              <circle cx="80" cy="230" r="15" fill="#F3EEE4" stroke="#33412B" strokeWidth="4" />
              <circle cx="80" cy="270" r="15" fill="#F3EEE4" stroke="#33412B" strokeWidth="4" />
              <path d="M 80 230 L 80 270" stroke="#33412B" strokeWidth="6" />

              {/* Mixing Blades (Animated) - Visible through window */}
              <g style={{ clipPath: "circle(66px at 230px 250px)" }}>
                <motion.g style={{ rotate: mixSpin, transformOrigin: "230px 250px" }}>
                  {/* Central Shaft */}
                  <circle cx="230" cy="250" r="12" fill="#33412B" />
                  {/* Heavy Duty Blades */}
                  <path d="M 230 250 L 230 150 M 230 250 L 230 350 M 230 250 L 130 250 M 230 250 L 330 250" stroke="#33412B" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 230 250 L 290 190 M 230 250 L 170 310" stroke="#8A6B38" strokeWidth="8" strokeLinecap="round" />
                </motion.g>
              </g>

              {/* Digital Control Panel */}
              <rect x="360" y="160" width="60" height="150" rx="8" fill="#F3EEE4" stroke="#33412B" strokeWidth="6" />
              <rect x="370" y="180" width="40" height="40" rx="2" fill="#33412B" />
              <line x1="375" y1="200" x2="405" y2="200" stroke="#4D7130" strokeWidth="4" />
              <circle cx="380" cy="250" r="8" fill="#D8B56A" />
              <circle cx="400" cy="250" r="8" fill="#8A6B38" />
              <circle cx="390" cy="280" r="10" fill="#4D7130" />
            </svg>
          </div>

          {/* 2. BAKING STATION */}
          <div className="flex-none w-full h-[100vh] md:w-[100vw] md:h-full flex items-center justify-center relative z-10">
            <div className="absolute top-[15%] md:top-auto md:bottom-24 left-6 md:left-24 z-20 max-w-xs bg-[#F3EEE4]/90 backdrop-blur-md p-4 rounded-2xl border border-[#33412B]/10 shadow-lg">
              <span className="block text-3xl md:text-4xl font-display font-black text-[#33412B]">02 / BAKING</span>
              <p className="mt-2 text-xs md:text-sm text-[#33412B]/90 font-medium">
                Passing through temperature-profiled industrial ovens to achieve the exact golden bake and texture.
              </p>
            </div>
            <svg viewBox="0 0 700 500" className="w-[95vw] h-[65vw] md:w-[60vw] md:h-[40vw] max-w-[800px] max-h-[600px]">
              {/* Massive Exhaust Hood / Chimney */}
              <path d="M 250 150 L 300 50 L 400 50 L 450 150 Z" fill="#E8E2D2" stroke="#33412B" strokeWidth="6" />
              <line x1="350" y1="50" x2="350" y2="20" stroke="#33412B" strokeWidth="8" />
              <path d="M 340 10 Q 350 -10 360 10 T 380 10" fill="none" stroke="#D8B56A" strokeWidth="4" />
              
              {/* Heavy Oven Body */}
              <rect x="50" y="150" width="600" height="220" rx="15" fill="#F3EEE4" stroke="#33412B" strokeWidth="8" />
              
              {/* Section Dividers */}
              <line x1="200" y1="150" x2="200" y2="370" stroke="#33412B" strokeWidth="6" />
              <line x1="500" y1="150" x2="500" y2="370" stroke="#33412B" strokeWidth="6" />

              {/* Control Gauges */}
              <circle cx="125" cy="110" r="25" fill="#F3EEE4" stroke="#33412B" strokeWidth="6" />
              <path d="M 125 110 L 140 100" stroke="#8A6B38" strokeWidth="4" strokeLinecap="round" />
              <circle cx="350" cy="110" r="25" fill="#F3EEE4" stroke="#33412B" strokeWidth="6" />
              <path d="M 350 110 L 360 95" stroke="#8A6B38" strokeWidth="4" strokeLinecap="round" />
              <circle cx="575" cy="110" r="25" fill="#F3EEE4" stroke="#33412B" strokeWidth="6" />
              <path d="M 575 110 L 560 100" stroke="#8A6B38" strokeWidth="4" strokeLinecap="round" />

              {/* Temperature Profile Glow */}
              <motion.rect x="220" y="180" width="260" height="150" rx="8" fill="#D8B56A" style={{ opacity: ovenGlow }} />

              {/* Viewing Windows */}
              <rect x="80" y="200" width="90" height="100" rx="10" fill="#E8E2D2" stroke="#33412B" strokeWidth="6" />
              <rect x="230" y="200" width="240" height="100" rx="10" fill="none" stroke="#33412B" strokeWidth="6" />
              <rect x="530" y="200" width="90" height="100" rx="10" fill="#E8E2D2" stroke="#33412B" strokeWidth="6" />

              {/* Heating Elements */}
              <path d="M 250 220 L 450 220 M 250 280 L 450 280" stroke="#8A6B38" strokeWidth="8" strokeDasharray="20 10" />
              
              {/* Moving Trays inside Oven */}
              <g style={{ clipPath: "polygon(80px 200px, 620px 200px, 620px 300px, 80px 300px)" }}>
                <motion.g style={{ x: ovenTrayX }}>
                  {/* Tray 1 */}
                  <rect x="150" y="260" width="100" height="12" rx="4" fill="#33412B" />
                  <circle cx="170" cy="245" r="12" fill="#8A6B38" />
                  <circle cx="200" cy="245" r="12" fill="#8A6B38" />
                  <circle cx="230" cy="245" r="12" fill="#8A6B38" />

                  {/* Tray 2 */}
                  <rect x="350" y="260" width="100" height="12" rx="4" fill="#33412B" />
                  <circle cx="370" cy="245" r="12" fill="#8A6B38" />
                  <circle cx="400" cy="245" r="12" fill="#8A6B38" />
                  <circle cx="430" cy="245" r="12" fill="#8A6B38" />
                  
                  {/* Tray 3 */}
                  <rect x="550" y="260" width="100" height="12" rx="4" fill="#33412B" />
                  <circle cx="570" cy="245" r="12" fill="#8A6B38" />
                  <circle cx="600" cy="245" r="12" fill="#8A6B38" />
                  <circle cx="630" cy="245" r="12" fill="#8A6B38" />
                </motion.g>
              </g>
            </svg>
          </div>

          {/* 3. COOLING STATION */}
          <div className="flex-none w-full h-[100vh] md:w-[100vw] md:h-full flex items-center justify-center relative z-10">
            <div className="absolute top-[15%] md:top-auto md:bottom-24 left-6 md:left-24 z-20 max-w-xs bg-[#F3EEE4]/90 backdrop-blur-md p-4 rounded-2xl border border-[#33412B]/10 shadow-lg">
              <span className="block text-3xl md:text-4xl font-display font-black text-[#33412B]">03 / COOLING</span>
              <p className="mt-2 text-xs md:text-sm text-[#33412B]/90 font-medium">
                Controlled ambient airflow brings the product down to the precise temperature required for packaging.
              </p>
            </div>
            <svg viewBox="0 0 600 500" className="w-[85vw] h-[70vw] md:w-[50vw] md:h-[40vw] max-w-[700px] max-h-[600px]">
              {/* Cooling Tunnel Structure */}
              <rect x="50" y="150" width="500" height="20" fill="#33412B" />
              <rect x="50" y="320" width="500" height="20" fill="#33412B" />
              <path d="M 80 170 L 80 320 M 200 170 L 200 320 M 400 170 L 400 320 M 520 170 L 520 320" stroke="#33412B" strokeWidth="8" />

              {/* Detailed Industrial Fans */}
              {/* Fan 1 */}
              <g transform="translate(140, 60)">
                <rect x="-60" y="0" width="120" height="90" rx="10" fill="#F3EEE4" stroke="#33412B" strokeWidth="6" />
                <rect x="-70" y="20" width="10" height="50" fill="#8A6B38" stroke="#33412B" strokeWidth="4" />
                <rect x="60" y="20" width="10" height="50" fill="#8A6B38" stroke="#33412B" strokeWidth="4" />
                <circle cx="0" cy="45" r="35" fill="#E8E2D2" stroke="#33412B" strokeWidth="4" />
                
                <motion.g style={{ rotate: fanSpin, transformOrigin: "0px 45px" }}>
                  <path d="M 0 45 L 0 15 A 30 30 0 0 1 20 25 Z" fill="#33412B" />
                  <path d="M 0 45 L 30 45 A 30 30 0 0 1 20 65 Z" fill="#33412B" />
                  <path d="M 0 45 L 0 75 A 30 30 0 0 1 -20 65 Z" fill="#33412B" />
                  <path d="M 0 45 L -30 45 A 30 30 0 0 1 -20 25 Z" fill="#33412B" />
                  <circle cx="0" cy="45" r="8" fill="#8A6B38" />
                </motion.g>
                <circle cx="0" cy="45" r="35" fill="none" stroke="#33412B" strokeWidth="2" strokeDasharray="4 4" />
              </g>

              {/* Fan 2 */}
              <g transform="translate(460, 60)">
                <rect x="-60" y="0" width="120" height="90" rx="10" fill="#F3EEE4" stroke="#33412B" strokeWidth="6" />
                <rect x="-70" y="20" width="10" height="50" fill="#8A6B38" stroke="#33412B" strokeWidth="4" />
                <rect x="60" y="20" width="10" height="50" fill="#8A6B38" stroke="#33412B" strokeWidth="4" />
                <circle cx="0" cy="45" r="35" fill="#E8E2D2" stroke="#33412B" strokeWidth="4" />
                
                <motion.g style={{ rotate: fanSpin, transformOrigin: "0px 45px" }}>
                  <path d="M 0 45 L 0 15 A 30 30 0 0 1 20 25 Z" fill="#33412B" />
                  <path d="M 0 45 L 30 45 A 30 30 0 0 1 20 65 Z" fill="#33412B" />
                  <path d="M 0 45 L 0 75 A 30 30 0 0 1 -20 65 Z" fill="#33412B" />
                  <path d="M 0 45 L -30 45 A 30 30 0 0 1 -20 25 Z" fill="#33412B" />
                  <circle cx="0" cy="45" r="8" fill="#8A6B38" />
                </motion.g>
                <circle cx="0" cy="45" r="35" fill="none" stroke="#33412B" strokeWidth="2" strokeDasharray="4 4" />
              </g>

              {/* Cooling Coils inside tunnel */}
              <path d="M 100 180 Q 150 250 200 180 T 300 180 T 400 180 T 500 180" fill="none" stroke="#D8B56A" strokeWidth="8" opacity="0.4" />
              <path d="M 100 220 Q 150 290 200 220 T 300 220 T 400 220 T 500 220" fill="none" stroke="#D8B56A" strokeWidth="8" opacity="0.4" />

              {/* Airflow Indicators (Waves) */}
              <path d="M 120 250 Q 140 280 160 250 T 200 250" fill="none" stroke="#8A6B38" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 5" />
              <path d="M 400 250 Q 420 280 440 250 T 480 250" fill="none" stroke="#8A6B38" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 5" />

              {/* Cooled Cookies on Conveyor */}
              <rect x="150" y="305" width="40" height="15" rx="5" fill="#8A6B38" />
              <rect x="250" y="305" width="40" height="15" rx="5" fill="#8A6B38" />
              <rect x="350" y="305" width="40" height="15" rx="5" fill="#8A6B38" />
              <rect x="450" y="305" width="40" height="15" rx="5" fill="#8A6B38" />
            </svg>
          </div>

          {/* 4. QUALITY STATION */}
          <div className="flex-none w-full h-[100vh] md:w-[100vw] md:h-full flex items-center justify-center relative z-10">
            <div className="absolute top-[15%] md:top-auto md:bottom-24 left-6 md:left-24 z-20 max-w-xs bg-[#F3EEE4]/90 backdrop-blur-md p-4 rounded-2xl border border-[#33412B]/10 shadow-lg">
              <span className="block text-3xl md:text-4xl font-display font-black text-[#33412B]">04 / QUALITY</span>
              <p className="mt-2 text-xs md:text-sm text-[#33412B]/90 font-medium">
                Continuous automated inspection ensures every piece meets our strict visual and structural standards.
              </p>
            </div>
            <svg viewBox="0 0 500 500" className="w-[85vw] h-[85vw] md:w-[45vw] md:h-[45vw] max-w-[600px] max-h-[600px]">
              {/* Complex Robotic Arch */}
              <path d="M 100 350 L 100 120 C 100 80 400 80 400 120 L 400 350" fill="none" stroke="#33412B" strokeWidth="20" strokeLinecap="square" />
              
              {/* Inner structural truss */}
              <path d="M 120 350 L 120 140 C 120 100 380 100 380 140 L 380 350" fill="none" stroke="#8A6B38" strokeWidth="6" strokeLinecap="square" />
              <path d="M 100 200 L 120 220 M 100 250 L 120 270 M 100 300 L 120 320" stroke="#8A6B38" strokeWidth="4" />
              <path d="M 400 200 L 380 220 M 400 250 L 380 270 M 400 300 L 380 320" stroke="#8A6B38" strokeWidth="4" />
              
              {/* Central Scanner Hub */}
              <rect x="200" y="50" width="100" height="60" rx="10" fill="#F3EEE4" stroke="#33412B" strokeWidth="8" />
              
              {/* Robotic Eye / Scanner Head */}
              <path d="M 230 110 L 270 110 L 280 150 L 220 150 Z" fill="#D8B56A" stroke="#33412B" strokeWidth="6" />
              <circle cx="250" cy="150" r="15" fill="#33412B" />
              
              {/* Digital Readout Screen */}
              <rect x="300" y="200" width="120" height="80" rx="5" fill="#33412B" stroke="#8A6B38" strokeWidth="6" />
              <rect x="310" y="210" width="100" height="60" fill="#222" />
              <path d="M 320 250 L 340 230 L 360 260 L 390 220" fill="none" stroke="#4D7130" strokeWidth="4" strokeLinecap="round" />
              
              {/* Animated Laser Array */}
              <g style={{ transformOrigin: "250px 150px" }}>
                <motion.polygon 
                  points="230,150 270,150 350,330 150,330" 
                  fill="#4D7130" 
                  style={{ opacity: laserOpacity, scaleX: laserScale, transformOrigin: "250px 150px" }} 
                />
              </g>
              
              {/* The Perfect Cookie on Conveyor */}
              <rect x="210" y="315" width="80" height="25" rx="12" fill="#8A6B38" stroke="#33412B" strokeWidth="4" />
              <circle cx="230" cy="325" r="3" fill="#33412B" opacity="0.5" />
              <circle cx="260" cy="320" r="4" fill="#33412B" opacity="0.5" />
              <circle cx="270" cy="330" r="3" fill="#33412B" opacity="0.5" />
              
              {/* Giant Confirmation Checkmark (Animates in) */}
              <motion.g style={{ opacity: laserOpacity }}>
                <circle cx="250" cy="240" r="40" fill="#F3EEE4" stroke="#4D7130" strokeWidth="6" />
                <path 
                  d="M 230 240 L 245 255 L 275 225" 
                  fill="none" 
                  stroke="#4D7130" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </motion.g>
            </svg>
          </div>

          {/* 5. PACKAGING STATION */}
          <div className="flex-none w-full h-[100vh] md:w-[100vw] md:h-full flex items-center justify-center relative z-10">
            <div className="absolute top-[15%] md:top-auto md:bottom-24 left-6 md:left-24 z-20 max-w-xs bg-[#F3EEE4]/90 backdrop-blur-md p-4 rounded-2xl border border-[#33412B]/10 shadow-lg">
              <span className="block text-3xl md:text-4xl font-display font-black text-[#33412B]">05 / PACKAGING</span>
              <p className="mt-2 text-xs md:text-sm text-[#33412B]/90 font-medium">
                Swift automated sealing preserves freshness immediately, preparing the product for market distribution.
              </p>
            </div>
            <svg viewBox="0 0 600 500" className="w-[90vw] h-[75vw] md:w-[55vw] md:h-[45vw] max-w-[700px] max-h-[600px]">
              {/* Massive Automated Packaging Machine Base */}
              <rect x="100" y="200" width="400" height="180" rx="20" fill="#F3EEE4" stroke="#33412B" strokeWidth="8" />
              <rect x="80" y="380" width="440" height="30" rx="5" fill="#33412B" />

              {/* Feed Hopper for Cookies */}
              <path d="M 150 100 L 250 100 L 220 200 L 180 200 Z" fill="#E8E2D2" stroke="#33412B" strokeWidth="6" />
              <rect x="190" y="150" width="20" height="10" rx="2" fill="#8A6B38" />

              {/* Foil Roll System */}
              <circle cx="350" cy="100" r="60" fill="#D8B56A" stroke="#33412B" strokeWidth="6" />
              <circle cx="350" cy="100" r="20" fill="#33412B" />
              {/* Foil path through rollers */}
              <path d="M 290 100 C 250 100 300 150 250 200" fill="none" stroke="#D8B56A" strokeWidth="8" />
              <circle cx="280" cy="140" r="10" fill="#33412B" />
              <circle cx="260" cy="170" r="10" fill="#33412B" />

              {/* Heavy Pneumatic Sealing Press */}
              <rect x="230" y="200" width="80" height="40" fill="#8A6B38" stroke="#33412B" strokeWidth="6" />
              <rect x="260" y="240" width="20" height="30" fill="#33412B" />
              {/* The animating seal head */}
              <motion.rect 
                x="210" y="270" 
                width="120" height="30" 
                rx="8" 
                fill="#33412B" 
                style={{ scaleY: packSeal, transformOrigin: "270px 270px" }} 
              />
              
              {/* Control Panel for Packaging */}
              <rect x="420" y="220" width="60" height="100" rx="10" fill="#8A6B38" stroke="#33412B" strokeWidth="6" />
              <circle cx="450" cy="250" r="15" fill="#4D7130" stroke="#33412B" strokeWidth="4" />
              <circle cx="450" cy="290" r="10" fill="#F3EEE4" />

              {/* Finished Pack Moving Forward on separate Exit Ramp */}
              <path d="M 270 340 L 500 340" stroke="#33412B" strokeWidth="8" />
              <circle cx="300" cy="350" r="10" fill="#8A6B38" />
              <circle cx="380" cy="350" r="10" fill="#8A6B38" />
              <circle cx="460" cy="350" r="10" fill="#8A6B38" />

              <motion.g style={{ x: packSlide }}>
                <rect x="320" y="270" width="120" height="60" rx="6" fill="#F3EEE4" stroke="#4D7130" strokeWidth="6" />
                {/* Pandur Logo representation on package */}
                <path d="M 350 300 Q 380 280 410 300" fill="none" stroke="#D8B56A" strokeWidth="6" strokeLinecap="round" />
                <rect x="360" y="315" width="40" height="8" rx="4" fill="#33412B" opacity="0.4" />
                <circle cx="420" cy="315" r="6" fill="#4D7130" />
              </motion.g>

            </svg>
          </div>

          {/* 6. MAGNETIC TESTING STATION */}
          <div className="flex-none w-full h-[100vh] md:w-[100vw] md:h-full flex items-center justify-center relative z-10">
            <div className="absolute top-[15%] md:top-auto md:bottom-24 left-6 md:left-24 z-20 max-w-xs bg-[#F3EEE4]/90 backdrop-blur-md p-4 rounded-2xl border border-[#33412B]/10 shadow-lg">
              <span className="block text-3xl md:text-4xl font-display font-black text-[#33412B]">06 / MAGNETIC TESTING</span>
              <p className="mt-2 text-xs md:text-sm text-[#33412B]/90 font-medium">
                Advanced magnetic inspection guarantees safety and purity before final shipment.
              </p>
            </div>
            <svg viewBox="0 0 500 500" className="w-[85vw] h-[85vw] md:w-[45vw] md:h-[45vw] max-w-[600px] max-h-[600px]" role="img" aria-label="Magnetic testing station">
              <g id="magnetic-machine">
                {/* Support frame */}
                <path d="M 120 380 L 120 220 Q 120 180 160 180 L 340 180 Q 380 180 380 220 L 380 380" fill="none" stroke="#33412B" strokeWidth="16" strokeLinecap="round" />
                <path d="M 150 380 L 150 220 Q 150 190 180 190 L 320 190 Q 350 190 350 220 L 350 380" fill="none" stroke="#8A6B38" strokeWidth="4" strokeLinecap="round" />
                
                {/* Central Inspection Housing (Tunnel) */}
                <rect x="180" y="150" width="140" height="180" rx="15" fill="#F3EEE4" stroke="#33412B" strokeWidth="8" />
                
                {/* Conveyor Belt running through */}
                <path d="M 50 320 L 450 320 M 50 340 L 450 340" stroke="#33412B" strokeWidth="6" />
                <rect x="50" y="320" width="400" height="20" rx="4" fill="#E8E2D2" />
                <line x1="50" y1="320" x2="450" y2="320" stroke="#33412B" strokeWidth="2" />
                <line x1="50" y1="340" x2="450" y2="340" stroke="#33412B" strokeWidth="2" />
                {/* Conveyor Rollers */}
                <circle cx="80" cy="330" r="10" fill="#8A6B38" />
                <circle cx="150" cy="330" r="10" fill="#8A6B38" />
                <circle cx="350" cy="330" r="10" fill="#8A6B38" />
                <circle cx="420" cy="330" r="10" fill="#8A6B38" />
                
                {/* The Product (Cookie) on the conveyor */}
                <rect x="220" y="305" width="60" height="15" rx="7.5" fill="#8A6B38" stroke="#33412B" strokeWidth="2" />
                <circle cx="235" cy="312" r="2.5" fill="#33412B" opacity="0.4" />
                <circle cx="265" cy="310" r="3" fill="#33412B" opacity="0.4" />
                
                {/* Magnetic Inspection Unit (Head above the cookie) */}
                <rect x="210" y="180" width="80" height="40" rx="5" fill="#33412B" />
                <rect x="225" y="220" width="50" height="20" fill="#8A6B38" stroke="#33412B" strokeWidth="4" />
                
                {/* Subtle Magnetic Field Marks (Animated) */}
                <g id="magnetic-field" style={{ transformOrigin: "250px 240px" }}>
                  <motion.g style={{ scale: magPulse, opacity: magOpacity, transformOrigin: "250px 240px" }}>
                    <path d="M 230 250 A 20 20 0 0 1 270 250" fill="none" stroke="#D8B56A" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 215 265 A 35 35 0 0 1 285 265" fill="none" stroke="#D8B56A" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 200 280 A 50 50 0 0 1 300 280" fill="none" stroke="#D8B56A" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
                  </motion.g>
                </g>

                {/* Control Indicator & Display */}
                <rect x="300" y="170" width="10" height="30" fill="#33412B" />
                <circle cx="305" cy="160" r="8" fill="#4D7130" stroke="#33412B" strokeWidth="2" />
                <rect x="195" y="160" width="30" height="10" rx="2" fill="#E8E2D2" />
                <circle cx="240" cy="195" r="5" fill="#4D7130" />
                <circle cx="260" cy="195" r="5" fill="#D8B56A" />

              </g>
            </svg>
          </div>
          
        </div>


        {/* ================= FOREGROUND LAYER ================= */}
        <div className="absolute top-0 left-0 w-full h-[600vh] md:w-[600vw] md:h-full
                        transform translate-y-[var(--fg-y)] md:translate-y-0 md:translate-x-[var(--fg-x)]
                        flex flex-col md:flex-row pointer-events-none z-20">
          
          {/* A few large blurred pipes or architectural struts passing close to camera */}
          <div className="absolute top-1/4 left-[50vw] w-8 h-[200vh] md:w-[200vw] md:h-8 bg-[#33412B] opacity-10 blur-sm transform rotate-45" />
          <div className="absolute top-3/4 left-[150vw] w-12 h-[200vh] md:w-[200vw] md:h-12 bg-[#8A6B38] opacity-10 blur-md transform -rotate-12" />
          <div className="absolute top-1/2 left-[350vw] w-16 h-[200vh] md:w-[200vw] md:h-16 bg-[#33412B] opacity-10 blur-sm transform rotate-45" />
          <div className="absolute top-1/3 left-[450vw] w-10 h-[200vh] md:w-[200vw] md:h-10 bg-[#8A6B38] opacity-10 blur-sm transform -rotate-12" />
          
        </div>
        
      </motion.div>
    </div>
  );
}
