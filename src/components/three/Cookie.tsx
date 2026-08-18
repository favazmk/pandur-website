"use client";

import { RefObject, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { buildCookie } from "./cookieGeometry";

export type Quality = "high" | "low";

export type CookieProps = {
  /**
   * Optional tint multiplied over the photograph. Leave unset — the texture
   * already carries the product's real colour, and tinting it only makes the
   * biscuit look like something Pandur does not sell.
   */
  tint?: string;
  bitten?: boolean;
  quality?: Quality;
  seed?: number;
  /**
   * Handle on the material so a parent can drive it inside useFrame — going
   * through React state would re-render every frame.
   */
  matRef?: RefObject<THREE.MeshPhysicalMaterial | null>;
};

const SETTINGS: Record<Quality, { segments: number; octaves: number }> = {
  high: { segments: 128, octaves: 2 },
  low: { segments: 64, octaves: 1 },
};

/**
 * The biscuit. Geometry is memoised per (seed, quality, bitten) — the CSG bite
 * is expensive enough that it must never rebuild on a material change.
 *
 * The surface is the real product, photographed: `cookie-top.jpg` is the
 * albedo, projected top-down onto the mesh, and `cookie-bump.jpg` is its
 * luminance driving the crumb relief.
 */
export default function Cookie({
  tint = "#ffffff",
  bitten = false,
  quality = "high",
  seed = 7,
  matRef,
}: CookieProps) {
  const cfg = SETTINGS[quality];

  const { geometry } = useMemo(
    () =>
      buildCookie({
        seed,
        segments: cfg.segments,
        octaves: cfg.octaves,
        bitten,
      }),
    [seed, cfg.segments, cfg.octaves, bitten]
  );

  /*
   * Configured in useTexture's load callback, not in an effect. The textures
   * are shared, cached objects — setting them up once as they load is both the
   * idiomatic place and the only one that does not mutate a value React is
   * tracking as immutable.
   */
  const [map, bumpMap] = useTexture(
    ["/3d/cookie-top.jpg", "/3d/cookie-bump.jpg"],
    (loaded) => {
      const [albedo, bump] = Array.isArray(loaded) ? loaded : [loaded];

      /*
       * Colour space is not automatic. An albedo photograph is sRGB and must
       * say so or it renders washed out; a bump map is data rather than colour
       * and has to stay linear or the relief comes out wrong.
       */
      albedo.colorSpace = THREE.SRGBColorSpace;
      bump.colorSpace = THREE.NoColorSpace;

      /*
       * Clamp, never repeat. The UVs are a planar projection sized so the disc
       * fills the frame — anything landing outside should hold the flood ring
       * at the edge, not wrap round to the far side of the biscuit.
       */
      for (const t of [albedo, bump]) {
        t.wrapS = THREE.ClampToEdgeWrapping;
        t.wrapT = THREE.ClampToEdgeWrapping;
        t.anisotropy = 8;
      }
    }
  );

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        ref={matRef}
        map={map}
        bumpMap={bumpMap}
        /*
         * Pushed up because the albedo is de-lit: with the photograph's own
         * shading divided out, the relief is what has to make the crumb catch
         * the light, so it carries more of the surface than it otherwise would.
         */
        bumpScale={1.15}
        color={tint}
        roughness={0.82}
        metalness={0}
        clearcoat={0}
        sheen={0.22}
        sheenRoughness={0.9}
        sheenColor={new THREE.Color("#FFD9A0")}
        flatShading={false}
      />
    </mesh>
  );
}
