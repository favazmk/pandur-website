# PANDUR — Website Build Prompt

**Client:** Pandur (Royal Quality Bakes LLC) — Zubara, Khorfakkan, UAE
**Benchmark:** oreo.com — the site must clearly outclass it
**Status:** Product photography NOT yet delivered. Build must proceed and be visually complete without it.

---

## 0. The one-line brief

Build a full-screen, WebGL-driven brand experience for a UAE cookie brand — where the cookie itself is a real 3D object that lives inside the scroll from the first frame to the last. Typography-led, motion-everywhere, near-zero body copy. Every section earns its place visually.

---

## 1. What the benchmark actually does (measured, not guessed)

oreo.com was inspected live. Its real construction:

| Aspect | oreo.com |
|---|---|
| Smooth scroll | Lenis |
| Animation | Motion (framer-motion), CSS keyframes |
| Page | ~15,000px tall, 32 sections |
| Scroll-pinned scenes | Exactly **one** (`sticky top-0 h-screen`) |
| 3D | Siloed on a **separate page** (`/oreoverse`), fixed-viewport, "Click & Drag to Explore" — not in the scroll |
| Type | `ChonkyKitty` (chunky display) + `Pluto` (brand sans), fluid type utilities |
| Media | Many `autoplay loop` videos |

Its actual motion tokens — **reuse these, they are proven**:

```
pop-up          600ms   cubic-bezier(0.34, 1.56, 0.64, 1)   /* back-out overshoot */
slide-up-in    1000ms   cubic-bezier(0.23, 1, 0.32, 1)      /* expo-out */
slam-in         600ms   ease-in-out                          /* headline impact */
ticker-seamless  60s    linear infinite                      /* marquee band */
tilt-4 / 6 / 8  2.5s / 3s / 3.5s  ease-in-out infinite       /* desynced idle wobble */
```

The desynced idle tilt is the single most-copied detail on that site: cards never sit still, and because the three durations are coprime-ish they never re-sync. Keep it.

### Where oreo.com is beatable — target these gaps

1. **3D is quarantined.** Theirs lives on its own page. **Ours is in the hero, in the flavour section, and in the closing frame.** One continuous 3D subject through the whole scroll.
2. **Motion is enter-triggered, not scroll-linked.** Theirs mostly fires once on viewport entry. **Ours scrubs** — rotation, bite, crumb dispersion all bound to `scrollYProgress`, reversible by scrolling up.
3. **Only one pinned scene.** **Ours has three**, each doing different work.
4. **No cursor interaction.** **Ours has** cursor-parallax on the 3D subject, magnetic CTAs, and a custom cursor that reacts to hoverable regions.
5. **No shader work on the main page.** **Ours has** a grain/noise pass, a warm-gradient environment, and a transition wipe.
6. **Photography-dependent.** Ours is **procedural** — which is exactly why the missing product images do not block us.

---

## 2. Brand truth (extracted from the supplied logo, not invented)

The logo was rendered and sampled directly. Anatomy:

- **Wordmark:** hand-lettered brush script, all-lowercase, bouncy baseline, rounded terminals. `pan` in red, `dur` in near-black.
- **Motif:** a thin monoline **bitten cookie ring** sits behind the wordmark, with the bite notched out of the upper-left.
- **Accents:** two small monoline **chocolate-chip cookies with a bite taken out**, drawn as outline line-art with chip shapes.
- **Ground:** built on white. This is a **light-first brand**, not a dark-mode brand.
- **Cookie type:** chocolate chip — *not* a sandwich cookie. Do not draw an Oreo.

### Palette

Extracted (exact, non-negotiable):

```css
--pandur-red:   #EC2126;  /* wordmark "pan", primary brand */
--pandur-ink:   #221F1F;  /* wordmark "dur" */
--pandur-black: #020404;  /* line-art strokes */
--white:        #FFFFFF;
```

Proposed extensions (mine, adjust freely — these are *not* from the logo):

```css
--cream:  #FBF5EC;  /* default page ground — warmer than white, reads premium */
--dough:  #E8C89A;  /* biscuit tone, 3D base albedo */
--cocoa:  #3A2318;  /* chip colour, deep sections */
--ash:    #6E6866;  /* muted body text */
```

Rule: **red is an accent, never a background wash.** Big red fields cheapen it. Use red for the wordmark, one word per headline, CTA fills, and the marquee band.

### Typography

- **Display:** `Fraunces` (variable — use the `SOFT` and `WONK` axes). Warm, crafted, bakery-appropriate, and its soft axis rhymes with the script logo without competing with it.
- **Body/UI:** `Satoshi` or `General Sans`. Clean grotesk, keeps text areas quiet.
- **Script accent:** use the *logo artwork itself* for the wordmark. Do not set "pandur" in a font — it is lettering, not type.

Alternate display if the client wants louder: a chunky rounded geometric extra-bold. Fraunces is the more premium call and puts more distance between us and Oreo's ChonkyKitty.

Implement fluid type with `clamp()` throughout — no fixed heading sizes.

---

## 3. Tech stack

```
Next.js (App Router) + TypeScript
React Three Fiber + @react-three/drei      — 3D
three-bvh-csg                              — boolean bite geometry
Motion (motion/react)                      — scroll + spring animation
Lenis                                      — smooth scroll (same as benchmark)
Tailwind v4                                — styling, fluid type utilities
GLSL                                       — grain pass, transition wipe
```

Deploy to Vercel. No external HDR/model/texture files — see §5.

---

## 4. Motion system (define once, as tokens)

```ts
export const ease = {
  pop:   [0.34, 1.56, 0.64, 1],   // overshoot — cards, badges, chips
  expo:  [0.23, 1, 0.32, 1],      // headlines, section reveals
  slam:  [0.85, 0, 0.15, 1],      // impact moments
  glide: [0.16, 1, 0.3, 1],       // 3D camera moves
} as const;

export const spring = {
  soft: { stiffness: 120, damping: 18, mass: 0.9 },  // cursor parallax
  snap: { stiffness: 320, damping: 24, mass: 0.6 },  // magnetic CTAs
} as const;

export const dur = { fast: 0.35, base: 0.6, slow: 1.0, scene: 1.6 };
```

**Global motion rules**

- Every headline: split to characters or words, stagger `0.03s`, `ease.expo`, `y: 110% → 0` from behind an `overflow-hidden` mask.
- Every card/tile: idle tilt on the desynced 2.5s / 3s / 3.5s cycle.
- Every marquee: vary speed per band (40s / 60s / 80s) and alternate direction. Never two adjacent bands at the same speed.
- Every CTA: magnetic pull toward cursor within ~80px, `spring.snap`, plus a vertical label roll on hover (duplicate the label — this is the benchmark's trick).
- **Scroll-linked over enter-triggered** wherever the animation describes a process.
- Section transitions: crossfade the page ground colour with the scroll, so cream → cocoa → cream feels continuous rather than banded.

---

## 5. The 3D cookie — procedural, zero external assets

This is the centrepiece and the reason the missing photography doesn't block the build.

**Geometry**
- Base: cylinder, ~64 radial segments, low height, with the rim vertices radially jittered by noise so the edge is irregular and hand-made, never machine-round.
- Surface: vertex displacement via 3D simplex noise (low amplitude, two octaves) for crumb texture. Bake a normal map from the same noise for close-up detail.
- Chips: ~14–20 instanced low-poly dodecahedrons, partially embedded, random rotation and scale, clustered by a blue-noise distribution so they don't grid up.
- **Bite:** subtract a sphere from the base mesh with `three-bvh-csg` at build time. Keep both meshes — whole and bitten — and swap/morph at the scroll point where the bite lands.

**Material**
- `MeshPhysicalMaterial`, `roughness ≈ 0.85`, `clearcoat 0`, subtle sheen. Albedo `--dough`, chips `--cocoa`.
- Slight ambient-occlusion darkening in the crevices — sell the crumb.

**Lighting — no HDR file**
- Build the environment procedurally: a gradient cube/sphere env (warm key ~`#FFE9C9`, cool fill ~`#EAF0FF`) fed to `Environment` as a generated texture.
- Three-point rig: warm key upper-left, soft fill right, cool rim behind for edge separation.

**Post**
- Fine film grain (animated, low opacity) over the whole canvas. This single pass is what makes WebGL read as "designed" rather than "a demo".
- Subtle vignette. No bloom — bloom on a biscuit looks wrong.

**Performance**
- `dpr={[1, 2]}`, cap at 2.
- Below `768px`: reduce chip instances, drop the displacement to one octave, freeze the grain.
- `prefers-reduced-motion`: render the cookie static at a hero-appropriate angle, disable scrub, keep all content readable.

---

## 6. Section-by-section spec

### 0 — Preloader
Monoline cookie ring from the logo draws itself via `stroke-dashoffset`. Percentage counter in Fraunces. On complete: ring scales up and wipes the hero in. Max 2s even on fast connections — never fake a longer wait.

### 1 — Hero (100vh)
- Procedural 3D cookie, centred, slow idle rotation.
- Cursor-parallax: cookie tilts ±6° toward the pointer on `spring.soft`. On mobile, use device orientation if permitted, otherwise idle only.
- Headline: **"Our Signature Taste."** / **"Made to Grow."** — second line's last word in `--pandur-red`. Character stagger from mask.
- Logo wordmark top-left (supplied artwork, SVG).
- Bottom edge: thin ticker band — `MADE IN KHORFAKKAN · UAE · SINCE 45 YEARS · MADE TO GROW ·` at 80s linear.
- Scroll cue: the monoline cookie doodle, gently bobbing.

### 2 — Stat band
Four figures, odometer-roll counters on enter, `ease.expo`:

```
45+          4                    6 Months        8+
Years of     Signature            Shelf Life      UAE Markets
Experience   Flavours
```

Dividers draw in as hairlines. Each stat on the desynced idle tilt.

### 3 — The Four Flavours  *(pinned scene 1)*
- `sticky top-0 h-screen`, horizontal translate driven by `scrollYProgress`.
- Four panels. Each: the 3D cookie re-lit and colour-graded for that flavour, flavour name in huge Fraunces, one short line of copy — **no paragraphs**.
- Page ground colour interpolates between panels.
- Monoline cookie doodles drift in the background at differing parallax depths.
- **Flavour names are TBD from client** — see §9.

### 4 — The Bite  *(pinned scene 2)*
The signature moment.
- Scroll scrubs: cookie rotates to face camera → bite geometry swaps in → crumbs burst outward as instanced shards and settle.
- Fully reversible on scroll-up.
- Copy, short: **"Six months on shelf. Tastes like it left the oven this morning."**

### 5 — Craft / Quality
Split layout. Left: three short claims, revealed on stagger. Right: reserved slot for product photography (see §8) — until images arrive, fill with an animated monoline cookie composition built from the logo's line-art vocabulary.

### 6 — Market Presence
- Stylised UAE outline, SVG, drawing itself in via `stroke-dashoffset`.
- Eight pins drop on stagger with `ease.pop`, each labelled: Sharjah · Ajman · Dibba · Khorfakkan · Fujairah · Masafi · Ras Al Khaimah · Kalba.
- Connecting routes draw between pins.
- Caption: **"Eight markets. One taste."**

### 7 — Marquee band
Full-bleed `--pandur-red`. Giant Fraunces: `MADE TO GROW · OUR SIGNATURE TASTE ·` at 40s, with a counter-scrolling thinner band beneath at 60s.

### 8 — Vision / GCC
Region view expanding outward from the UAE. One line: **"Next: the GCC."** Restraint here makes it land.

### 9 — Partner With Pandur
- Headline: **"Let's grow together."**
- One line: *Supermarkets · Hypermarkets · Distributors · Wholesalers · Cafés · Hotels · Food Service*
- Contact form, magnetic submit CTA, inline validation, animated success state.

### 10 — Footer
Oversized wordmark, monoline cookie doodles scattered with slow independent drift. Royal Quality Bakes LLC · Zubara, Khorfakkan, UAE.

---

## 7. Copy — full set, deliberately short

Use verbatim. Do not expand into paragraphs; the brief explicitly asks for short text.

```
HERO        Our Signature Taste. Made to Grow.
STATS       45+ Years of Experience · 4 Signature Flavours · 6 Months Shelf Life · 8+ UAE Markets
FLAVOURS    Four cookies. Four reasons to come back.
BITE        Six months on shelf. Tastes like it left the oven this morning.
CRAFT       45 years in the oven. · Consistent, every batch. · Built for the shelf.
MARKETS     Eight markets. One taste.
BAND        MADE TO GROW · OUR SIGNATURE TASTE ·
VISION      Next: the GCC.
PARTNER     Let's grow together.
FOOTER      Pandur · Royal Quality Bakes LLC · Zubara, Khorfakkan, UAE
```

Deliberately omitted from the site (present in the client's brief, but it's brochure copy that would dilute a visual-first build): the full mission statement, the extended company history, and the long partnership paragraph. Keep these for an About page later if the client wants them.

---

## 8. Asset contract — so photography drops in without a refactor

Build every image slot as a component with a procedural fallback **now**, swapped by a single config flag later.

```
/public/products/flavour-01.png … flavour-04.png
  — transparent PNG, ≥2000px on the long edge, cookie centred, soft contact shadow

/public/products/pack-01.png … pack-04.png
  — packaging shots, transparent, same spec

/public/brand/pandur-logo.svg
  — supplied logo, converted from the PDF, colours mapped to brand tokens
```

```ts
// lib/assets.ts
export const HAS_PRODUCT_IMAGES = false;  // flip to true when client delivers
```

Every product slot renders `<ProductSlot flavour={n} />`, which returns the procedural 3D cookie or line-art composition while `false`, and the photograph while `true`. **No layout should shift when the flag flips** — reserve the exact aspect ratio from day one.

---

## 9. Open items — need the client before launch

1. **The four flavour names.** Not in the supplied brief. Panels are built with placeholders `FLAVOUR_01`–`FLAVOUR_04`; supply names and the section is complete.
2. **"Aman" in the market list** is almost certainly **Ajman**. Spec above assumes Ajman — confirm.
3. Product and packaging photography, per §8.
4. Contact destination for the partner form (email address or endpoint).
5. Arabic version? UAE/GCC audience makes RTL a fair question — worth asking before the layout hardens, because retrofitting RTL is expensive.

---

## 10. Quality bar — definition of done

- **Performance:** LCP < 2.5s, CLS < 0.1. 3D lazy-mounts after first paint with a poster frame. Total JS under 300KB gzipped excluding the 3D chunk.
- **Accessibility:** `prefers-reduced-motion` honoured everywhere — every scrub becomes a static state, no information lives only in motion. Keyboard-navigable, visible focus rings, real semantic headings, AA contrast on all text (check red-on-cream carefully; darken to `--pandur-ink` for body copy).
- **Responsive:** designed at 1440 and 390. The pinned horizontal scenes convert to vertical stacks below 768px — do not attempt horizontal scroll on mobile.
- **Browser:** Chrome, Safari, Firefox, iOS Safari. WebGL fallback: if the context fails, serve the line-art composition — the site must never render blank.

---

## 11. Build order

1. Scaffold, tokens, fonts, Lenis, grain pass
2. Hero + procedural 3D cookie ← *the hardest thing; do it first, it de-risks everything*
3. Stat band, marquees, footer (fast wins, establishes the motion language)
4. Pinned scenes 1 and 2
5. Markets map, vision, partner form
6. Reduced-motion pass, mobile pass, performance pass
7. Swap in photography when it arrives (flip one flag)
