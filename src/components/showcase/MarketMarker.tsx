"use client";

import { useTransform, motion, type MotionValue } from "motion/react";
import { type Market, MARKET_SCROLL_STOPS } from "@/lib/markets";

export default function MarketMarker({
  market,
  index,
  progress,
  isHovered,
  isSelected,
  onHover,
  onClick,
  reduced,
}: {
  market: Market;
  index: number;
  progress: MotionValue<number>;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (m: Market | null) => void;
  onClick: (m: Market) => void;
  reduced: boolean;
}) {
  const stop = MARKET_SCROLL_STOPS[index];

  // Motion values driven strictly by scroll progress: 0 React re-renders on scroll
  const scale = useTransform(
    progress,
    [stop.in - 0.06, stop.in, stop.active],
    [0.5, 0.8, 1],
    { clamp: true }
  );

  const opacity = useTransform(
    progress,
    [Math.max(0, stop.in - 0.05), stop.in],
    [0.15, 1],
    { clamp: true }
  );

  const ringScale = useTransform(
    progress,
    [stop.in, stop.active, Math.min(1, stop.active + 0.08)],
    [0.8, 2.2, 1.3],
    { clamp: true }
  );

  const ringOpacity = useTransform(
    progress,
    [stop.in, stop.active, Math.min(1, stop.active + 0.08)],
    [0, 0.75, 0.25],
    { clamp: true }
  );

  const active = isHovered || isSelected;

  return (
    <g
      className="cursor-pointer transition-all duration-300"
      onPointerEnter={() => onHover(market)}
      onPointerLeave={() => onHover(null)}
      onClick={() => onClick(market)}
      role="button"
      tabIndex={0}
      aria-label={`Market ${market.orderStr}: ${market.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(market);
        }
      }}
    >
      {/* Outer pulse / activation halo */}
      <motion.circle
        cx={market.x}
        cy={market.y}
        r={14}
        fill={market.accent}
        style={
          reduced
            ? { opacity: active ? 0.35 : 0.15, scale: active ? 1.4 : 1 }
            : {
                opacity: active ? 0.5 : ringOpacity,
                scale: active ? 1.5 : ringScale,
                transformOrigin: `${market.x}px ${market.y}px`,
              }
        }
      />

      {/* Ripple ring for active highlight */}
      <motion.circle
        cx={market.x}
        cy={market.y}
        r={9}
        fill="none"
        stroke={market.accent}
        strokeWidth={1.2}
        style={
          reduced
            ? { opacity: active ? 0.9 : 0.3 }
            : {
                opacity,
                scale: active ? 1.3 : 1,
                transformOrigin: `${market.x}px ${market.y}px`,
              }
        }
      />

      {/* Main marker core pin */}
      <motion.circle
        cx={market.x}
        cy={market.y}
        r={active ? 5.5 : 4.2}
        fill={active ? market.accent : "#221F1F"}
        stroke="#FFFFFF"
        strokeWidth={1.5}
        className="transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        style={
          reduced
            ? undefined
            : {
                scale,
                opacity,
                transformOrigin: `${market.x}px ${market.y}px`,
              }
        }
      />

      {/* Marker Center Accent Dot */}
      <motion.circle
        cx={market.x}
        cy={market.y}
        r={1.8}
        fill="#FFFFFF"
        style={
          reduced
            ? undefined
            : {
                opacity,
                transformOrigin: `${market.x}px ${market.y}px`,
              }
        }
      />

      {/* Market Label on Map */}
      <motion.g
        style={
          reduced
            ? undefined
            : {
                opacity,
                transformOrigin: `${market.x}px ${market.y}px`,
              }
        }
      >
        <rect
          x={market.x + 8}
          y={market.y - 12}
          width={market.name.length * 6.5 + 24}
          height={18}
          rx={9}
          fill={active ? market.accent : "rgba(255, 255, 255, 0.92)"}
          stroke={active ? "none" : "rgba(34, 31, 31, 0.12)"}
          strokeWidth={0.8}
          className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-colors duration-200"
        />
        <text
          x={market.x + 14}
          y={market.y - 1}
          fontSize={8.5}
          fontWeight="800"
          letterSpacing="0.04em"
          fill={active ? "#FFFFFF" : "#221F1F"}
          className="select-none font-display uppercase tracking-wider"
        >
          <tspan fill={active ? "rgba(255,255,255,0.75)" : market.accent} fontWeight="900">
            {market.orderStr}
          </tspan>{" "}
          {market.name}
        </text>
      </motion.g>
    </g>
  );
}
