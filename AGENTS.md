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

The README once described a WebGL/React Three Fiber experience with a procedural
3D cookie in `src/components/three/`. **That has been corrected** — the README's
stack section is now accurate, and the hero is video and typography. There is no
`three`, `@react-three/*` or `three-bvh-csg` in `package.json` and no
`components/three/` directory. Do not restore the 3D.

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
- **Trig that reaches a style attribute goes through `polar()`.** `Math.sin`
  and `Math.cos` are not required to be correctly rounded, and Node and Chrome
  really do differ in the last bit — `sin(240°)` served `-0.8660254037844385`
  and hydrated `-0.8660254037844384`. Interpolated into an SSR'd `style`
  string that is a hydration mismatch on every page load. `polar()` in
  `lib/motion.ts` rounds to 6dp, which is identical on both engines and far
  below a device pixel. Plain arithmetic downstream is safe: IEEE-754 `*`, `/`
  and `Number→String` are exactly specified. Only the trig call needs fixing.
- **Radial layouts size from a CSS length, not a pixel constant.** The
  shelf-life dial (`--dial-r`) and the quality-stage destinations
  (`--dest-reach`) both place labels on a circle around the centred cookie.
  Both used fixed px radii for the phone case, and a fixed radius cannot know
  how wide the phone is: the labels at 0° and 180° reach furthest sideways and
  ran off every handset under ~400px. The radii are now viewport-aware lengths
  capped at the figure the design was drawn to — the cap keeps wide phones and
  desktop pixel-identical, the `vw` term rescues the narrow ones. Everything
  else is expressed as a fraction of them, so the geometry scales as one piece.
  Do not reintroduce a bare pixel radius.
- **Everything raster ships as WebP, and the sizes are display-derived.** The
  originals are still in `public/` beside them; the `.webp` is what the code
  references. Four of the "SVG" files were never vector — `ingredient/
  {butter,cardamom,coconut,peanut}.svg` and `ingredient-doodle-field.svg` were a
  single base64 PNG inside an SVG wrapper, which paid a 33% base64 tax, could
  not be resized per device and was invisible to the image optimiser. Do not
  reintroduce that shape. Each file is exported at roughly 2x the largest CSS
  size it is ever drawn at; if you change a layout so something is drawn bigger,
  re-export it rather than letting the browser upscale.

- **A phone must not render the desktop variant, even hidden.** Several scenes
  used to mount both cuts with `hidden md:block` / `block md:hidden` deciding
  which was seen. `display: none` hides a subtree from the screen; it does not
  stop Motion driving it — every `useTransform` in the hidden cut still
  recomputed and wrote a style attribute on every scroll frame, and its `next/
  image`s still downloaded. Switch on `useIsMobile()` and mount one. This
  applies to `CookieJourney`, `JourneyWorldLayer`, `MarketsJourney`,
  `GrowthStory` and `PartnershipNetwork`; keep it that way.

- **The expensive decorative layers are gated on `pointer: coarse`, in CSS.**
  The film grain (a full-viewport `feTurbulence` under `mix-blend-multiply`,
  stepped ten times a second) and Lenis (whose `raf` loop ran every frame for
  the life of the page while `syncTouch: false` meant it was not smoothing touch
  anyway) are both off on phones. Both were measurable heat, not theory. Grain
  is decided in `globals.css` for the same reason reduced motion is — a JS
  decision would mount then unmount the layer after hydration.

- **`backdrop-filter` is desktop-only, and never sits behind an opaque
  surface.** It is the most expensive effect per pixel on the page: the
  compositor snapshots and blurs everything behind the element, and redoes it
  whenever either moves. At 90% background opacity or more the blur is
  invisible, so it is simply deleted; below that it is `md:`-gated with the
  mobile opacity raised to hold contrast. A mobile homepage now computes zero
  backdrop filters, down from 29. Do not add a bare `backdrop-blur-*`.

- **Scrub seeks are quantised to the video's frame grid.** `ScrubVideo` damps
  the playhead every frame but only *writes* `currentTime` when the request
  lands on a different 1/24s frame and no seek is already in flight. Writing it
  every frame asks a phone's decoder for ~60 seeks a second, which is what made
  the handset hot. The damping still runs per frame, so the motion is unchanged.

- **No spaces in a filename that reaches a `srcset`.** In `srcset` a space
  separates the URL from its descriptor, so `/brand/about hero mobilr.webp`
  parses as the URL `/brand/about` plus two descriptors — a 404, and a silent
  one, because the browser just falls back to `src`. That pair is now
  `about-hero-desktop.webp` / `about-hero-mobile.webp`.

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
  whole technique rests on it. The sheet now ships at WebP q85 with
  `alpha_quality=100, exact=True`, which was verified bit-for-bit on alpha
  against the q92 original (RGB mean absolute error 1.71/255, invisible at the
  size a prop is drawn). Verify the same way if you re-encode: compare the
  alpha planes as arrays and assert equality, do not eyeball it.
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
