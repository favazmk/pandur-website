/* ------------------------------------------------------------------
   Ingredient sprites — the individual pieces, not the framed picture.

   WHY THESE EXIST. The delivered `public/ingredient/<slug>.svg` files
   are 768x512 illustrations with an OPAQUE ground — see
   `components/brand/IngredientPhoto.tsx`, which is built entirely
   around that fact. They cannot be scattered across a coloured stage
   as free-floating objects: each one would arrive as a rectangle of
   the wrong colour.

   So the showcase needs cut-out pieces, and these are them. One shape
   per object, transparent, drawn into a 100x100 box so placement is
   pure percentage arithmetic.

   Drawing language is the site's own, taken from `Ingredients.tsx`:
   round caps and joins, no hairlines, silhouettes distinct enough to
   read at 5% of the viewport. The one difference is that these are
   FILLED rather than stroked — a stroked outline disappears against a
   tinted flavour ground at this size, and the showcase asks these to
   carry the flavour on their own.

   Every sprite is tinted from a four-value palette rather than
   hard-coded, so a flavour's pieces always sit in that flavour's own
   range and a palette change never means re-drawing anything.

   THE PALE SHAPES CARRY AN OUTLINE. Coconut flesh, peanut kernels,
   butter and crumbs are all near-white by nature, and the grounds they
   float over are warm creams — measured, some of those pairs sit under
   1.3:1, which at 5% of the viewport means the object simply is not
   there. A thin `line` stroke at 45% gives every one of them an edge.
   It is also the site's own drawing language: `Ingredients.tsx` and
   the doodle field are both stroked line art, so an outlined fill
   belongs here in a way a bare fill does not.
   ------------------------------------------------------------------ */

export type SpritePalette = {
  /** darkest — shells, husks, rind, ridges */
  deep: string;
  /** the body colour of the object */
  mid: string;
  /** flesh, cut faces, highlights */
  light: string;
  /** texture strokes; used at low opacity, under `deep` */
  line: string;
};

export type SpriteId =
  | "coconut-half"
  | "coconut-chunk"
  | "coconut-flake"
  | "palm-leaf"
  | "peanut-shell"
  | "peanut-kernel"
  | "peanut-piece"
  | "cardamom-pod"
  | "cardamom-seed"
  | "cardamom-leaf"
  | "butter-curl"
  | "butter-pat"
  | "crumb";

type SpriteProps = { p: SpritePalette; className?: string };

function Frame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      className={`block h-auto w-full select-none ${className ?? ""}`}
    >
      {children}
    </svg>
  );
}

/* --- coconut ---------------------------------------------------- */

/** A halved coconut seen slightly from above: husk bowl, white inside. */
function CoconutHalf({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path d="M6 38 C6 38 8 94 50 94 C92 94 94 38 94 38 Z" fill={p.deep} />
      <path
        d="M16 41 C16 41 19 85 50 85 C81 85 84 41 84 41 Z"
        fill={p.light}
        stroke={p.line}
        strokeWidth="2.2"
        strokeOpacity="0.45"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="38" rx="44" ry="13" fill={p.mid} />
      <ellipse cx="50" cy="38" rx="34" ry="8.5" fill={p.light} />
      {/* husk fibre — inside the silhouette, never radiating out of it */}
      <path
        d="M13 52 C17 66 23 78 31 86"
        stroke={p.line}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M87 52 C83 66 77 78 69 86"
        stroke={p.line}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M23 48 C25 73 36 82 50 83"
        stroke={p.mid}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.3"
      />
    </Frame>
  );
}

/** A broken wedge — white flesh with the rind still on one edge. */
function CoconutChunk({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path
        d="M14 70 C8 42 26 16 58 8 C74 16 84 34 80 54 C76 74 48 86 14 70 Z"
        fill={p.light}
        stroke={p.line}
        strokeWidth="2.2"
        strokeOpacity="0.45"
        strokeLinejoin="round"
      />
      <path
        d="M14 70 C48 86 76 74 80 54 C82 62 82 71 78 77 C56 91 24 86 14 70 Z"
        fill={p.deep}
      />
      <path
        d="M30 30 C44 22 58 20 70 25"
        stroke={p.mid}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.4"
      />
    </Frame>
  );
}

/** A shaving — long, thin, curved. */
function CoconutFlake({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path
        d="M5 56 C22 24 60 10 95 24 C93 33 86 38 76 38 C54 39 30 48 15 65 C9 66 4 62 5 56 Z"
        fill={p.light}
        stroke={p.line}
        strokeWidth="2.2"
        strokeOpacity="0.45"
        strokeLinejoin="round"
      />
      <path
        d="M15 65 C30 48 54 39 76 38 C60 45 40 53 26 65 Z"
        fill={p.mid}
        opacity="0.4"
      />
    </Frame>
  );
}

/** A single frond, for the coconut scene only. */
function PalmLeaf({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path d="M94 8 C56 12 24 38 8 92 C52 84 86 52 94 8 Z" fill={p.mid} />
      <path
        d="M91 11 C60 40 30 66 11 90"
        stroke={p.deep}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M72 24 C66 32 62 40 60 48 M56 40 C50 48 46 56 44 64 M40 56 C34 63 30 70 28 77"
        stroke={p.deep}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.28"
      />
    </Frame>
  );
}

/* --- peanut ----------------------------------------------------- */

/**
 * In the shell. The silhouette is the same waisted double-lobe as
 * `PeanutMark` in `Ingredients.tsx`, at half scale — the two are the
 * same object and should not disagree about its shape.
 */
function PeanutShell({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path
        d="M50 14 C65 14 73 25 73 36 C73 43.5 68 48 68 52 C68 56 73 60.5 73 68
           C73 79 65 88 50 88 C35 88 27 79 27 68 C27 60.5 32 56 32 52
           C32 48 27 43.5 27 36 C27 25 35 14 50 14 Z"
        fill={p.mid}
        stroke={p.line}
        strokeWidth="2.2"
        strokeOpacity="0.45"
        strokeLinejoin="round"
      />
      <path
        d="M39 31 C45 28 55 28 61 31 M38 69 C45 66 55 66 62 69"
        stroke={p.deep}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M37 24 C42 19 48 18 54 19"
        stroke={p.light}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </Frame>
  );
}

/** Shelled — the bare nut, split down the middle. */
function PeanutKernel({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path
        d="M50 12 C68 12 79 30 79 51 C79 72 66 88 50 88 C34 88 21 72 21 51
           C21 30 32 12 50 12 Z"
        fill={p.light}
        stroke={p.line}
        strokeWidth="2.2"
        strokeOpacity="0.45"
        strokeLinejoin="round"
      />
      <path
        d="M50 18 L50 83"
        stroke={p.mid}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path d="M50 12 C56 16 59 22 59 28 C55 22 52 17 50 12 Z" fill={p.deep} />
      <ellipse
        cx="38"
        cy="40"
        rx="6"
        ry="12"
        fill={p.light}
        opacity="0.85"
        transform="rotate(-14 38 40)"
      />
    </Frame>
  );
}

/** A chopped fragment — faceted, never a smooth blob. */
function PeanutPiece({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path
        d="M24 38 L58 22 L80 40 L74 68 L44 80 L20 62 Z"
        fill={p.light}
        stroke={p.line}
        strokeWidth="2.2"
        strokeOpacity="0.45"
        strokeLinejoin="round"
      />
      <path d="M44 80 L74 68 L80 40 L66 52 L52 63 Z" fill={p.mid} opacity="0.45" />
    </Frame>
  );
}

/* --- cardamom --------------------------------------------------- */

/** A pod — ridged, pointed, stem still on. Same shape as `CardamomMark`. */
function CardamomPod({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path
        d="M50 12 C64 30 71 50 71 64 C71 80 62 90 50 90 C38 90 29 80 29 64
           C29 50 36 30 50 12 Z"
        fill={p.mid}
      />
      <path
        d="M50 20 L50 86 M38 36 C33 56 33 72 39 84 M62 36 C67 56 67 72 61 84"
        stroke={p.deep}
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M50 12 L50 3"
        stroke={p.deep}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M42 30 C40 42 39 53 40 63"
        stroke={p.light}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </Frame>
  );
}

/** A loose seed — small, dark, angular. */
function CardamomSeed({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path
        d="M34 26 C54 20 74 32 76 52 C78 70 62 82 46 78 C30 74 22 58 26 42 Z"
        fill={p.deep}
      />
      <path
        d="M38 37 C46 32 56 34 62 41"
        stroke={p.light}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.32"
      />
    </Frame>
  );
}

/** A slim leaf, for the cardamom scene. */
function CardamomLeaf({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path d="M92 6 C52 12 20 40 8 94 C50 86 84 52 92 6 Z" fill={p.mid} />
      <path
        d="M89 9 C58 37 28 65 11 91"
        stroke={p.deep}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M70 22 C64 30 60 38 58 46 M52 40 C46 48 42 55 40 63"
        stroke={p.deep}
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity="0.25"
      />
    </Frame>
  );
}

/* --- butter ----------------------------------------------------- */

/**
 * A curl off the block. Drawn as one heavy round-capped stroke rather
 * than a filled outline — a curl is a ribbon, and a capped stroke is
 * exactly that shape with none of the path arithmetic.
 */
function ButterCurl({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path
        d="M16 76 C10 46 32 20 60 18 C80 17 92 30 92 45 C92 61 79 70 66 68 C57 66 52 59 54 51"
        stroke={p.mid}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M20 72 C16 48 35 26 58 24"
        stroke={p.light}
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </Frame>
  );
}

/** The cut slab, three faces — the shape `ButterMark` draws in line. */
function ButterPat({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path d="M14 50 L50 34 L86 50 L50 66 Z" fill={p.light} />
      <path d="M14 50 L14 66 L50 82 L50 66 Z" fill={p.mid} />
      <path d="M86 50 L86 66 L50 82 L50 66 Z" fill={p.deep} />
      <path
        d="M14 50 L50 34 L86 50 L86 66 L50 82 L14 66 Z M14 50 L50 66 L86 50 M50 66 L50 82"
        fill="none"
        stroke={p.line}
        strokeWidth="2.2"
        strokeOpacity="0.45"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

/* --- shared ------------------------------------------------------ */

/** A crumb. Shared by every flavour — a cookie crumb is a cookie crumb. */
function Crumb({ p, className }: SpriteProps) {
  return (
    <Frame className={className}>
      <path
        d="M26 34 L56 24 L78 42 L70 68 L42 76 L22 56 Z"
        fill={p.mid}
        stroke={p.line}
        strokeWidth="2.2"
        strokeOpacity="0.45"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="46" r="4" fill={p.deep} opacity="0.4" />
      <circle cx="60" cy="57" r="3" fill={p.deep} opacity="0.3" />
    </Frame>
  );
}

const SPRITES: Record<SpriteId, (props: SpriteProps) => React.ReactElement> = {
  "coconut-half": CoconutHalf,
  "coconut-chunk": CoconutChunk,
  "coconut-flake": CoconutFlake,
  "palm-leaf": PalmLeaf,
  "peanut-shell": PeanutShell,
  "peanut-kernel": PeanutKernel,
  "peanut-piece": PeanutPiece,
  "cardamom-pod": CardamomPod,
  "cardamom-seed": CardamomSeed,
  "cardamom-leaf": CardamomLeaf,
  "butter-curl": ButterCurl,
  "butter-pat": ButterPat,
  crumb: Crumb,
};

/** Draws one sprite by id, so callers can stay data-driven. */
export default function IngredientSprite({
  id,
  palette,
  className,
}: {
  id: SpriteId;
  palette: SpritePalette;
  className?: string;
}) {
  const Sprite = SPRITES[id];
  return <Sprite p={palette} className={className} />;
}
