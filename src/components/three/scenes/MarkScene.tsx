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
}: {
  interactive: boolean;
  seed?: number;
}) {
  return (
    <CookieStage
      className="pointer-events-none absolute inset-0 z-0"
      camera={{ position: [0, 0.5, 3.6], fov: 34 }}
    >
      <Lights />
      <StudioEnv />
      <ParallaxGroup enabled={interactive} maxTilt={8} idleSpeed={0.18}>
        {/*
         * Offset and small, deliberately. At full size and dead centre this
         * sat squarely behind the page title, and a headline set over the
         * middle of a cookie is just harder to read — the mark competed with
         * the words instead of supporting them. Pushed down and to the right,
         * it frames the title rather than sitting under it.
         */}
        <group
          position={[1.42, -1.0, 0]}
          rotation={[-1.02, 0, 0.16]}
          scale={0.56}
        >
          <Cookie quality="low" seed={seed} />
        </group>
      </ParallaxGroup>
    </CookieStage>
  );
}
