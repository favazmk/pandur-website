"use client";

import type { CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { CADENCE, PLANE, type ShowcaseScene } from "@/lib/showcase";
import {
  FLAVOUR_PROPS,
  cropStyle,
  type ShowcaseProp,
} from "@/lib/showcaseProps";

/* ------------------------------------------------------------------
   The loose ingredients, on two planes around the pack.

   Every piece is a window onto one delivered sheet — see
   `lib/showcaseProps.ts` for the boxes and the whole layout table.
   This file knows how a prop MOVES and nothing about which props
   exist or where they sit.

   FOUR ELEMENTS, FOUR TRANSFORMS, and that is not one div too many.
   `transform` is a single property: two animations writing it on one
   element means each overwrites the other every frame. So the nesting
   splits the four jobs that all want it —

     place    left/top/width from the data, and the half-shift that
              makes those coordinates the prop's CENTRE rather than
              its top-left corner
     parallax one slow drift across the whole section, scroll-driven
     handover the outward opening and closing as flavours change,
              plus the fade
     float    the idle breathing, a CSS keyframe on its own timeline

   — and the innermost element carries the artwork and its resting
   angle. Only `place` ever causes layout; the other three are
   transform and opacity, which is to say the compositor.

   THE DRIFT DIRECTION IS NOT IN THE DATA. It is computed from where
   the prop sits: away from the centre of the stage, which is where
   the pack is. That way a prop cannot be given a drift that sends it
   across the pack instead of away from it, and moving a prop in the
   table moves its exit with it.
   ------------------------------------------------------------------ */

/**
 * The corner dissolves, for the few windows that keep a soft sliver of the
 * piece next door. A gradient run diagonally OUT of the offending corner, so
 * the sliver goes and the prop's own silhouette — which never reaches that
 * corner, or the window would not have been chosen — is untouched.
 */
const FADE = {
  tr: "linear-gradient(to bottom left, transparent 0 14%, #000 31%)",
  tl: "linear-gradient(to bottom right, transparent 0 14%, #000 31%)",
  br: "linear-gradient(to top left, transparent 0 14%, #000 31%)",
  bl: "linear-gradient(to top right, transparent 0 14%, #000 31%)",
} as const;

/**
 * Unit vector from the stage's centre to the prop, times its own drift
 * strength — how far, and which way, it opens on a handover.
 *
 * The `|| 1` guards a prop placed exactly at the centre: nothing in the table
 * is, but a zero-length vector would produce `NaN` percentages rather than a
 * visibly wrong position, and a silent NaN is the harder bug.
 */
function outward({ place, drift }: ShowcaseProp): [number, number] {
  const dx = place.x - 50;
  const dy = place.y - 50;
  const len = Math.hypot(dx, dy) || 1;
  const reach = 78 * drift;
  return [(dx / len) * reach, (dy / len) * reach];
}

function Piece({
  prop,
  progress,
  presence,
  spread,
  animate,
}: {
  prop: ShowcaseProp;
  /** whole-section scroll, 0-1 — the parallax runs off this, not off the scene */
  progress: MotionValue<number>;
  presence: MotionValue<number>;
  /** 1 away → 0 settled → 1 away. Unsigned: a piece leaves the way it came. */
  spread: MotionValue<number>;
  animate: boolean;
}) {
  const [dx, dy] = outward(prop);

  const x = useTransform(spread, [0, 1], ["0%", `${dx}%`]);
  const y = useTransform(spread, [0, 1], ["0%", `${dy}%`]);
  const rotate = useTransform(spread, [0, 1], [0, prop.spin]);
  const scale = useTransform(spread, [0, 1], [1, 0.64]);

  /*
   * The fade is front-loaded, and that is the point: the ingredients are the
   * only thing left carrying the frame through a handover. The pack hands over
   * with its ramps pulled apart (see `useSceneMotion`) and the giant word fades
   * hard, both so that neither ever double-exposes — which leaves a short
   * window at the boundary with nothing in it unless something fills it.
   * Holding the props near full ink from about a third of the way in means both
   * flavours' ingredients are on screen through that window, one set drifting
   * outward and the other closing in.
   */
  const opacity = useTransform(
    presence,
    [0, 0.35, 1],
    [0, prop.opacity * 0.8, prop.opacity],
  );

  /* The parallax: one slow pass up the frame across the entire section,
     independent of which flavour is showing. Signed, so it reads as the layer
     sitting behind the page rather than as the prop moving on its own. */
  const parallax = useTransform(
    progress,
    [0, 1],
    [`${prop.parallax}%`, `${-prop.parallax}%`],
  );

  const c = CADENCE[prop.cadence % CADENCE.length];
  const m = prop.mobile ?? prop.place;

  return (
    <div
      className={`showcase-prop absolute -translate-x-1/2 -translate-y-1/2 ${
        prop.mobile ? "" : "hidden md:block"
      }`}
      style={
        {
          "--p-x": `${m.x}%`,
          "--p-y": `${m.y}%`,
          "--p-w": `${m.size}%`,
          "--p-x-md": `${prop.place.x}%`,
          "--p-y-md": `${prop.place.y}%`,
          "--p-w-md": `${prop.place.size}%`,
        } as CSSProperties
      }
    >
      <motion.div style={animate ? { y: parallax } : undefined}>
        <motion.div
          style={
            animate
              ? { x, y, rotate, scale, opacity, willChange: "transform, opacity" }
              : { opacity: prop.opacity }
          }
        >
          <div
            className="ingredient-float"
            style={
              {
                filter: prop.blur ? `blur(${prop.blur}px)` : undefined,
                "--f-y": `${c.y}px`,
                "--f-rot": `${c.rot}deg`,
                "--f-scale": c.scale,
                "--f-dur": `${c.duration}s`,
                "--f-delay": `${c.delay}s`,
              } as CSSProperties
            }
          >
            <div
              style={{
                ...cropStyle(prop.crop),
                transform: `rotate(${prop.rotate}deg)`,
                ...(prop.fade
                  ? {
                      maskImage: FADE[prop.fade],
                      WebkitMaskImage: FADE[prop.fade],
                    }
                  : null),
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function IngredientLayer({
  scene,
  plane,
  progress,
  presence,
  spread,
  animate,
}: {
  scene: ShowcaseScene;
  plane: "back" | "front";
  progress: MotionValue<number>;
  presence: MotionValue<number>;
  spread: MotionValue<number>;
  animate: boolean;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: plane === "back" ? PLANE.back : PLANE.front }}
    >
      {FLAVOUR_PROPS[scene.id]
        .filter((p) => p.plane === plane)
        .map((prop) => (
          <Piece
            key={prop.name}
            prop={prop}
            progress={progress}
            presence={presence}
            spread={spread}
            animate={animate}
          />
        ))}
    </div>
  );
}
