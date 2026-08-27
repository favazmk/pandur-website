"use client";

import { useTransform, motion, type MotionValue } from "motion/react";
import MarketMarker from "@/components/showcase/MarketMarker";
import MarketCookieMotif from "@/components/showcase/MarketCookieMotif";
import {
  MARKETS_DATA,
  UAE_LANDMASS_PATH,
  HAJAR_MOUNTAIN_PATH,
  HAJAR_MOUNTAIN_SUB_PATH,
  MARKET_ROUTE_PATH,
  type Market,
} from "@/lib/markets";

export default function UaeMap({
  progress,
  hoveredMarket,
  selectedMarket,
  onHoverMarket,
  onSelectMarket,
  reduced,
}: {
  progress: MotionValue<number>;
  hoveredMarket: Market | null;
  selectedMarket: Market | null;
  onHoverMarket: (m: Market | null) => void;
  onSelectMarket: (m: Market) => void;
  reduced: boolean;
}) {
  // Map reveal: scales and fades in during first 0–18% of the scroll timeline
  const mapOpacity = useTransform(progress, [0, 0.12], [0.4, 1], { clamp: true });
  const mapScale = useTransform(progress, [0, 0.15], [0.95, 1], { clamp: true });

  // Route drawing: starts at Sharjah (~0.12) and finishes at Fujairah (~0.90)
  const routeLength = useTransform(progress, [0.12, 0.88], [0, 1], { clamp: true });

  return (
    <div className="relative w-full max-w-2xl select-none">
      <motion.div
        style={reduced ? undefined : { opacity: mapOpacity, scale: mapScale }}
        className="relative aspect-760/580 w-full"
      >
        <svg
          viewBox="0 0 760 580"
          className="h-full w-full overflow-visible drop-shadow-[0_20px_45px_rgba(58,35,24,0.08)]"
          role="img"
          aria-label="Interactive Map of Northern Emirates and Pandur Markets"
        >
          <defs>
            {/* Soft terrain landmass gradient */}
            <linearGradient id="uaeTerrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5EEDA" />
              <stop offset="50%" stopColor="#EFE3C9" />
              <stop offset="100%" stopColor="#E5D6B6" />
            </linearGradient>

            {/* Coastline soft inner shadow */}
            <linearGradient id="waterCoastGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EAE2CC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EAE2CC" stopOpacity="0" />
            </linearGradient>

            {/* Route line glowing gradient */}
            <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5221F" />
              <stop offset="50%" stopColor="#8A5A2B" />
              <stop offset="100%" stopColor="#C5221F" />
            </linearGradient>

            {/* Depth filter for landmass elevation */}
            <filter id="landShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#3A2318" floodOpacity="0.08" />
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3A2318" floodOpacity="0.06" />
            </filter>
          </defs>

          {/* ================= WATER BODY LABELS ================= */}
          <text
            x="145"
            y="310"
            fontSize="10"
            fontWeight="800"
            letterSpacing="0.32em"
            fill="#8F857E"
            opacity="0.5"
            className="font-display uppercase select-none"
          >
            Arabian Gulf
          </text>
          <text
            x="575"
            y="250"
            fontSize="10"
            fontWeight="800"
            letterSpacing="0.32em"
            fill="#8F857E"
            opacity="0.5"
            className="font-display uppercase select-none"
          >
            Gulf of Oman
          </text>

          {/* ================= LANDMASS BASE SILHOUETTE ================= */}
          {/* Outer stroke glow */}
          <path
            d={UAE_LANDMASS_PATH}
            fill="none"
            stroke="#DCD0B6"
            strokeWidth={12}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.4}
          />

          {/* Main 3D Elevated Landmass */}
          <path
            d={UAE_LANDMASS_PATH}
            fill="url(#uaeTerrainGrad)"
            stroke="#D0C2A4"
            strokeWidth={1.8}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#landShadow)"
          />

          {/* ================= TOPOGRAPHIC CONTOURS ================= */}
          {/* Hajar Mountains Main Ridge */}
          <path
            d={HAJAR_MOUNTAIN_PATH}
            fill="none"
            stroke="#C0AF8C"
            strokeWidth={2.4}
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity={0.55}
          />
          {/* Hajar Mountains Secondary Ridge */}
          <path
            d={HAJAR_MOUNTAIN_SUB_PATH}
            fill="none"
            stroke="#C0AF8C"
            strokeWidth={1.6}
            strokeDasharray="4 4"
            strokeLinecap="round"
            opacity={0.4}
          />

          {/* Mountain Pass Annotation */}
          <text
            x="448"
            y="255"
            fontSize="7"
            fontWeight="700"
            letterSpacing="0.2em"
            fill="#9C8B6E"
            opacity="0.65"
            className="font-display uppercase select-none"
          >
            Hajar Range
          </text>

          {/* ================= ANIMATED CONNECTING ROUTE ================= */}
          {/* Route path backdrop shadow */}
          <motion.path
            d={MARKET_ROUTE_PATH}
            fill="none"
            stroke="#3A2318"
            strokeWidth={3}
            strokeOpacity={0.08}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={reduced ? { pathLength: 1 } : { pathLength: routeLength }}
          />

          {/* Animated Route Line */}
          <motion.path
            d={MARKET_ROUTE_PATH}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth={2.2}
            strokeDasharray="6 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={reduced ? { pathLength: 1 } : { pathLength: routeLength }}
          />

          {/* ================= 8 INTERACTIVE MARKET MARKERS ================= */}
          {MARKETS_DATA.map((m, i) => (
            <MarketMarker
              key={m.id}
              market={m}
              index={i}
              progress={progress}
              isHovered={hoveredMarket?.id === m.id}
              isSelected={selectedMarket?.id === m.id}
              onHover={onHoverMarket}
              onClick={onSelectMarket}
              reduced={reduced}
            />
          ))}

          {/* ================= TRAVELLING COOKIE MOTIF ================= */}
          <MarketCookieMotif progress={progress} reduced={reduced} />
        </svg>
      </motion.div>
    </div>
  );
}
