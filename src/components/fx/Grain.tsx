"use client";

/**
 * Full-page film grain.
 *
 * This single pass is what stops the WebGL reading as "a demo" — it unifies the
 * canvas and the DOM under one texture. SVG feTurbulence keeps it asset-free.
 * Hidden entirely under prefers-reduced-motion (see globals.css).
 */
export default function Grain() {
  return (
    <div
      aria-hidden
      className="grain-layer pointer-events-none fixed inset-0 z-[60] opacity-[0.16] mix-blend-multiply"
    >
      <svg className="absolute inset-0 h-full w-full">
        <filter id="pandur-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#pandur-grain)"
          className="animate-grain"
          style={{ transformOrigin: "center" }}
        />
      </svg>
    </div>
  );
}
