# Pandur

Brand site for **Pandur** — the signature cookie brand of Royal Quality Bakes LLC, Zubara, Khorfakkan, UAE.

A WebGL-driven brand experience where the cookie is a real 3D object that lives inside the scroll. Typography-led, motion throughout, deliberately light on body copy.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

> In dev, the first visit to each route takes 2–3s while Next compiles it on
> demand. That is not a bug and does not happen in production — every route
> prerenders to static HTML. To judge real performance:
>
> ```bash
> npm run build && npx next start
> ```

Other scripts:

```bash
npm run build        # production build
npm run lint         # eslint
npx tsc --noEmit     # typecheck
```

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Styling | Tailwind v4, tokens in `src/app/globals.css` |
| 3D | React Three Fiber + drei, `three-bvh-csg` for the bite |
| Motion | Motion (`motion/react`) |
| Scroll | Lenis |

---

## Structure

```
src/
  app/                    routes — /, /about, /products, /franchises, /blog, /contact
  components/
    brand/                logo lockup + monoline cookie marks
    forms/EnquiryForm     the one form used by every page
    layout/               SiteHeader, PageHero
    motion/               SplitLine, Marquee, Magnetic, Counter
    sections/             home-page sections, reused across pages
    three/                canvas stage, rig, procedural cookie
      scenes/             dynamically imported — keeps three.js out of first load
  content/blog.ts         file-based blog posts
  lib/                    tokens, noise, media queries, nav + company facts
```

### The cookie is procedural, and now textured from the real product

No `.glb` and no HDR. `src/components/three/cookieGeometry.ts` builds the mesh:
a lathe of the measured cross-section, a periodic rim jitter, two octaves of
noise displacement, and a real CSG sphere subtraction for the bite.

What changed is the surface. Four reference views were supplied — top, side,
underside and three-quarter — and they now drive it:

- **`cookie-top.jpg`** is the albedo, projected **top-down** onto the mesh.
  LatheGeometry's own UVs run around the circumference, which would smear a
  photograph of the face into concentric rings, so `planarUVs()` replaces them
  with an x/z projection.
- **`cookie-bump.jpg`** is that image's luminance, driving the crumb relief. The
  geometric displacement was softened to suit (`surfAmp` 0.014 → 0.009), because
  the bump map now carries the fine detail and the mesh only has to supply the
  coarse lumpiness the silhouette needs.
- The **profile** came off the side view. The real biscuit is not symmetric: the
  top is domed, the underside is flat where it sat on the tray, and the widest
  point of the rim sits below the midline. Thickness lands at 0.194 of the
  diameter.

Regenerate the textures with:

```bash
node scripts/bake-cookie-textures.mjs
```

The source collage is committed at `reference/3d/cookie-4up-source.png`; the
intermediates it produces are gitignored. The textures carry a flood ring past
the disc edge (`BLEED`, matched by `TEXTURE_HALF_WIDTH` in the geometry) so the
noise-displaced silhouette — which reaches radius 1.03 — never samples past the
image and picks up the photograph's background.

**It is no longer a chocolate-chip cookie.** It never should have been: the real
Pandur biscuit has no inclusions at all. The chip scatter, the chip material and
the per-flavour `dough`/`chip` colours are all gone, along with the flavour
scrub's colour grading — all four flavours are the same golden biscuit, and
tinting a photograph of it four different ways invented a difference that does
not exist. The panels are told apart by ground, accent and ingredient mark.

### Motion tokens

Easings in `src/lib/motion.ts` are measured from the reference site rather than
guessed. Keep `pop` and `expo` as-is; they are what the whole site is timed to.

---

## Accessibility

Contrast was computed, not eyeballed. The brand red `#EC2126` is **4.03:1** on
cream — fine for large display type (needs 3:1) but under the 4.5:1 AA floor for
small text. Hence two reds:

- `--color-red` `#EC2126` — large display type, fills, graphics
- `--color-red-deep` `#CE1419` — small text, and the marquee band behind white text

Each flavour also carries its own accent, sampled from that flavour's packaging
and then deepened until it cleared 4.5:1 on its own ground — the measured ratio
is recorded beside every value in `src/lib/assets.ts`.

Muted small text sits at `text-ink/65` and no lighter, exported as `MUTED`. Below
that it drops under 4.5:1 on the lightest flavour ground, which is invisible in
review because the composite still looks like ordinary legible grey.

If you touch the palette, re-check every pairing including opacity-derived ones
(`/60`, `/70` variants composite against their backdrop and fail silently). Note
that Tailwind v4 emits `oklab()`, so a checker that parses `getComputedStyle`
colours as `rgb()` will read the lightness as a red channel and report confident
nonsense — resolve colours through a canvas instead.

`prefers-reduced-motion` is honoured throughout: Lenis is disabled, scroll-scrubs
become static states, and no information lives only in motion.

---

## Outstanding — needed from the client

| # | Item | Where |
|---|---|---|
| 1 | **Packaging Arabic looks wrong** — not a site issue any more (the site carries no Arabic), but worth raising: the supplied artwork shows coconut's Arabic line on the peanut pack, misspelt. Check a physical carton before the next print run | client-side |
| 2 | **"Aman" → Ajman?** built as Ajman, needs sign-off | `src/lib/assets.ts` |
| 3 | **The four pack images look like renders, not photographs** — and two carry visible errors. Decide whether to re-shoot before launch. Detail below | `public/products/pack-*.jpg` |
| 4 | **Form destination** — forms validate but send nowhere | `src/components/forms/EnquiryForm.tsx` → `submitEnquiry()` |
| 5 | **Contact email + phone** — page correctly hides the block rather than faking it | `src/lib/nav.ts` → `COMPANY` |
| 6 | **Franchise commercial terms** — none published, by design | `src/app/franchises/page.tsx` |
| 7 | **Blog content** — the three posts are samples written from the brief; decide whether the client needs a CMS to self-publish | `src/content/blog.ts` |
| 8 | **Arabic / RTL?** — the site is English-only by decision. Worth settling before the layout hardens | — |

**Closed by the delivered photography:** the four flavour names (Butter, Coconut,
Peanut, Cardamom), the per-flavour palette — now sampled from the actual packaging
rather than invented — and the pack facts printed on the box (16 pieces, Made in
UAE, Premium Quality seal).

### The pack images need a decision before launch

All six files are in and switched on. The two retail shots are genuine store
photography — 4032×3024, straight off a camera, and they look it.

The four pack images are a different matter. Enlarging the fine print shows text
that no print run would produce:

- **`pack-peanut.jpg`** — the round quality seal reads **“SOEMIMS GOAUTT”** where
  it should read “PREMIUM QUALITY”, and the ring of text around it is not words.
- **`pack-peanut.jpg`** — the Arabic line reads **كوكوتات كوكيز**, which is
  coconut’s line sitting on the peanut box.
- **`pack-coconut.jpg`** — same Arabic line, and it misspells the
  transliteration too: ت where ن belongs.
- Butter and cardamom render “PREMIUM QUALITY” correctly, so the fault is not
  uniform across the set.

Add the non-uniform aspect ratios (0.750, 0.848, 0.854, 0.862 — a real shoot is
consistent) and a 896px width, and these read as generated mockups rather than
photographs of the product.

So `HAS_PACK_IMAGES` is **off**, by decision rather than by omission — the files
are present and wired, and the procedural stand-ins render instead. They look
deliberate and assert nothing false. Set the flag to `true` once real packaging
photography exists; no other change is needed.

`HAS_RETAIL_IMAGES` is **on** — that pair is genuine.

### How the four flavours are told apart

With the pack photography switched off, the flavour cards would otherwise be
four identical cookie doodles. Each flavour instead carries three things, all
defined together in `FLAVOURS`:

| | Butter | Coconut | Peanut | Cardamom |
|---|---|---|---|---|
| Ground | `#F4F1E2` | `#F3EADD` | `#F8EFDB` | `#EBF1E8` |
| Accent | `#4F5A2B` | `#7A4A22` | `#8A4A16` | `#0E5C3F` |
| Mark | butter block | coconut half | peanut shell | cardamom pod |

The marks live in `src/components/brand/Ingredients.tsx`, drawn in the same
monoline language as the cookie marks — stroked paths on a 200x200 viewBox
taking `currentColor`, so each renders in its flavour's accent. Their
silhouettes are deliberately unlike one another (block, ring, waisted shell,
pointed pod) so they stay distinguishable at the small sizes where interior
detail disappears first.

Every accent was checked against every ground it actually appears on — its own,
`cream` and `cream-deep` — and clears AA for small text in all twelve pairings,
worst case 5.69:1.

### Asset contract

Photography drops into `public/products/` under these exact names, then the
matching flag in `src/lib/assets.ts` flips. The two sets are independent, so
either can go live without the other.

```
pack-butter.jpg  pack-coconut.jpg      portrait 3:4, ≥1600px long edge, JPEG
pack-peanut.jpg  pack-cardamom.jpg     box left of centre, props to its right
    → HAS_PACK_IMAGES

retail-shelf.jpg   the gondola end, boxes facing
retail-aisle.jpg   the wider aisle view
                                       landscape 4:3, ≥2000px long edge, JPEG
    → HAS_RETAIL_IMAGES
```

Lowercase `.jpg`, no spaces. The originals arrived as `butter.JPG` and
`retail 1.JPG`; uppercase extensions 404 on a case-sensitive host even when they
work on Windows, and spaces force URL encoding. Both were renamed.

What landed against that spec: the retail pair is exactly on it. The pack images
are 896px wide rather than ≥1600, and only butter is on 3:4 — the other three get
centre-cropped ~6% per side, which was checked image by image and takes
background props rather than the box.

These are photographs on styled sets, not cut-outs — there is no transparency to
preserve, so JPEG rather than PNG, and slots `object-cover` rather than
`object-contain`. Every slot already reserves its aspect ratio, so nothing
reflows when a flag flips; but if the delivered ratio ever changes, change the
slot's `aspect` prop with it rather than letting the image be centre-cropped.

---

`PANDUR-BUILD-PROMPT.md` holds the original build brief, including the reference-site
teardown the design direction came from.
