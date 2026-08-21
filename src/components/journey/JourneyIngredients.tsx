"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import {
  FLAVOUR_LAYER_INSTANCES,
  FLAVOUR_SVG_CONFIGS,
  type FlavourLayerInstance,
} from "@/lib/cookieJourney";

export default function JourneyIngredients({
  progress,
  isMobile = false,
  reduced = false,
}: {
  progress: MotionValue<number>;
  isMobile?: boolean;
  reduced?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-15">
      {FLAVOUR_LAYER_INSTANCES.map((instance) => (
        <FlavourIngredientCluster
          key={instance.id}
          instance={instance}
          progress={progress}
          isMobile={isMobile}
          reduced={reduced}
        />
      ))}
    </div>
  );
}

function FlavourIngredientCluster({
  instance,
  progress,
  isMobile,
  reduced,
}: {
  instance: FlavourLayerInstance;
  progress: MotionValue<number>;
  isMobile?: boolean;
  reduced?: boolean;
}) {
  const { flavour, triggerProgress, driftX, driftY, driftRotate } = instance;
  const config = FLAVOUR_SVG_CONFIGS[flavour];
  const { worldStart, worldEnd } = config;

  // All hooks called unconditionally at top level
  const opacityFade = useTransform(
    progress,
    [worldStart - 0.03, worldStart + 0.04, worldEnd - 0.04, worldEnd + 0.03],
    [0, instance.opacity, instance.opacity, 0]
  );

  const parallaxY = useTransform(
    progress,
    [worldStart, worldEnd],
    [16, -16]
  );

  const reaction = useTransform(
    progress,
    [triggerProgress - 0.03, triggerProgress, triggerProgress + 0.06],
    [0, 1, 1],
    { clamp: true }
  );

  const reactX = useTransform(reaction, [0, 1], [0, driftX]);
  const reactY = useTransform(reaction, [0, 1], [0, driftY]);
  const reactRot = useTransform(reaction, [0, 1], [0, driftRotate]);

  // Coordinates
  const x = isMobile && instance.mobile ? instance.mobile.x : instance.x;
  const y = isMobile && instance.mobile ? instance.mobile.y : instance.y;
  const widthVw = isMobile && instance.mobile ? instance.mobile.widthVw : instance.widthVw;
  const rotateDeg = isMobile && instance.mobile ? instance.mobile.rotateDeg : instance.rotateDeg;

  const combinedY = useTransform(
    [reactY, parallaxY],
    ([ry, py]) => (ry as number) + (py as number)
  );

  const combinedRot = useTransform(
    reactRot,
    (r) => r + rotateDeg
  );

  const style: CSSProperties = {
    position: "absolute",
    left: `${x}%`,
    top: `${y}%`,
    width: `${widthVw}vw`,
    maxWidth: isMobile ? "360px" : `${instance.maxWidthPx}px`,
    transform: "translate(-50%, -50%)",
    zIndex: 20,
  };

  if (reduced) {
    return (
      <div
        style={{
          ...style,
          opacity: instance.opacity,
          transform: `translate(-50%, -50%) rotate(${rotateDeg}deg)`,
        }}
      >
        <FlavourSvgImage flavour={flavour} />
      </div>
    );
  }

  return (
    <motion.div
      style={{
        ...style,
        opacity: opacityFade,
        x: reactX,
        y: combinedY,
        rotate: combinedRot,
      }}
      className="will-change-transform"
    >
      <FlavourSvgImage flavour={flavour} />
    </motion.div>
  );
}

/**
 * Renders the dedicated flavour SVG illustration with 100% transparent alpha.
 */
function FlavourSvgImage({ flavour }: { flavour: keyof typeof FLAVOUR_SVG_CONFIGS }) {
  const config = FLAVOUR_SVG_CONFIGS[flavour];

  return (
    <div className="relative aspect-3/2 w-full overflow-hidden select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(58,35,24,0.12)]">
      <Image
        src={config.svgSrc}
        alt={`Pandur ${config.name} Ingredients`}
        width={768}
        height={512}
        className="h-full w-full object-contain pointer-events-none select-none"
        priority={false}
      />
    </div>
  );
}
