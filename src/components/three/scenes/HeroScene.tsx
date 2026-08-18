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
  /*
   * idleSpeed is raised well above the default here: the hero subject is the
   * one thing on the page that has to read as an object rather than a picture
   * of one, and it now turns whether or not the pointer moves.
   */
  const body = (
    <ParallaxGroup enabled={interactive} maxTilt={6} idleSpeed={0.3}>
      {/*
       * Dropped below the headline and tilted toward the camera. At the old
       * rotation it presented almost edge-on, which read as a beige smear
       * rather than a cookie, and at the old height it sat across the second
       * line of the headline.
       */}
      <group
        position={[0, mobile ? -0.95 : -1.15, 0]}
        rotation={[-1.0, 0, 0.12]}
        scale={mobile ? 0.66 : 0.82}
      >
        <Cookie quality={mobile ? "low" : "high"} />
      </group>
    </ParallaxGroup>
  );

  return (
    /*
     * BEHIND the headline, not in front of it.
     *
     * This sat at z-raised so the cookie would occlude the type the way the
     * reference site sits its product over its wordmark. At this size that
     * reads as a bug rather than as art — the cookie covered the middle of
     * "Our Signature Taste." and the headline was simply unreadable. The
     * subject is also smaller now and dropped below centre, so the type has
     * clear air and the cookie reads as the ground it sits on.
     */
    <CookieStage
      className="pointer-events-none absolute inset-0 z-scene"
      camera={{ position: [0, 0.75, 3.05], fov: 38 }}
    >
      <Lights />
      <StudioEnv />
      {progress ? <Dolly progress={progress}>{body}</Dolly> : body}
    </CookieStage>
  );
}
