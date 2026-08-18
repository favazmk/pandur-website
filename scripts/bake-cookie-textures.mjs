/**
 * Bakes the 3D biscuit's textures from the supplied reference photography.
 *
 *   node scripts/bake-cookie-textures.mjs
 *
 * Input   reference/3d/cookie-4up-source.png   four views in one 2x2 collage:
 *                                              top / side / underside / three-quarter
 * Output  public/3d/cookie-top.jpg             albedo, projected top-down onto the mesh
 *         public/3d/cookie-bump.jpg            crumb relief, from the albedo's luminance
 *         reference/3d/raw-*.png               the four views, cut apart
 *         reference/3d/cookie-bottom.jpg       underside albedo, kept but not currently used
 *
 * Run this again if the photography is ever replaced. The numbers it prints —
 * the disc radius and the measured edge tone — are worth reading: the profile in
 * `src/components/three/cookieGeometry.ts` was derived from the same source, so
 * a new shoot with different proportions means that profile needs revisiting too.
 */
import sharp from "sharp";
import { mkdirSync } from "fs";

const SRC = "reference/3d/cookie-4up-source.png";
const QUAD = 627; // half of the 1254px source

/**
 * The textures carry a flood ring past the disc edge so the noise-displaced
 * silhouette never samples past the image and picks up the photograph's
 * background. Must stay in step with TEXTURE_HALF_WIDTH in cookieGeometry.ts.
 */
const BLEED = 1.1;
const OUT = 1024;
const R = OUT / 2 / BLEED; // disc radius in output px == mesh radius 1.0

mkdirSync("reference/3d", { recursive: true });
mkdirSync("public/3d", { recursive: true });

/** Cut the collage into its four views. */
async function slice() {
  const quads = { top: [0, 0], side: [QUAD, 0], bottom: [0, QUAD], threeq: [QUAD, QUAD] };
  for (const [name, [left, top]] of Object.entries(quads)) {
    await sharp(SRC)
      .extract({ left, top, width: QUAD, height: QUAD })
      .png()
      .toFile(`reference/3d/raw-${name}.png`);
  }
}

/**
 * Locate the biscuit in a view. The product is a saturated orange against a
 * desaturated near-white ground, so saturation separates them far more reliably
 * than brightness does.
 */
async function findDisc(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const on = (x, y) => {
    const i = (y * w + x) * ch;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    return Math.max(r, g, b) - Math.min(r, g, b) > 34 && Math.max(r, g, b) < 245;
  };
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!on(x, y)) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return {
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    rad: Math.max(maxX - minX, maxY - minY) / 2,
    bw: maxX - minX + 1,
    bh: maxY - minY + 1,
  };
}

/** Centre the disc in a square, then flood everything outside it. */
async function bake(src, name) {
  const d = await findDisc(src);
  const half = Math.round(d.rad * BLEED);

  // pad first, so a disc near the frame edge cannot make the crop run off
  const padded = await sharp(src)
    .extend({ top: half, bottom: half, left: half, right: half, background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const sq = await sharp(padded.data, {
    raw: {
      width: padded.info.width,
      height: padded.info.height,
      channels: padded.info.channels,
    },
  })
    .extract({ left: Math.round(d.cx), top: Math.round(d.cy), width: half * 2, height: half * 2 })
    .resize(OUT, OUT)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = Buffer.from(sq.data);
  const ch = sq.info.channels;

  // the real edge tone, averaged over the outer few percent of the disc
  let sr = 0, sg = 0, sb = 0, n = 0;
  for (let y = 0; y < OUT; y++) {
    for (let x = 0; x < OUT; x++) {
      const dist = Math.hypot(x - OUT / 2, y - OUT / 2);
      if (dist <= R * 0.9 || dist >= R * 0.985) continue;
      const i = (y * OUT + x) * ch;
      sr += px[i]; sg += px[i + 1]; sb += px[i + 2]; n++;
    }
  }
  const rim = [sr / n, sg / n, sb / n].map((v) => Math.round(v));

  /*
   * Flood must be COMPLETE before the disc edge at R, where the photograph's
   * background begins. Feathering past R leaves a pale halo ring bleeding
   * through, which then shows up as a bright fringe on the rendered rim.
   */
  for (let y = 0; y < OUT; y++) {
    for (let x = 0; x < OUT; x++) {
      const dist = Math.hypot(x - OUT / 2, y - OUT / 2);
      if (dist <= R * 0.93) continue;
      const t = Math.min(1, (dist - R * 0.93) / (R * 0.06));
      const i = (y * OUT + x) * ch;
      px[i] = Math.round(px[i] * (1 - t) + rim[0] * t);
      px[i + 1] = Math.round(px[i + 1] * (1 - t) + rim[1] * t);
      px[i + 2] = Math.round(px[i + 2] * (1 - t) + rim[2] * t);
    }
  }

  const out = name === "cookie-bottom" ? `reference/3d/${name}.jpg` : `public/3d/${name}.jpg`;
  await sharp(px, { raw: { width: OUT, height: OUT, channels: ch } })
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toFile(out);
  console.log(`${out}   disc r=${d.rad.toFixed(0)}px   edge tone rgb(${rim.join(",")})`);
  return out;
}

/** Report the side view's proportions — this is where PROFILE came from. */
async function measureSide() {
  const d = await findDisc("reference/3d/raw-side.png");
  console.log(
    `\nside view silhouette ${d.bw}x${d.bh}px -> height/diameter ${(d.bh / d.bw).toFixed(4)}`
  );
  console.log(
    "  shot slightly from above, so that figure includes some of the top face;\n" +
      "  PROFILE in cookieGeometry.ts settles at 0.195 thickness/diameter."
  );
}

await slice();
const top = await bake("reference/3d/raw-top.png", "cookie-top");
await bake("reference/3d/raw-bottom.png", "cookie-bottom");

await sharp(top)
  .greyscale()
  .normalise()
  .blur(1.0)
  .linear(1.2, -20)
  .jpeg({ quality: 86 })
  .toFile("public/3d/cookie-bump.jpg");
console.log("public/3d/cookie-bump.jpg");

await measureSide();
