import type { FlavourSlug } from "@/lib/assets";

/* ------------------------------------------------------------------
   One mark per flavour, drawn from its main ingredient.

   Same language as the cookie marks in `Marks.tsx`: a 200x200 viewBox,
   true stroked paths (never filled outlines), `currentColor` so each mark
   can carry its flavour's accent, and round caps and joins throughout.
   Keeping them stroked also means they can stroke-draw later if wanted.

   Silhouettes are deliberately distinct from one another — a block, a ring,
   a waisted shell, a pointed pod — so the four read apart at a glance and at
   small sizes, where interior detail disappears first.
   ------------------------------------------------------------------ */

type MarkProps = {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
};

function Svg({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      {children}
    </svg>
  );
}

/**
 * A block of butter with a pat cut from it.
 *
 * The proportions do the work: an even cube reads as a cardboard carton, so
 * the slab is deliberately wide and shallow, and the cut pat sitting on top is
 * what names it as butter rather than a box.
 */
export function ButterMark({
  className,
  stroke = "currentColor",
  strokeWidth = 5,
}: MarkProps) {
  const common = {
    stroke,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <Svg className={className}>
      {/* slab — wide and low */}
      <path d="M 34 108 L 100 78 L 166 108 L 100 138 Z" {...common} />
      <path d="M 34 108 L 34 134 L 100 164 L 100 138" {...common} />
      <path d="M 166 108 L 166 134 L 100 164" {...common} />
      {/* the pat, cut and resting on top */}
      <path d="M 66 74 L 100 58 L 134 74 L 100 90 Z" {...common} />
      <path d="M 66 74 L 66 86 L 100 102 L 100 90" {...common} />
      <path d="M 134 74 L 134 86 L 100 102" {...common} />
    </Svg>
  );
}

/** A coconut half — husk ring, white, and a few husk fibres. */
export function CoconutMark({
  className,
  stroke = "currentColor",
  strokeWidth = 5,
}: MarkProps) {
  const common = {
    stroke,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <Svg className={className}>
      {/*
       * Husk texture sits INSIDE the shell band, never radiating outward —
       * strokes pointing out from a ring read as a sun, which is what the
       * first version of this looked like.
       */}
      <circle cx="100" cy="100" r="66" {...common} />
      {/* the white, offset so the pair reads as a half seen at an angle */}
      <ellipse cx="104" cy="97" rx="38" ry="36" {...common} />
      <path
        d="M 58 128 C 66 122 72 118 80 116"
        {...common}
        strokeWidth={strokeWidth * 0.6}
      />
      <path
        d="M 50 108 C 56 100 60 94 66 90"
        {...common}
        strokeWidth={strokeWidth * 0.6}
      />
      <path
        d="M 74 146 C 82 142 88 140 96 139"
        {...common}
        strokeWidth={strokeWidth * 0.6}
      />
    </Svg>
  );
}

/** A peanut in its shell — two lobes with a waist, and shell hatching. */
export function PeanutMark({
  className,
  stroke = "currentColor",
  strokeWidth = 5,
}: MarkProps) {
  const common = {
    stroke,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <Svg className={className}>
      <path
        d="M 100 28
           C 130 28 146 50 146 72
           C 146 87 136 96 136 104
           C 136 112 146 121 146 136
           C 146 158 130 176 100 176
           C 70 176 54 158 54 136
           C 54 121 64 112 64 104
           C 64 96 54 87 54 72
           C 54 50 70 28 100 28 Z"
        {...common}
      />
      {/* shell texture — short arcs, not a grid */}
      <path
        d="M 78 62 C 90 56 110 56 122 62"
        {...common}
        strokeWidth={strokeWidth * 0.62}
      />
      <path
        d="M 76 138 C 90 132 110 132 124 138"
        {...common}
        strokeWidth={strokeWidth * 0.62}
      />
    </Svg>
  );
}

/** A cardamom pod — ridged, pointed, with a short stem. */
export function CardamomMark({
  className,
  stroke = "currentColor",
  strokeWidth = 5,
}: MarkProps) {
  const common = {
    stroke,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <Svg className={className}>
      <path
        d="M 100 40
           C 126 68 138 100 138 124
           C 138 154 121 172 100 172
           C 79 172 62 154 62 124
           C 62 100 74 68 100 40 Z"
        {...common}
      />
      {/* ridges */}
      <path d="M 100 56 L 100 166" {...common} strokeWidth={strokeWidth * 0.6} />
      <path
        d="M 79 80 C 74 108 74 138 82 160"
        {...common}
        strokeWidth={strokeWidth * 0.6}
      />
      <path
        d="M 121 80 C 126 108 126 138 118 160"
        {...common}
        strokeWidth={strokeWidth * 0.6}
      />
      {/* stem */}
      <path d="M 100 40 L 100 24" {...common} />
    </Svg>
  );
}

const MARKS = {
  butter: ButterMark,
  coconut: CoconutMark,
  peanut: PeanutMark,
  cardamom: CardamomMark,
} as const;

/**
 * Renders the mark for a flavour. Takes the slug rather than a component so
 * callers can stay data-driven — everything that knows a flavour can draw it.
 */
export default function IngredientMark({
  slug,
  className,
  stroke,
  strokeWidth,
}: MarkProps & { slug: FlavourSlug }) {
  const Mark = MARKS[slug];
  return <Mark className={className} stroke={stroke} strokeWidth={strokeWidth} />;
}
