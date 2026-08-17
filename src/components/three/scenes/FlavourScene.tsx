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
 * Lerps the cookie's materials and rotation straight from the scroll value.
 * Reading the MotionValue inside useFrame keeps this off React's render path —
 * driving colour through state would re-render on every frame.
 */
function ScrollGradedCookie({
  progress,
  quality,
}: {
  progress: MotionValue<number>;
  quality: "high" | "low";
}) {
  const doughMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const chipMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const group = useRef<THREE.Group>(null);

  const cDough = useRef(new THREE.Color(FLAVOURS[0].dough));
  const cChip = useRef(new THREE.Color(FLAVOURS[0].chip));
  const tmpA = useRef(new THREE.Color());
  const tmpB = useRef(new THREE.Color());

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1) * (N - 1);
    const i = Math.min(N - 2, Math.floor(p));
    const f = THREE.MathUtils.clamp(p - i, 0, 1);

    tmpA.current.set(FLAVOURS[i].dough);
    tmpB.current.set(FLAVOURS[i + 1].dough);
    cDough.current.copy(tmpA.current).lerp(tmpB.current, f);

    tmpA.current.set(FLAVOURS[i].chip);
    tmpB.current.set(FLAVOURS[i + 1].chip);
    cChip.current.copy(tmpA.current).lerp(tmpB.current, f);

    doughMat.current?.color.copy(cDough.current);
    chipMat.current?.color.copy(cChip.current);

    if (group.current) {
      group.current.rotation.y = p * ((Math.PI * 2) / (N - 1)) * 0.5;
      group.current.rotation.z = Math.sin(p * 1.4) * 0.08;
    }
  });

  return (
    <group ref={group} rotation={[-0.45, 0, 0.1]}>
      <Cookie
        quality={quality}
        doughMatRef={doughMat}
        chipMatRef={chipMat}
        dough={FLAVOURS[0].dough}
        chip={FLAVOURS[0].chip}
      />
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
      <ScrollGradedCookie progress={progress} quality="high" />
    </CookieStage>
  );
}
