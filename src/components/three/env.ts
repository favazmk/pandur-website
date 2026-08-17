import * as THREE from "three";

/**
 * Procedural studio environment — replaces an .hdr file entirely.
 *
 * A vertical gradient (warm key above, cool bounce below) painted to a canvas
 * and mapped equirectangularly. Warm top makes the dough read as baked; the
 * cool floor stops the underside going muddy.
 */
export function makeStudioEnv(
  top = "#FFE9C9",
  mid = "#FFFFFF",
  bottom = "#EAF0FF"
): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 256;
  const ctx = c.getContext("2d")!;

  const g = ctx.createLinearGradient(0, 0, 0, c.height);
  g.addColorStop(0, top);
  g.addColorStop(0.48, mid);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);

  // A soft bright patch stands in for a key softbox, giving the rim a highlight
  // to catch instead of a flat wash.
  const hot = ctx.createRadialGradient(18, 52, 2, 18, 52, 46);
  hot.addColorStop(0, "rgba(255,255,255,0.95)");
  hot.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hot;
  ctx.fillRect(0, 0, c.width, c.height);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
