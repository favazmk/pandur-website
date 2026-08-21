"use client";

import type { CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import IngredientSprite from "@/components/brand/IngredientSprites";
import {
  CADENCE,
  PLANE,
  SLOT_DRIFT,
  SLOT_PLACE,
  type ShowcaseIngredient,
  type ShowcaseScene,
} from "@/lib/showcase";

/* ------------------------------------------------------------------
   The loose ingredients, on two planes around the pack.

   TWO TRANSFORMS, TWO ELEMENTS. This is the same split
   `HeroIngredients` documents and it is not stylistic: the idle float
   is a CSS keyframe and the scroll drift is a Motion value, `transform`
   is one property, and putting both on one element means each
   overwrites the other every frame. Outer div takes the scroll, inner
   div takes the float.

   The scroll drift is OUTWARD. As a flavour hands over, its pieces
   open away from the pack and let the next flavour through; on the way
   in they close back around it. That is one continuous gesture read
   forwards and backwards, which is why scrolling up looks as
   deliberate as scrolling down.

   Every piece carries its own direction, distance, rotation, depth and
   float cadence from `lib/showcase.ts`, so no two ever move alike. The
   nine cadences share no small factors — a scene of seven pieces will
   not visibly re-sync inside a minute.
   ------------------------------------------------------------------ */

function Piece({
  item,
  scene,
  presence,
  spread,
  animate,
}: {
  item: ShowcaseIngredient;
  scene: ShowcaseScene;
  presence: MotionValue<number>;
  /** 1 away → 0 settled → 1 away. Unsigned: a piece leaves the way it came. */
  spread: MotionValue<number>;
  animate: boolean;
}) {
  const [dx, dy] = SLOT_DRIFT[item.slot];

  const x = useTransform(spread, [0, 1], ["0%", `${dx}%`]);
  const y = useTransform(spread, [0, 1], ["0%", `${dy}%`]);
  const rotate = useTransform(spread, [0, 1], [0, item.spin]);
  const scale = useTransform(spread, [0, 1], [1, 0.62]);

  /*
   * Depth sets the resting ink. Near pieces are close to solid, far ones sit
   * back at around half — which is what distance actually looks like on a flat
   * page. `presence` then multiplies that in and out with the scene.
   *
   * The curve is front-loaded, and that is the point: the ingredients are the
   * only thing left carrying the frame through a handover. The pack hands over
   * with its ramps pulled apart (see `useSceneMotion`) and the giant word
   * fades hard, both so that neither ever double-exposes — which leaves a
   * short window at the boundary with nothing in it unless something fills it.
   * Holding the pieces near full ink from about a third of the way in means
   * both flavours' ingredients are on screen through that window, one set
   * drifting outward and the other closing in. Which is the transition the
   * brief actually describes.
   */
  const rest = 0.5 + item.depth * 0.5;
  const opacity = useTransform(presence, [0, 0.35, 1], [0, rest * 0.8, rest]);

  const c = CADENCE[item.cadence % CADENCE.length];

  return (
    <motion.div
      className={`absolute ${SLOT_PLACE[item.slot]}`}
      style={
        animate
          ? { x, y, rotate, scale, opacity, willChange: "transform, opacity" }
          : { opacity }
      }
    >
      <div
        className="ingredient-float"
        style={
          {
            /* the one place blur is used for depth — see the note on
               `ShowcaseIngredient.blur` in lib/showcase.ts */
            filter: item.blur ? `blur(${item.blur}px)` : undefined,
            "--f-y": `${c.y}px`,
            "--f-rot": `${c.rot}deg`,
            "--f-scale": c.scale,
            "--f-dur": `${c.duration}s`,
            "--f-delay": `${c.delay}s`,
          } as CSSProperties
        }
      >
        <IngredientSprite id={item.sprite} palette={scene.palette} />
      </div>
    </motion.div>
  );
}

export default function IngredientLayer({
  scene,
  plane,
  presence,
  spread,
  animate,
}: {
  scene: ShowcaseScene;
  plane: "back" | "front";
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
      {scene.ingredients
        .filter((i) => i.plane === plane)
        .map((item) => (
          <Piece
            key={`${item.sprite}-${item.slot}`}
            item={item}
            scene={scene}
            presence={presence}
            spread={spread}
            animate={animate}
          />
        ))}
    </div>
  );
}
