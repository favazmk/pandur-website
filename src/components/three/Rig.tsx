"use client";

import { ReactNode, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { makeStudioEnv } from "./env";

/** Warm key upper-left, soft fill right, cool rim behind for edge separation. */
export function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-4, 5.5, 3.5]}
        intensity={2.5}
        color="#FFEBCB"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[4.5, 1.5, 2]} intensity={0.75} color="#FFF6E8" />
      <directionalLight position={[0, 1, -5]} intensity={1.5} color="#CFE0FF" />
    </>
  );
}

export function StudioEnv() {
  const map = useMemo(() => makeStudioEnv(), []);
  useEffect(() => () => map.dispose(), [map]);
  return <Environment map={map} environmentIntensity={0.85} />;
}

/**
 * Pointer parallax. The cookie leans toward the cursor by up to ±6°, damped so
 * it settles rather than snapping. Falls back to pure idle rotation on touch.
 */
export function ParallaxGroup({
  children,
  maxTilt = 6,
  idleSpeed = 0.12,
  enabled = true,
}: {
  children: ReactNode;
  maxTilt?: number;
  idleSpeed?: number;
  enabled?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;

    const d = Math.min(delta, 0.05);

    if (enabled) {
      target.current.x = -pointer.y * THREE.MathUtils.degToRad(maxTilt);
      target.current.y = pointer.x * THREE.MathUtils.degToRad(maxTilt);
    }

    // critically-damped-ish follow
    g.rotation.x += (target.current.x - g.rotation.x) * Math.min(1, d * 4);

    if (enabled) {
      g.rotation.y += (target.current.y - g.rotation.y) * Math.min(1, d * 4);
    } else {
      g.rotation.y += d * idleSpeed;
    }
  });

  return <group ref={ref}>{children}</group>;
}

/** Slow continuous spin layered under whatever the parent is doing. */
export function Spin({
  children,
  speed = 0.14,
  active = true,
}: {
  children: ReactNode;
  speed?: number;
  active?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (active && ref.current) ref.current.rotation.y += Math.min(delta, 0.05) * speed;
  });
  return <group ref={ref}>{children}</group>;
}
