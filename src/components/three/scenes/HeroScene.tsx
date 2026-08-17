"use client";

import { useRef } from "react";
import * as THREE from "three";
import { MotionValue } from "motion/react";
import { useFrame } from "@react-three/fiber";
import CookieStage from "../CookieStage";
import Cookie from "../Cookie";
import { Lights, ParallaxGroup, StudioEnv } from "../Rig";

/**
 * Everything three-related for the hero lives behind this module boundary so
 * `next/dynamic` can split it out of the first load.
 */

/**
 * Scroll dolly. As the hero scrolls away the cookie pushes back into the
 * scene, tips over and spins up — so leaving the hero is a 3D move rather than
 * the section simply sliding off.
 */
function Dolly({
  progress,
  children,
}: {
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
    g.position.z = -p * 2.6;
    g.position.y = -p * 0.35;
    g.rotation.x = p * 0.9;
    g.rotation.z = p * 0.5;
    g.scale.setScalar(1 - p * 0.25);
  });

  return <group ref={ref}>{children}</group>;
}

export default function HeroScene({
  mobile,
  interactive,
  progress,
}: {
  mobile: boolean;
  interactive: boolean;
  progress?: MotionValue<number>;
}) {
  const body = (
    <ParallaxGroup enabled={interactive} maxTilt={6}>
      <group rotation={[-0.42, 0, 0.12]} scale={mobile ? 0.92 : 1.12}>
        <Cookie quality={mobile ? "low" : "high"} />
      </group>
    </ParallaxGroup>
  );

  return (
    /*
     * z-20 puts the cookie IN FRONT of the headline so it occludes the type,
     * the way the reference site sits its product over its wordmark. The canvas
     * is transparent and pointer-events-none, so only the cookie's own pixels
     * cover anything and the text stays selectable underneath.
     */
    <CookieStage
      className="pointer-events-none absolute inset-0 z-20"
      camera={{ position: [0, 0.75, 3.05], fov: 38 }}
    >
      <Lights />
      <StudioEnv />
      {progress ? <Dolly progress={progress}>{body}</Dolly> : body}
    </CookieStage>
  );
}
