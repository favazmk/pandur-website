<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working on Pandur

Brand site for Pandur, the cookie brand of Royal Quality Bakes LLC (Khorfakkan,
UAE). Next.js 16 App Router + Turbopack, Tailwind v4, Motion (`motion/react`),
Lenis for scroll. Static — every route prerenders.

## Read this before you trust the README

**The README's stack section is stale.** It describes a WebGL/React Three Fiber
experience with a procedural 3D cookie in `src/components/three/`. That is gone:
there is no `three`, `@react-three/*` or `three-bvh-csg` in `package.json` and no
`components/three/` directory. The hero is video and typography now. Everything
else in the README — the outstanding-client-items table, the pack-image
decision, the flavour system, the asset contract — is current and worth reading.

Fix the stale sections if you touch them; do not restore the 3D.

## Where the truth lives

Data and components are deliberately separated, and the split is the design:

| | |
|---|---|
| `src/lib/assets.ts` | the four flavours — names, notes, grounds, accents, pack facts |
| `src/lib/showcase.ts` | the flavour showcase's four scenes: pack shot, beauty shot, ground, wash, palette |
| `src/lib/showcaseProps.ts` | the ingredient props scattered behind the pack: crop boxes + per-breakpoint layout |
| `src/components/showcase/` | knows how a scene *animates*; knows nothing about which flavours exist |

Adding or recolouring a flavour is an edit in `lib/`, not in a component.

## Rules that are load-bearing

These are not style preferences. Each one was arrived at by hitting the failure.

- **Colour values were measured, not eyeballed.** Every `accent` in
  `lib/assets.ts` carries its contrast ratio against its own ground in a
  comment, and each clears WCAG AA. Recompute if you change one; do not adjust
  by eye.
- **The scroll path holds no React state.** The showcase runs on one
  `useScroll` MotionValue with everything composed off it, so a scroll frame
  writes transforms and opacities and never renders a component. Introducing
  state or a scroll listener there will cost frames.
- **One animation per element per transform.** `transform` is a single
  property: an idle CSS keyframe and a Motion value on the same element
  overwrite each other every frame. That is why props nest four deep
  (place → parallax → handover → float). Do not flatten it.
- **Reduced motion is decided in CSS, not from a hook.** `.showcase-track`'s
  height changes under `prefers-reduced-motion` in `globals.css`. Deciding it
  from JS would resize the section after hydration and drag the scroll position
  with it.
- **`HAS_PACK_IMAGES` is `false` by decision, not by omission.** The four pack
  files exist and are wired; they read as AI mockups and two carry visible
  errors, so procedural stand-ins render instead. README has the detail. Flip it
  only when real photography lands.

## The ingredient props are windows, not files

`public/ingredient/premium-flavour-props.webp` is one 1536×1024 sheet, four
768×512 quadrants, one per flavour. Every prop in `lib/showcaseProps.ts` is a
box in sheet pixels, shown by scaling the sheet behind a small element and
offsetting it (the CSS-sprite technique) — so the browser fetches and decodes
the artwork once however many props are on screen, and nothing is re-cut into
per-prop files.

If new artwork arrives, or you want to add a prop:

- Boxes were **measured off the sheet's own alpha channel** — labelled into
  connected regions, each region's bounding box taken, then every window scored
  on how much paint its border crosses. A straight cut through the piece next
  door is what gives a cropped sprite away. Do not hand-guess a box; measure it
  the same way. The generator script is not in the repo — ask, or rewrite it
  (numpy + scipy `ndimage.label` over the alpha, ~40 lines).
- `SHEET.width`/`height` and the quadrant origins are load-bearing; the crop
  maths is relative to them.
- If you re-encode the sheet, **the alpha channel must survive intact** — the
  whole technique rests on it. WebP q92 was verified bit-for-bit on alpha.
- A prop's drift direction is computed from its position (away from the stage
  centre, which is where the pack is), not stored. Move a prop and its exit
  moves with it.

## Verifying a change

The showcase is a pinned, scroll-driven section — it cannot be judged from a
static screenshot of the top of the page. To check it:

```bash
npm run dev
```

Then scroll into `#flavour-showcase`. Driving it from the console needs one
extra step: **after a programmatic `scrollTo`, dispatch a `resize` event.**
Motion caches the section's offsets, and Lenis owns the real scroll, so a
scripted jump otherwise leaves the progress value reading a stale position and
you will see the wrong flavour.

Before committing: `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Known non-issues

- A hydration mismatch on `fdprocessedid` in the Partner form's inputs comes
  from a form-filler **browser extension**, not from the code. Do not chase it.
- Git reports LF→CRLF warnings on Windows. Expected.
- The Vercel CLI is not installed locally; the project is linked (`.vercel/`)
  and deploys from the repo.
