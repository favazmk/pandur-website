"use client";

import { RefObject, useMemo } from "react";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import { buildCookie } from "./cookieGeometry";

export type Quality = "high" | "low";

export type CookieProps = {
  dough?: string;
  chip?: string;
  bitten?: boolean;
  quality?: Quality;
  seed?: number;
  /**
   * Optional handles on the materials so a parent can lerp colour inside
   * useFrame — driving colour through React state would re-render every frame.
   */
  doughMatRef?: RefObject<THREE.MeshPhysicalMaterial | null>;
  chipMatRef?: RefObject<THREE.MeshPhysicalMaterial | null>;
};

const SETTINGS: Record<Quality, { segments: number; octaves: number; chips: number }> =
  {
    high: { segments: 128, octaves: 2, chips: 18 },
    low: { segments: 64, octaves: 1, chips: 11 },
  };

/**
 * The cookie itself. Geometry is memoised per (seed, quality, bitten) — the CSG
 * bite is expensive enough that it must never rebuild on a colour change.
 */
export default function Cookie({
  dough = "#E8C89A",
  chip = "#3A2318",
  bitten = false,
  quality = "high",
  seed = 7,
  doughMatRef,
  chipMatRef,
}: CookieProps) {
  const cfg = SETTINGS[quality];

  const { geometry, chips } = useMemo(
    () =>
      buildCookie({
        seed,
        segments: cfg.segments,
        octaves: cfg.octaves,
        chipCount: cfg.chips,
        bitten,
      }),
    [seed, cfg.segments, cfg.octaves, cfg.chips, bitten]
  );

  const chipGeo = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={doughMatRef}
          color={dough}
          roughness={0.86}
          metalness={0}
          clearcoat={0}
          sheen={0.35}
          sheenRoughness={0.9}
          sheenColor={new THREE.Color("#FFD9A0")}
          flatShading={false}
        />
      </mesh>

      <Instances geometry={chipGeo} limit={24} range={chips.length}>
        <meshPhysicalMaterial
          ref={chipMatRef}
          color={chip}
          roughness={0.42}
          metalness={0}
          clearcoat={0.25}
          clearcoatRoughness={0.5}
        />
        {chips.map((c, i) => (
          <Instance
            key={i}
            position={c.position}
            rotation={c.rotation}
            scale={c.scale}
          />
        ))}
      </Instances>
    </group>
  );
}
