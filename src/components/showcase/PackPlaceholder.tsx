import IngredientMark from "@/components/brand/Ingredients";
import type { ShowcaseScene } from "@/lib/showcase";

/* ------------------------------------------------------------------
   The stand-in pack, for a flavour with no cut-out photography yet.

   Coconut and peanut have no transparent pack shot — only the flat
   `pack-*.jpg` renders, which have no alpha and carry known artwork
   errors (see `lib/assets.ts`). Dropping one of those onto a tinted
   showcase stage would put a rectangle of somebody else's kitchen in
   the middle of the composition, so the scene draws this instead.

   It is drawn to the SAME structure as the two real shots, because
   sitting next to them is exactly what it has to survive: white body
   with a coloured lower field under a wave, the wordmark high on the
   white, the ingredient where the cookie photograph goes, the flavour
   name on the colour, a piece count in the corner, and the sachet
   overlapping the box's bottom-right. Built in the same 1224x1285
   frame, so when `pack` is filled in on the scene the drawing is
   simply replaced by the picture and nothing in the layout moves.

   The one thing it does NOT do is pretend. The dashed edge and the
   corner chip say "artwork pending" to anyone on the project; drop
   `label` for a client-facing build and it reads as illustration.
   ------------------------------------------------------------------ */

export default function PackPlaceholder({
  scene,
  label = true,
}: {
  scene: ShowcaseScene;
  /** the "pack shot to come" chip — the only part that admits to being a stand-in */
  label?: boolean;
}) {
  const { palette, accent, name } = scene;

  return (
    <div
      aria-hidden
      /* the real shots' ratio, to four figures, so nothing reflows on swap */
      className="relative aspect-[1224/1285] w-full"
    >
      {/* contact shadow — soft realistic double ellipse */}
      <div
        className="absolute bottom-[2%] left-[8%] h-[8%] w-[80%] rounded-[50%] blur-xl"
        style={{ backgroundColor: palette.deep, opacity: 0.32 }}
      />
      <div
        className="absolute bottom-[4%] left-[14%] h-[4%] w-[62%] rounded-[50%] blur-md"
        style={{ backgroundColor: palette.deep, opacity: 0.4 }}
      />

      {/* ================= the box ================= */}
      <div
        className="absolute bottom-[8%] left-[1%] h-[76%] w-[63%] overflow-hidden rounded-[3%] border border-dashed bg-white"
        style={{
          borderColor: `${accent}66`,
          boxShadow: `0 30px 56px -16px ${palette.deep}90, 0 12px 24px -8px ${palette.deep}60`,
        }}
      >
        {/* the coloured spine down the left, as on the real pack */}
        <div
          className="absolute inset-y-0 left-0 w-[13%]"
          style={{ backgroundColor: palette.mid }}
        />

        {/*
         * The coloured field, with a wave for its top edge. An elliptical
         * border-radius gets that curve in one property — the real pack's
         * divider is a single shallow arc, not a scallop.
         */}
        <div
          className="absolute inset-x-0 bottom-0 h-[52%] rounded-t-[50%/22%]"
          style={{
            background: `linear-gradient(180deg, ${palette.mid} 0%, ${palette.deep} 100%)`,
          }}
        />

        {/* --- top matter, on the white --- */}
        <div className="absolute inset-x-0 top-[6%] flex items-start justify-between px-[7%] pl-[17%]">
          {/* eslint-disable-next-line @next/next/no-img-element -- ships as-is;
              next/image would need dangerouslyAllowSVG and gains nothing on a
              file the optimiser passes straight through. */}
          <img
            src="/brand/pandur-wordmark.svg"
            alt=""
            width={1146}
            height={473}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="block h-auto w-[52%] select-none"
          />
          <span
            className="rounded-[3px] px-[0.4em] py-[0.2em] text-[clamp(0.3rem,0.62vw,0.48rem)] font-black uppercase leading-tight tracking-[0.08em] text-white"
            style={{ backgroundColor: palette.deep }}
          >
            Made in UAE
          </span>
        </div>

        {/*
         * Where the cookie photograph goes. The flavour's own drawn mark
         * stands in — it is the one element that names the flavour without
         * words, which is precisely the job the photo does on the real pack.
         *
         * It sits on its own pale disc. The real pack's photograph straddles
         * the wave divider and gets away with it because a photograph is a
         * solid object; a LINE drawing crossing that edge loses its bottom
         * half into the colour and reads as a broken graphic. The disc is
         * also, incidentally, what the packaging does around the seal.
         */}
        <div className="absolute left-1/2 top-[30%] aspect-square w-[50%] -translate-x-1/2 rounded-full bg-white/85" />
        <IngredientMark
          slug={scene.id}
          className="absolute left-1/2 top-[34%] h-auto w-[40%] -translate-x-1/2"
          stroke={palette.deep}
          strokeWidth={5}
        />

        {/* --- the name, on the colour --- */}
        <div className="absolute inset-x-0 bottom-[13%] px-[8%] pl-[18%] text-left">
          <span className="block text-[clamp(0.7rem,1.9vw,1.6rem)] font-black leading-none text-white">
            {name}
          </span>
          <span className="mt-[0.15em] block text-[clamp(0.6rem,1.5vw,1.3rem)] font-black leading-none text-white/85">
            Cookies
          </span>
        </div>

        <span
          className="absolute bottom-[4%] right-[6%] rounded-[3px] bg-white px-[0.45em] py-[0.25em] text-[clamp(0.3rem,0.62vw,0.48rem)] font-black uppercase leading-tight tracking-[0.06em]"
          style={{ color: palette.deep }}
        >
          16 pcs
        </span>
      </div>

      {/* ================= the sachet, overlapping the box ================= */}
      <svg
        viewBox="0 0 100 132"
        fill="none"
        className="absolute bottom-[12%] right-[1%] block h-auto w-[38%] drop-shadow-[0_14px_18px_rgba(58,35,24,0.18)]"
      >
        {/* crimped ends — a zigzag, the way a pillow pack is actually sealed */}
        <path
          d="M2 8 L10 2 L18 8 L26 2 L34 8 L42 2 L50 8 L58 2 L66 8 L74 2 L82 8 L90 2 L98 8
             L98 124 L90 130 L82 124 L74 130 L66 124 L58 130 L50 124 L42 130 L34 124
             L26 130 L18 124 L10 130 L2 124 Z"
          fill="white"
        />
        <path
          d="M2 62 L98 62 L98 124 L90 130 L82 124 L74 130 L66 124 L58 130 L50 124
             L42 130 L34 124 L26 130 L18 124 L10 130 L2 124 Z"
          fill={palette.mid}
        />
        {/* the same wave divider the box carries */}
        <ellipse cx="50" cy="62" rx="54" ry="9" fill={palette.mid} />
        <ellipse cx="50" cy="56" rx="54" ry="9" fill="white" />
        <IngredientMarkInSachet scene={scene} />
        <text
          x="50"
          y="104"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="900"
        >
          {name}
        </text>
      </svg>

      {label && (
        <span
          className="absolute bottom-0 left-[2%] rounded-full border px-3 py-1 text-[clamp(0.48rem,0.78vw,0.6rem)] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent, borderColor: `${accent}55` }}
        >
          Pack shot to come
        </span>
      )}
    </div>
  );
}

/**
 * The mark inside the sachet's SVG frame. Nested `<svg>` rather than a `<g>`:
 * `IngredientMark` brings its own 200x200 viewBox, and a nested svg is the one
 * element that can re-scale a foreign coordinate system without knowing it.
 */
function IngredientMarkInSachet({ scene }: { scene: ShowcaseScene }) {
  return (
    <svg x="27" y="18" width="46" height="46" viewBox="0 0 200 200">
      <IngredientMark
        slug={scene.id}
        stroke={scene.palette.deep}
        strokeWidth={8}
        className="h-full w-full"
      />
    </svg>
  );
}
