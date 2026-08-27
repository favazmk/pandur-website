"use client";

import { useRef, useEffect, useMemo } from "react";
import { useTransform, motion, type MotionValue } from "motion/react";
import {
  UAE_JOURNEY_MARKETS,
  DESKTOP_JOURNEY_PATH,
  MOBILE_JOURNEY_PATH,
  JOURNEY_PROGRESS_STOPS,
  DESKTOP_PATH_FRACTIONS,
  MOBILE_PATH_FRACTIONS,
} from "@/lib/uaeJourney";

export default function TravellingCookie({
  progress,
  isMobile = false,
}: {
  progress: MotionValue<number>;
  isMobile?: boolean;
}) {
  const gRef = useRef<SVGGElement>(null);
  const pathD = isMobile ? MOBILE_JOURNEY_PATH : DESKTOP_JOURNEY_PATH;

  // Create an offscreen SVG path element for getPointAtLength() measurements
  // This uses the EXACT same geometry as the drawn <path>, giving perfect sync
  const { measurePath, totalLength } = useMemo(() => {
    if (typeof document === "undefined") return { measurePath: null, totalLength: 1 };
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", pathD);
    return { measurePath: p, totalLength: p.getTotalLength() };
  }, [pathD]);

  // Map progress to precise non-linear path fractions to guarantee perfect alignment with the market nodes
  const pathFraction = useTransform(
    progress,
    JOURNEY_PROGRESS_STOPS,
    isMobile ? MOBILE_PATH_FRACTIONS : DESKTOP_PATH_FRACTIONS,
    { clamp: true }
  );

  useEffect(() => {
    const el = gRef.current;
    if (!el || !measurePath) return;

    const update = (fraction: number) => {
      const len = fraction * totalLength;

      // Position from arc length
      const point = measurePath.getPointAtLength(len);

      // Tangent angle from a tiny forward sample
      const delta = Math.min(2, totalLength - len);
      const next = measurePath.getPointAtLength(Math.min(len + delta, totalLength));
      const angle = Math.atan2(next.y - point.y, next.x - point.x) * (180 / Math.PI) - 90;

      el.setAttribute(
        "transform",
        `translate(${point.x}, ${point.y}) rotate(${angle})`
      );
    };

    // Set initial + listen for changes
    update(pathFraction.get());
    const unsub = pathFraction.on("change", update);
    return unsub;
  }, [pathFraction, measurePath, totalLength]);

  const cookieSize = isMobile ? 48 : 72;

  return (
    <g>
      {/* Dynamic Travelling Cookie — positioned via getPointAtLength for arc-length sync */}
      <g ref={gRef} className="pointer-events-none select-none">
        {/* Contact Shadow behind Cookie */}
        <ellipse
          cx="0"
          cy="8"
          rx={isMobile ? 18 : 26}
          ry={isMobile ? 8 : 12}
          fill="#221F1F"
          fillOpacity="0.28"
          filter="blur(4px)"
        />

        {/* High-res Pandur Cookie */}
        <image
          href="/products/gcc-cookie.png"
          x={-cookieSize / 2}
          y={-cookieSize / 2}
          width={cookieSize}
          height={cookieSize}
          style={{ filter: "drop-shadow(0 8px 16px rgba(58,35,24,0.22))" }}
        />
      </g>

      {/* Micro-Crumb Bursts at Market Waypoints */}
      {UAE_JOURNEY_MARKETS.map((m) => (
        <CrumbGroup
          key={m.id}
          coord={isMobile ? m.mobile : m.desktop}
          progress={progress}
          targetP={m.progress}
          isMobile={isMobile}
        />
      ))}
    </g>
  );
}

function CrumbGroup({
  coord,
  progress,
  targetP,
  isMobile,
}: {
  coord: { x: number; y: number };
  progress: MotionValue<number>;
  targetP: number;
  isMobile: boolean;
}) {
  const opacity = useTransform(
    progress,
    [targetP - 0.02, targetP, targetP + 0.035, targetP + 0.06],
    [0, 1, 0.8, 0],
    { clamp: true }
  );

  const spread = useTransform(
    progress,
    [targetP - 0.01, targetP + 0.04],
    [2, isMobile ? 14 : 20],
    { clamp: true }
  );

  return (
    <motion.g
      transform={`translate(${coord.x}, ${coord.y})`}
      style={{ opacity }}
      className="pointer-events-none select-none"
    >
      {/* 4 Tiny drifting golden crumbs */}
      <motion.circle r="1.8" fill="#E8C89A" style={{ cx: spread, cy: spread }} />
      <motion.circle
        r="1.4"
        fill="#C89A60"
        style={{
          cx: useTransform(spread, (v) => -v * 0.9),
          cy: useTransform(spread, (v) => v * 0.7),
        }}
      />
      <motion.circle
        r="1.6"
        fill="#E8C89A"
        style={{
          cx: useTransform(spread, (v) => v * 0.8),
          cy: useTransform(spread, (v) => -v * 0.9),
        }}
      />
      <motion.circle
        r="1.2"
        fill="#AA7A40"
        style={{
          cx: useTransform(spread, (v) => -v * 1.1),
          cy: useTransform(spread, (v) => -v * 0.6),
        }}
      />
    </motion.g>
  );
}
