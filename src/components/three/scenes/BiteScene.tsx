"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { MotionValue } from "motion/react";
import { useFrame } from "@react-three/fiber";
import CookieStage from "../CookieStage";
import Cookie from "../Cookie";
import { Lights, StudioEnv } from "../Rig";
import { BITE } from "../cookieGeometry";
import { prng } from "@/lib/noise";

/** The scroll point where the whole cookie becomes the bitten one. */
const BITE_AT = 0.42;
const CRUMBS = 26;

type Crumb = {
  dir: THREE.Vector3;
  spin: THREE.Vector3;
  dist: number;
  scale: number;
};

function makeCrumbs(): Crumb[] {
  const rnd = prng(91);
  return Array.from({ length: CRUMBS }, () => {
    // biased outward and upward, away from the bite
    const dir = new THREE.Vector3(
      0.35 + rnd() * 0.9,
      0.15 + rnd() * 0.8,
      -0.2 - rnd() * 0.8
    ).normalize();
    return {
      dir,
      spin: new THREE.Vector3(rnd() * 3, rnd() * 3, rnd() * 3),
      dist: 0.35 + rnd() * 1.5,
      scale: 0.02 + rnd() * 0.038,
    };
  });
}

/**
 * The signature moment. Everything is a pure function of scrollYProgress, so
 * scrolling back up genuinely reverses it rather than replaying.
 */
function BiteRig({
  progress,
  quality,
}: {
  progress: MotionValue<number>;
  quality: "high" | "low";
}) {
  const group = useRef<THREE.Group>(null);
  const wholeRef = useRef<THREE.Group>(null);
  const bittenRef = useRef<THREE.Group>(null);
  const crumbsRef = useRef<THREE.InstancedMesh>(null);

  const crumbs = useMemo(() => makeCrumbs(), []);
  const crumbGeo = useMemo(() => new THREE.TetrahedronGeometry(1, 0), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);

    // 1. rotate to face camera over the first 42%
    const turn = THREE.MathUtils.clamp(p / BITE_AT, 0, 1);
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(-0.9, 0, turn);
      group.current.rotation.x = THREE.MathUtils.lerp(-0.75, -0.15, turn);
      group.current.scale.setScalar(THREE.MathUtils.lerp(0.86, 1.12, turn));
    }

    // 2. swap whole -> bitten
    const bitten = p >= BITE_AT;
    if (wholeRef.current) wholeRef.current.visible = !bitten;
    if (bittenRef.current) bittenRef.current.visible = bitten;

    // 3. crumbs burst, then settle
    const burst = THREE.MathUtils.clamp((p - BITE_AT) / (1 - BITE_AT), 0, 1);
    const eased = 1 - Math.pow(1 - burst, 3);
    const im = crumbsRef.current;
    if (im) {
      im.visible = burst > 0.001;
      for (let i = 0; i < crumbs.length; i++) {
        const c = crumbs[i];
        const travel = c.dist * eased;
        dummy.position
          .copy(BITE.center)
          .addScaledVector(c.dir, travel)
          // a little gravity on the way out
          .setY(BITE.center.y + c.dir.y * travel - eased * eased * 0.55);
        dummy.rotation.set(
          c.spin.x * eased * 2,
          c.spin.y * eased * 2,
          c.spin.z * eased * 2
        );
        dummy.scale.setScalar(c.scale * (0.4 + 0.6 * Math.min(1, burst * 4)));
        dummy.updateMatrix();
        im.setMatrixAt(i, dummy.matrix);
      }
      im.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <group ref={wholeRef}>
        <Cookie quality={quality} />
      </group>
      <group ref={bittenRef} visible={false}>
        <Cookie quality={quality} bitten />
      </group>

      <instancedMesh
        ref={crumbsRef}
        args={[crumbGeo, undefined, CRUMBS]}
        visible={false}
      >
        <meshPhysicalMaterial color="#C89A6B" roughness={0.9} />
      </instancedMesh>
    </group>
  );
}

export default function BiteScene({
  progress,
  scrub,
  mobile,
}: {
  progress: MotionValue<number>;
  scrub: boolean;
  mobile: boolean;
}) {
  return (
    <CookieStage
      className="pointer-events-none absolute inset-0 z-0"
      camera={{ position: [0, 0.4, 3.2], fov: 36 }}
    >
      <Lights />
      <StudioEnv />
      {scrub ? (
        <BiteRig progress={progress} quality="high" />
      ) : (
        <group rotation={[-0.2, 0, 0.08]} scale={1.05}>
          <Cookie quality={mobile ? "low" : "high"} bitten />
        </group>
      )}
    </CookieStage>
  );
}
