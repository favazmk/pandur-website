"use client";

import CookieStage from "../CookieStage";
import Cookie from "../Cookie";
import { Lights, ParallaxGroup, StudioEnv } from "../Rig";

/**
 * Small 3D mark for interior page headers — a slowly turning cookie sitting
 * behind the title. Lower geometry than the home hero: it is decoration here,
 * not the subject.
 */
export default function MarkScene({
  interactive,
  seed = 7,
  dough,
  chip,
}: {
  interactive: boolean;
  seed?: number;
  dough?: string;
  chip?: string;
}) {
  return (
    <CookieStage
      className="pointer-events-none absolute inset-0 z-0"
      camera={{ position: [0, 0.5, 3.6], fov: 34 }}
    >
      <Lights />
      <StudioEnv />
      <ParallaxGroup enabled={interactive} maxTilt={8} idleSpeed={0.18}>
        <group rotation={[-0.5, 0, 0.16]} scale={0.92}>
          <Cookie quality="low" seed={seed} dough={dough} chip={chip} />
        </group>
      </ParallaxGroup>
    </CookieStage>
  );
}
