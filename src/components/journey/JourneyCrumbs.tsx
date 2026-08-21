"use client";

import { useTransform, motion, type MotionValue } from "motion/react";
import { CRUMB_BURSTS, type CrumbBurst } from "@/lib/cookieJourney";

// Deterministic seed offsets for 6 micro-crumbs per burst
const PARTICLE_VECTORS = [
  { dx: -28, dy: -24, rot: 140, size: 4.5 },
  { dx: 32, dy: -20, rot: -180, size: 5 },
  { dx: -18, dy: 16, rot: 90, size: 3.5 },
  { dx: 26, dy: 18, rot: -120, size: 4 },
  { dx: -8, dy: -32, rot: 210, size: 3 },
  { dx: 14, dy: -28, rot: -80, size: 4.2 },
];

export default function JourneyCrumbs({
  progress,
  reduced = false,
}: {
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-28">
      {CRUMB_BURSTS.map((burst, bIdx) => (
        <BurstGroup
          key={`burst-${bIdx}-${burst.trigger}`}
          burst={burst}
          progress={progress}
        />
      ))}
    </div>
  );
}

function BurstGroup({
  burst,
  progress,
}: {
  burst: CrumbBurst;
  progress: MotionValue<number>;
}) {
  const { trigger, x, y, count } = burst;

  // Window where particles disperse and fade
  const activeWindow = useTransform(
    progress,
    [trigger - 0.005, trigger, trigger + 0.035, trigger + 0.045],
    [0, 1, 1, 0]
  );

  const dispersion = useTransform(
    progress,
    [trigger, trigger + 0.035],
    [0, 1],
    { clamp: true }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {PARTICLE_VECTORS.slice(0, count).map((vec, pIdx) => {
        return (
          <ParticleDot
            key={`p-${pIdx}`}
            vector={vec}
            opacity={activeWindow}
            dispersion={dispersion}
          />
        );
      })}
    </div>
  );
}

function ParticleDot({
  vector,
  opacity,
  dispersion,
}: {
  vector: (typeof PARTICLE_VECTORS)[0];
  opacity: MotionValue<number>;
  dispersion: MotionValue<number>;
}) {
  const x = useTransform(dispersion, [0, 1], [0, vector.dx]);
  const y = useTransform(dispersion, [0, 1], [0, vector.dy]);
  const rotate = useTransform(dispersion, [0, 1], [0, vector.rot]);
  const scale = useTransform(dispersion, [0, 1], [0.8, 0.4]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: `${vector.size}px`,
        height: `${vector.size}px`,
        opacity,
        x,
        y,
        rotate,
        scale,
      }}
      className="rounded-full bg-[#D49847] shadow-[0_1px_3px_rgba(58,35,24,0.3)]"
    />
  );
}
