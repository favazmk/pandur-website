/* ------------------------------------------------------------------
   The ingredient doodle line-art, used as a decorative ground.

   Two ways in, both drawing on the same `/ingredient/ingredient-
   doodle-field.svg` so a visitor downloads the artwork once:

     DoodleWall    the pattern tiled across a whole section
     DoodleLayer   one instance of the pattern, drifting

   Neither recolours or redraws anything. The SVG is transparent
   line-art in its own near-black ink and is placed exactly as
   delivered; the only thing laid over it is opacity, so the
   monochrome look is the artwork's own, not something rebuilt in
   CSS. No filter, no blend mode, no tint.

   Both are server components — the motion is entirely CSS, so
   there is no reason to ship either of them to the browser as
   client JS.
   ------------------------------------------------------------------ */

/**
 * Ink strength. The artwork covers roughly a quarter of its tile, so
 * anything much above this stops being a ground and starts competing with
 * the copy — and the tile's non-wrapping margins begin to show as a grid.
 */
const WALL_INK = 0.07;
const LAYER_INK = 0.06;

/**
 * The pattern tiled across a section, at the delivered spec:
 * `repeat` at `420px auto`.
 *
 * Drops into any `relative overflow-hidden` section. It is one element, so
 * it moves at the stricter of the two briefs — 4px and a 1.5deg sweep — and
 * it is inset NEGATIVELY: a rotating element with a repeating background
 * swings its own corners inside the section and would flash a bare edge, so
 * the layer is built oversized and the section clips it.
 */
export function DoodleWall({
  opacity = WALL_INK,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="doodle-pattern doodle-drift absolute -inset-[6%]"
        style={{ opacity }}
      />
    </div>
  );
}

/**
 * One instance of the pattern, floating.
 *
 * `index` staggers the layer: each one gets its own duration inside the
 * 5-7s brief and its own negative delay, so two layers over the same
 * section never rise and fall together. Negative rather than positive so
 * the group is already out of phase on the first frame instead of starting
 * in lockstep and drifting apart.
 */
const CADENCE = [
  { duration: 6.2, delay: 0 },
  { duration: 5.1, delay: -2.4 },
  { duration: 6.9, delay: -1.1 },
] as const;

export function DoodleLayer({
  index = 0,
  opacity = LAYER_INK,
  className = "",
}: {
  index?: number;
  opacity?: number;
  /** placement + size — this component brings no position of its own */
  className?: string;
}) {
  const { duration, delay } = CADENCE[index % CADENCE.length];

  return (
    <div
      aria-hidden
      className={`doodle-float pointer-events-none absolute ${className}`}
      style={
        {
          opacity,
          "--d-dur": `${duration}s`,
          "--d-delay": `${delay}s`,
        } as React.CSSProperties
      }
    >
      {/*
       * The pattern at its own 3:2, sized by the wrapper. `img` rather than
       * a background so the intrinsic ratio is declared and the box cannot
       * resize itself once the file lands.
       */}
      {/* eslint-disable-next-line @next/next/no-img-element -- ships as-is;
          next/image would need dangerouslyAllowSVG and gains nothing here. */}
      <img
        src="/ingredient/ingredient-doodle-field.webp"
        alt=""
        width={2400}
        height={1600}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        draggable={false}
        className="block h-auto w-full select-none"
      />
    </div>
  );
}
