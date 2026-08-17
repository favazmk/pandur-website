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

### The cookie is procedural

No `.glb`, no HDR, no textures. `src/components/three/cookieGeometry.ts` builds it:
a lathe profile with a periodic rim jitter, two octaves of noise displacement,
blue-noise-scattered chips, and a real CSG sphere subtraction for the bite.

This is deliberate — product photography was not available when the site was
built, and a procedural hero subject meant the build did not have to wait.

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

If you touch the palette, re-check every pairing including opacity-derived ones
(`/60`, `/70` variants composite against their backdrop and fail silently).

`prefers-reduced-motion` is honoured throughout: Lenis is disabled, scroll-scrubs
become static states, and no information lives only in motion.

---

## Outstanding — needed from the client

| # | Item | Where |
|---|---|---|
| 1 | **Four flavour names** — currently `FLAVOUR_01`–`04` | `src/lib/assets.ts` |
| 2 | **"Aman" → Ajman?** built as Ajman, needs sign-off | `src/lib/assets.ts` |
| 3 | **Product photography** — drop in, flip one flag, no layout shift | `src/lib/assets.ts` → `HAS_PRODUCT_IMAGES` |
| 4 | **Form destination** — forms validate but send nowhere | `src/components/forms/EnquiryForm.tsx` → `submitEnquiry()` |
| 5 | **Contact email + phone** — page correctly hides the block rather than faking it | `src/lib/nav.ts` → `COMPANY` |
| 6 | **Franchise commercial terms** — none published, by design | `src/app/franchises/page.tsx` |
| 7 | **Blog content** — the three posts are samples written from the brief; decide whether the client needs a CMS to self-publish | `src/content/blog.ts` |
| 8 | **Arabic / RTL?** — worth deciding before the layout hardens | — |

### Asset contract

Photography drops into `public/products/` and is switched on with a single flag:

```
flavour-01.png … flavour-04.png    transparent PNG, ≥2000px long edge,
pack-01.png    … pack-04.png       cookie centred, soft contact shadow
```

Every slot reserves its aspect ratio already, so nothing reflows when the flag flips.

---

`PANDUR-BUILD-PROMPT.md` holds the original build brief, including the reference-site
teardown the design direction came from.
