"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "motion/react";
import PackPlaceholder from "@/components/showcase/PackPlaceholder";
import { PLANE, type ShowcaseScene } from "@/lib/showcase";

/* ------------------------------------------------------------------
   The pack — the hero of the whole section.

   The artwork is placed exactly as delivered: no recolour, no redraw,
   no crop, no filter on the artwork itself. Everything below moves the
   pack around the stage; nothing touches what is printed on it.

   `drop-shadow` rather than `box-shadow`, the same as the hero's
   `ProductStage`: the shadow has to follow the cut-out silhouette, not
   the bounding box, or the pack reads as a sticker laid on the page.

   HANDOVER. The pack rises through the frame — it waits low and to the
   right, settles at centre, and lifts away high and left. Because that
   travel is signed by `flow` while the fade is driven by the unsigned
   `presence`, the outgoing and incoming packs are never at the same
   place at the same scale, which is what stops the crossfade reading as
   two packs printed over each other. The focus pull does the rest: the
   one that is leaving goes soft as it goes, so at the midpoint you read
   depth rather than a double exposure.

   Rotation is capped at 3.2 degrees. A pack shot is a photographed
   object with its own perspective baked in; rotating it far enough to
   notice fights that perspective and immediately looks like a sticker
   being waved about.
   ------------------------------------------------------------------ */

const SHADOW =
  "drop-shadow-[0_8px_14px_rgba(42,24,16,0.18)] drop-shadow-[0_24px_36px_rgba(42,24,16,0.24)] drop-shadow-[0_50px_70px_rgba(42,24,16,0.20)]";

/**
 * The pack's own idle float, through the shared `ingredient-float`
 * keyframe. Much slower and much shallower than any ingredient — enough that
 * it never sits perfectly still, not enough to read as movement.
 */
const IDLE: CSSProperties = {
  "--f-y": "11px",
  "--f-rot": "0.8deg",
  "--f-scale": 1.008,
  "--f-dur": "9.4s",
  "--f-delay": "-2.2s",
} as CSSProperties;

export default function ProductPackage({
  scene,
  presence,
  flow,
  ink,
  animate,
  eager,
}: {
  scene: ShowcaseScene;
  presence: MotionValue<number>;
  flow: MotionValue<number>;
  /** the pack's own fade — ramps pulled apart so the two hand over, see `useSceneMotion` */
  ink: MotionValue<number>;
  animate: boolean;
  /** the first scene's pack is the one on screen when the section is reached */
  eager: boolean;
}) {
  /*
   * Ink, not presence. The pack is the one element on the stage that must
   * never share the frame with its own replacement, and `useSceneMotion`
   * carries the reasoning for why a plain crossfade cannot deliver that.
   */
  const opacity = useTransform(ink, [0, 0.35, 1], [0, 0.22, 1]);
  const scale = useTransform(presence, [0, 1], [0.8, 1]);

  /*
   * TRAVEL IS WHAT ACTUALLY SEPARATES THEM, and it has to be big. This started
   * at 7% and 15% and it was not close to enough: at the midpoint of a
   * handover the two packs sat almost concentric at matching ink, and the
   * frame read as one pack photographed twice. At 22% and 26% of the pack's
   * own size the outgoing one is up and left by a good hundred pixels while
   * the incoming one is still down and right by the same, so even where their
   * inks cross you read two objects moving through the frame — which is the
   * thing that was being described all along.
   *
   * Signed by `flow`, so the pack passes THROUGH: it waits low-right, settles
   * at centre, leaves high-left. It never reverses out the way it came.
   */
  const y = useTransform(flow, [1, 0, -1], ["26%", "0%", "-24%"]);
  const x = useTransform(flow, [1, 0, -1], ["22%", "0%", "-20%"]);
  const rotate = useTransform(flow, [1, 0, -1], [3.4, 0, -3.4]);

  /*
   * Focus and exposure together, in one filter string so the browser composes
   * them once. Both land on zero-effect by presence 0.72 rather than 1, so the
   * pack is fully sharp and fully lit for the whole hold — a filter that is
   * still resolving through the middle of a beat is a filter running when
   * nothing is happening, which is the expensive kind.
   *
   * 6px, not the 11 this started at. Measured on the real thing: at the
   * halfway point of a handover BOTH packs are part-blurred at once, and at 11
   * the frame turned to soup — the ingredients smeared, the ground went flat,
   * and for about 40vh of scrolling there was nothing on screen to look at.
   * A focus pull has to leave something in focus.
   */
  const blur = useTransform(presence, [0, 0.35, 0.72, 1], [6, 2.4, 0, 0]);
  const brightness = useTransform(presence, [0, 0.4, 0.72, 1], [0.94, 0.98, 1, 1]);
  const filter = useMotionTemplate`blur(${blur}px) brightness(${brightness})`;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ zIndex: PLANE.pack }}
    >
      <motion.div
        /*
         * Sized against BOTH axes. A width alone overflows a short wide
         * desktop — at 34vw on a 1440x700 the pack would stand 515px tall in a
         * 700px frame with copy above and below it. A height alone does the
         * same thing on a phone, from the other side.
         */
        className="w-[min(80vw,42vh)] md:w-[min(34vw,50vh)]"
        style={
          animate
            ? {
                opacity,
                scale,
                x,
                y,
                rotate,
                filter,
                willChange: "transform, opacity",
              }
            : { opacity }
        }
      >
        {/* inner element carries the CSS float, so the two transforms never
            overwrite each other — see IngredientLayer for the full note */}
        <div className="ingredient-float relative" style={IDLE}>
          {/* Ground contact shadow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[4%] left-1/2 h-[7%] w-[84%] -translate-x-1/2 rounded-[50%] bg-[#2a1810]/28 blur-xl md:-bottom-[5%] md:h-[8%] md:w-[88%] md:blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[1%] left-1/2 h-[3.5%] w-[62%] -translate-x-1/2 rounded-[50%] bg-[#1a0e08]/35 blur-md"
          />

          {scene.pack ? (
            <Image
              src={scene.pack.src}
              alt={scene.pack.alt}
              width={scene.pack.width}
              height={scene.pack.height}
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width: 767px) 72vw, 34vw"
              className={`relative h-auto w-full ${SHADOW}`}
            />
          ) : (
            <PackPlaceholder scene={scene} />
          )}
        </div>
      </motion.div>
    </div>
  );
}
