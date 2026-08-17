import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { Noise, prng } from "@/lib/noise";

/**
 * Procedural chocolate-chip cookie.
 *
 * Built entirely in code — no .glb, no texture, no HDR. That is deliberate:
 * product photography has not been delivered, and a procedural hero subject is
 * what lets the build proceed without it.
 */

export type CookieBuild = {
  geometry: THREE.BufferGeometry;
  chips: ChipTransform[];
};

export type ChipTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

/** Cookie cross-section: flat-ish top, rounded rim, flat-ish base. */
const PROFILE: Array<[number, number]> = [
  [0.0, 0.15],
  [0.42, 0.148],
  [0.68, 0.14],
  [0.85, 0.126],
  [0.945, 0.096],
  [0.99, 0.05],
  [1.0, 0.0],
  [0.99, -0.05],
  [0.945, -0.096],
  [0.85, -0.126],
  [0.68, -0.14],
  [0.42, -0.148],
  [0.0, -0.15],
];

/** Where the bite is taken from. Shared with chip culling so chips vanish with it. */
export const BITE = {
  center: new THREE.Vector3(0.92, 0.06, -0.42),
  radius: 0.62,
};

function displace(
  geo: THREE.BufferGeometry,
  noise: Noise,
  octaves: number,
  rimAmp = 0.055,
  surfAmp = 0.014
) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const nor = geo.attributes.normal as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    n.fromBufferAttribute(nor, i);

    // 1. Irregular silhouette. Sampling on the unit circle makes the noise
    //    inherently periodic in theta, so the lathe seam cannot show.
    const r = Math.hypot(v.x, v.z);
    if (r > 1e-4) {
      const dx = v.x / r;
      const dz = v.z / r;
      const rim = noise.fbm(dx * 1.7, 0.5, dz * 1.7, 2);
      const scaled = r * (1 + rimAmp * rim);
      v.x = dx * scaled;
      v.z = dz * scaled;
    }

    // 2. Crumb texture, along the original normal.
    const bump = noise.fbm(v.x * 3.1, v.y * 3.1, v.z * 3.1, octaves);
    v.addScaledVector(n, bump * surfAmp);

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/** Best-candidate sampling — cheap blue noise, so chips never grid up. */
function scatterChips(
  seed: number,
  count: number,
  bitten: boolean
): ChipTransform[] {
  const rnd = prng(seed);
  const picked: Array<[number, number]> = [];

  const candidate = (): [number, number] => {
    // uniform over a disc, kept inside the rim
    const t = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * 0.78;
    return [Math.cos(t) * r, Math.sin(t) * r];
  };

  for (let i = 0; i < count; i++) {
    let best: [number, number] = candidate();
    let bestD = -1;
    for (let k = 0; k < 12; k++) {
      const c = candidate();
      let d = Infinity;
      for (const p of picked) {
        d = Math.min(d, (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2);
      }
      if (picked.length === 0) {
        best = c;
        break;
      }
      if (d > bestD) {
        bestD = d;
        best = c;
      }
    }
    picked.push(best);
  }

  return picked
    .map(([x, z]) => {
      const r = Math.hypot(x, z);
      // follow the profile down as we approach the rim
      const top = 0.15 - Math.pow(r / 1.0, 4) * 0.055;
      const scale = 0.05 + rnd() * 0.038;
      return {
        position: [x, top - scale * 0.34, z] as [number, number, number],
        rotation: [
          rnd() * Math.PI,
          rnd() * Math.PI,
          rnd() * Math.PI,
        ] as [number, number, number],
        scale,
      };
    })
    // A chip inside the bite volume would float in mid-air once the sphere is
    // subtracted — but only cull them when there IS a bite, or the whole cookie
    // ends up with a bare patch where the bite has not happened yet.
    .filter(
      (c) =>
        !bitten ||
        new THREE.Vector3(...c.position).distanceTo(BITE.center) >
          BITE.radius * 0.98
    );
}

export function buildCookie({
  seed = 7,
  segments = 128,
  octaves = 2,
  chipCount = 18,
  bitten = false,
}: {
  seed?: number;
  segments?: number;
  octaves?: number;
  chipCount?: number;
  bitten?: boolean;
} = {}): CookieBuild {
  const noise = new Noise(seed);

  const points = PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
  let geo: THREE.BufferGeometry = new THREE.LatheGeometry(
    points,
    segments,
    0,
    Math.PI * 2
  );

  // Weld the seam before displacing so normals stay continuous around it.
  geo = mergeVertices(geo, 1e-5);
  geo = displace(geo, noise, octaves);

  if (bitten) {
    const evaluator = new Evaluator();
    evaluator.useGroups = false;

    const base = new Brush(geo);
    base.updateMatrixWorld();

    // Cutter resolution drives most of the CSG cost; 24x16 is indistinguishable
    // on a bite this size and roughly halves the build time.
    const cutterGeo = new THREE.SphereGeometry(BITE.radius, 24, 16);
    const cutter = new Brush(cutterGeo);
    cutter.position.copy(BITE.center);
    cutter.updateMatrixWorld();

    const result = evaluator.evaluate(base, cutter, SUBTRACTION);
    const out = result.geometry.clone();
    out.computeVertexNormals();

    cutterGeo.dispose();
    geo.dispose();
    geo = out;
  }

  geo.computeBoundingSphere();

  return {
    geometry: geo,
    chips: scatterChips(seed * 31 + 5, chipCount, bitten),
  };
}
