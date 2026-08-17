"use client";

import CookieStage from "../CookieStage";
import Cookie from "../Cookie";
import { Lights, ParallaxGroup, StudioEnv } from "../Rig";

/**
 * Everything three-related for the hero lives behind this module boundary so
 * `next/dynamic` can split it out of the first load.
 */
export default function HeroScene({
  mobile,
  interactive,
}: {
  mobile: boolean;
  interactive: boolean;
}) {
  return (
    <CookieStage
      className="pointer-events-none absolute inset-0 z-0"
      camera={{ position: [0, 0.75, 3.05], fov: 38 }}
    >
      <Lights />
      <StudioEnv />
      <ParallaxGroup enabled={interactive} maxTilt={6}>
        <group rotation={[-0.42, 0, 0.12]} scale={mobile ? 1.05 : 1.35}>
          <Cookie quality={mobile ? "low" : "high"} />
        </group>
      </ParallaxGroup>
    </CookieStage>
  );
}
