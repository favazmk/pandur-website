"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, type MotionValue } from "motion/react";
import { SCENES } from "@/lib/showcase";
import { FLAVOUR_PROPS, cropStyle, type ShowcaseProp } from "@/lib/showcaseProps";

const PRODUCTS_ORDER = ["butter", "cardamom", "coconut", "peanut"] as const;

const PRODUCT_SCENES = PRODUCTS_ORDER.map(slug => {
  const base = SCENES.find(s => s.id === slug)!;
  return {
    ...base,
    packImage: `/products/hero-${slug}-scene.png`,
    bg: slug === "butter" ? "#dfe8b2" 
      : slug === "cardamom" ? "#31581e" 
      : slug === "coconut" ? "#dcc29a" 
      : "#a95324"
  };
});

function FlavourWorld({ 
  scene, 
  index, 
  progress, 
  total 
}: { 
  scene: typeof PRODUCT_SCENES[0], 
  index: number, 
  progress: MotionValue<number>, 
  total: number 
}) {
  const span = 1 / total;
  const start = index * span;
  const end = (index + 1) * span;
  const blend = 0.15;
  
  // Opacity: fade in during the previous scene's tail end, full during its slot, fade out during next
  const opacity = useTransform(
    progress,
    [Math.max(0, start - blend), start, end - blend, end],
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0]
  );
  
  // Z-index trick to keep the active one on top
  const zIndex = useTransform(progress, (p) => {
    if (p >= start - blend && p <= end) return 10;
    return 1;
  });
  
  // Scale down when exiting
  const scale = useTransform(
    progress,
    [end - blend, end],
    [1, 0.9]
  );
  
  // Mouse 3D rotation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 150, damping: 20 });
  
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const onPointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const props = FLAVOUR_PROPS[scene.id] || [];
  
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity, zIndex, scale }}
    >
      <div 
        className="relative w-full max-w-7xl h-full flex items-center justify-center pointer-events-auto"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {/* Midground Ingredients (Back) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {props.filter(p => p.plane === 'back').map((prop, i) => (
            <IngredientPiece key={i} prop={prop} progress={progress} />
          ))}
        </div>
        
        {/* Main Product */}
        <motion.div 
          className="relative z-10 w-full max-w-2xl px-6 md:px-0"
          style={{ rotateX, rotateY, perspective: 1000 }}
        >
          <img 
            src={scene.packImage} 
            alt={scene.name}
            className="w-full h-auto drop-shadow-2xl"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] text-center pointer-events-none">
            <h2 className="text-8xl md:text-[10rem] font-display font-black tracking-tight text-white/20 uppercase">
              {scene.name}
            </h2>
          </div>
        </motion.div>
        
        {/* Foreground Ingredients (Front) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {props.filter(p => p.plane === 'front').map((prop, i) => (
            <IngredientPiece key={i} prop={prop} progress={progress} />
          ))}
        </div>
        
        {/* Floating Text Info */}
        <motion.div 
          className="absolute bottom-12 md:bottom-24 left-6 md:left-12 z-30"
          style={{
            y: useTransform(progress, [start, start + 0.1], [50, 0]),
            opacity: useTransform(progress, [start, start + 0.1], [0, 1])
          }}
        >
          <h3 className="text-4xl md:text-6xl font-display font-black text-ink">{scene.name}</h3>
          <p className="text-lg md:text-xl text-ink/80 max-w-sm mt-4">{scene.note}</p>
          <div className="mt-8 flex gap-6 text-sm font-bold tracking-widest uppercase text-ink/60">
            <div>
              <span className="block text-xs opacity-60">Shelf Life</span>
              6 Months
            </div>
            <div>
              <span className="block text-xs opacity-60">Box</span>
              16 Pcs
            </div>
            <div>
              <span className="block text-xs opacity-60">Origin</span>
              Made in UAE
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function IngredientPiece({ prop, progress }: { prop: ShowcaseProp, progress: MotionValue<number> }) {
  // Simple parallax effect driven by master progress
  const yOffset = useTransform(progress, [0, 1], [`${prop.parallax * 3}%`, `-${prop.parallax * 3}%`]);
  
  return (
    <div 
      className="absolute -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{
        left: `${prop.place.x}%`,
        top: `${prop.place.y}%`,
        width: `${prop.place.size}%`,
      }}
    >
      <motion.div style={{ y: yOffset }}>
        <div style={{
          ...cropStyle(prop.crop),
          transform: `rotate(${prop.rotate}deg)`,
          opacity: prop.opacity,
          filter: prop.blur ? `blur(${prop.blur}px)` : undefined,
        }} />
      </motion.div>
    </div>
  );
}

export default function ProductJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const bgColors = PRODUCT_SCENES.map(s => s.bg);
  const bgStops = PRODUCT_SCENES.map((_, i) => i / (PRODUCT_SCENES.length - 1));
  
  const backgroundColor = useTransform(scrollYProgress, bgStops, bgColors);

  return (
    <section ref={containerRef} className="relative h-[400vh]">
      <motion.div 
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor }}
      >
        {PRODUCT_SCENES.map((scene, i) => (
          <FlavourWorld 
            key={scene.id} 
            scene={scene} 
            index={i} 
            total={PRODUCT_SCENES.length} 
            progress={scrollYProgress} 
          />
        ))}
      </motion.div>
    </section>
  );
}
