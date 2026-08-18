"use client";

import { useRef } from "react";
import * as THREE from "three";
import { MotionValue } from "motion/react";
import { useFrame } from "@react-three/fiber";
import CookieStage from "../CookieStage";
import Cookie from "../Cookie";
import { Lights, StudioEnv } from "../Rig";
import { FLAVOURS } from "@/lib/assets";

const N = FLAVOURS.length;

/**
 * Turns the biscuit from the scroll value. Reading the MotionValue inside
 * useFrame keeps this off React's render path — driving it through state would
 * re-render on every frame.
 *
 * This used to grade the material's colour per flavour as well, lerping a dough
 * tone and a chip tone across the four panels. That went when the surface
 * became the real product's photograph: all four Pandur flavours are the same
 * golden biscuit, and only the pack differs, so tinting the photo four ways
 * invented a difference that does not exist. The panels are told apart by their
 * ground colour, accent and ingredient mark instead.
 */
function ScrollTurnedCookie({
  progress,
  quality,
}: {
  progress: MotionValue<number>;
  quality: "high" | "low";
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1) * (N - 1);
    if (group.current) {
      group.current.rotation.y = p * ((Math.PI * 2) / (N - 1)) * 0.5;
      group.current.rotation.z = Math.sin(p * 1.4) * 0.08;
    }
  });

  return (
    <group ref={group} rotation={[-0.45, 0, 0.1]}>
      <Cookie quality={quality} />
    </group>
  );
}

export default function FlavourScene({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  return (
    <CookieStage
      className="pointer-events-none absolute inset-0 z-10"
      camera={{ position: [0, 0.6, 3.4], fov: 36 }}
    >
      <Lights />
      <StudioEnv />
      <ScrollTurnedCookie progress={progress} quality="high" />
    </CookieStage>
  );
}
