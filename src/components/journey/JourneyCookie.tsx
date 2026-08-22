"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import {
  DESKTOP_WAYPOINTS,
  MOBILE_WAYPOINTS,
  type JourneyWaypoint,
} from "@/lib/cookieJourney";

/**
 * Helper to build array of inputs and outputs for useTransform
 */
function extractPath(waypoints: JourneyWaypoint[], key: keyof JourneyWaypoint) {
  const inputs = waypoints.map((w) => w.progress);
  const outputs = waypoints.map((w) => w[key]);
  return { inputs, outputs };
}

export default function JourneyCookie({
  progress,
  isMobile = false,
  reduced = false,
}: {
  progress: MotionValue<number>;
  isMobile?: boolean;
  reduced?: boolean;
}) {
  const waypoints = isMobile ? MOBILE_WAYPOINTS : DESKTOP_WAYPOINTS;

  const { inputs: pIn, outputs: xOut } = extractPath(waypoints, "x");
  const { outputs: yOut } = extractPath(waypoints, "y");
  const { outputs: rotOut } = extractPath(waypoints, "rotation");
  const { outputs: sxOut } = extractPath(waypoints, "scaleX");
  const { outputs: syOut } = extractPath(waypoints, "scaleY");
  const { outputs: tiltOut } = extractPath(waypoints, "tilt");
  const { outputs: shadowOut } = extractPath(waypoints, "shadowSpread");

  const x = useTransform(progress, pIn, xOut.map((val) => `${val}%`));
  const y = useTransform(progress, pIn, yOut.map((val) => `${val}%`));
  const rotate = useTransform(progress, pIn, rotOut as number[]);
  const scaleX = useTransform(progress, pIn, sxOut as number[]);
  const scaleY = useTransform(progress, pIn, syOut as number[]);
  const tilt = useTransform(progress, pIn, tiltOut as number[]);

  // Settle scale: cookie subtly decreases in size as it descends and settles onto the plate (gravity landing effect)
  const landingScale = useTransform(progress, [0, 0.78, 0.90, 0.96, 1.0], [1.0, 1.0, 0.88, 0.86, 0.85]);
  const finalScaleX = useTransform([scaleX, landingScale], ([sx, ls]) => (sx as number) * (ls as number));
  const finalScaleY = useTransform([scaleY, landingScale], ([sy, ls]) => (sy as number) * (ls as number));

  // Floor shadow: active along ramps and physics leaps, fades to 0 completely when touching down on the ceramic plate
  const shadowLandingFade = useTransform(progress, [0, 0.82, 0.88, 1.0], [1, 1, 0, 0]);
  const rawShadowOpacity = useTransform(progress, pIn, shadowOut.map((val) => (val as number) * 0.45));
  const shadowOpacity = useTransform([rawShadowOpacity, shadowLandingFade], ([raw, fade]) => (raw as number) * (fade as number));

  // Dynamic CSS drop shadow for the cookie itself. 
  // In air (shadowSpread = 0): floaty and wide. On plate (shadowSpread = 1): tight and dark contact shadow.
  const shadowSpread = useTransform(progress, pIn, shadowOut as number[]);
  const cookieShadowY = useTransform(shadowSpread, [0, 1], [12, 3]);
  const cookieShadowBlur = useTransform(shadowSpread, [0, 1], [28, 6]);
  const cookieShadowAlpha = useTransform(shadowSpread, [0, 1], [0.28, 0.5]);
  const cookieFilter = useTransform(
    [cookieShadowY, cookieShadowBlur, cookieShadowAlpha], 
    ([y, blur, a]) => `drop-shadow(0 ${y}px ${blur}px rgba(58,35,24,${a}))`
  );

  const shadowScale = useTransform(progress, pIn, shadowOut.map((val) => 0.6 + (val as number) * 0.4));
  const shadowBlur = useTransform(progress, pIn, shadowOut.map((val) => `${(1 - (val as number)) * 14 + 4}px`));
  const shadowFilter = useTransform(shadowBlur, (b) => `blur(${b})`);

  if (reduced) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 md:w-48 select-none">
        <Image
          src="/products/gcc-cookie.png"
          alt="Pandur Golden Baked Cookie"
          width={400}
          height={400}
          className="h-auto w-full drop-shadow-[0_12px_24px_rgba(58,35,24,0.3)]"
          priority
        />
      </div>
    );
  }

  return (
    <motion.div
      style={{ left: x, top: y }}
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-30 select-none will-change-transform"
    >
      {/* Dynamic Ground Contact Shadow (Disappears on ceramic plate landing) */}
      <motion.div
        style={{
          opacity: shadowOpacity,
          scaleX: shadowScale,
          filter: shadowFilter,
        }}
        className="pointer-events-none absolute -bottom-4 left-1/2 h-5 w-24 md:w-32 -translate-x-1/2 rounded-full bg-ink/70"
      />

      {/* Aerodynamic Tilt / Orientation Group */}
      <motion.div style={{ rotate: tilt }} className="will-change-transform">
        {/* Squash & Stretch Impact Deform Group with Gravity Landing Scale */}
        <motion.div
          style={{ scaleX: finalScaleX, scaleY: finalScaleY }}
          className="relative w-24 sm:w-32 md:w-44 lg:w-48 will-change-transform"
        >
          {/* Continuous Roll Rotation */}
          <motion.div style={{ rotate, filter: cookieFilter }} className="h-full w-full">
            <Image
              src="/products/gcc-cookie.png"
              alt="Pandur Golden Cookie"
              width={480}
              height={480}
              className="h-auto w-full"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
