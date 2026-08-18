import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { Noise } from "@/lib/noise";

/**
 * The Pandur biscuit, built from the reference photography in `public/3d/`.
 *
 * Geometry is still procedural — a lathe of the measured cross-section plus
 * noise — but the surface is now the real product's photograph rather than a
 * flat dough colour. Four views were supplied (top, side, underside, three
 * quarter); the side view gave the profile below and the top view is the
 * albedo and bump map.
 *
 * It is no longer a chocolate-chip cookie. It never should have been: the real
 * product has no inclusions at all, it is a plain crumb biscuit, so the chip
 * scatter that used to live here misrepresented what Pandur actually sells.
 */

export type CookieBuild = {
  geometry: THREE.BufferGeometry;
};

/**
 * Cross-section measured from `raw-side.png`.
 *
 * The real biscuit is NOT symmetric, which the previous invented profile
 * assumed: the top is domed, the underside is flat where it sat on the tray,
 * and the widest point of the rim sits just below the midline. Thickness works
 * out at 0.195 of the diameter — the photograph reads thicker than that, but
 * it was shot slightly from above so the visible height includes some of the
 * top face.
 *
 * Order runs top-centre, out over the dome, around the rim, then back along
 * the base to bottom-centre, which is what LatheGeometry needs to close.
 */
const PROFILE: Array<[number, number]> = [
  [0.0, 0.225],
  [0.3, 0.219],
  [0.55, 0.204],
  [0.72, 0.186],
  [0.85, 0.161],
  [0.93, 0.129],
  [0.975, 0.09],
  [1.0, 0.038],
  [1.005, -0.022],
  [0.99, -0.078],
  [0.958, -0.122],
  [0.9, -0.148],
  [0.8, -0.158],
  [0.55, -0.162],
  [0.28, -0.164],
  [0.0, -0.165],
];

/**
 * Half-width of the baked textures in mesh radius units.
 *
 * The textures carry a flood ring past the disc edge (BLEED in the bake
 * script) so the noise-displaced silhouette, which reaches about 1.06, never
 * samples past the image and picks up the photograph's background.
 */
const TEXTURE_HALF_WIDTH = 1.1;

/** Where the bite is taken from. */
export const BITE = {
  center: new THREE.Vector3(0.92, 0.06, -0.42),
  radius: 0.62,
};

function displace(
  geo: THREE.BufferGeometry,
  noise: Noise,
  octaves: number,
  rimAmp = 0.055,
  // Gentler than it was. The bump map carries the fine crumb now, so this only
  // has to supply the coarse lumpiness the silhouette needs.
  surfAmp = 0.009
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

/**
 * Replace the lathe's UVs with a top-down planar projection.
 *
 * LatheGeometry lays u around the circumference and v along the profile, which
 * is right for a wrapped label and wrong for a photograph of the face: the top
 * view would smear into concentric rings. Projecting from x/z instead lands the
 * photo on the biscuit the way the camera saw it.
 *
 * The rim and the underside receive the same projection, so they sample the
 * outer ring of the texture — the flood colour baked from the real edge tone.
 * That reads correctly because the rim genuinely is that colour; only the fine
 * crumb of the underside is lost, and the underside is barely on camera.
 */
function planarUVs(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = new Float32Array(pos.count * 2);
  const s = 0.5 / TEXTURE_HALF_WIDTH;

  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = 0.5 + pos.getX(i) * s;
    // negated so the projection is not mirrored against the source photograph
    uv[i * 2 + 1] = 0.5 - pos.getZ(i) * s;
  }

  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}

export function buildCookie({
  seed = 7,
  segments = 128,
  octaves = 2,
  bitten = false,
}: {
  seed?: number;
  segments?: number;
  octaves?: number;
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
  geo = planarUVs(geo);

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

  return { geometry: geo };
}
