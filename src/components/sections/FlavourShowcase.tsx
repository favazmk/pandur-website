"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import BackgroundLayer, {
  SceneWash,
} from "@/components/showcase/ShowcaseBackground";
import FlavourWordmark from "@/components/showcase/FlavourWordmark";
import IngredientLayer from "@/components/showcase/IngredientLayer";
import ProductPackage from "@/components/showcase/ProductPackage";
import { useSceneMotion } from "@/components/showcase/useSceneMotion";
import { PLANE, SCENES, type ShowcaseScene } from "@/lib/showcase";
import { useClientValue, usePrefersReducedMotion } from "@/lib/useMedia";

/* ==================================================================
   FLAVOUR SHOWCASE — one pinned section, four flavours, one timeline.

   Sits directly under the stat band. The section is tall; the stage
   inside it is `sticky` and one viewport high, so the page scrolls
   past while the composition stays put and the scroll position drives
   every value in it. Nothing in here is time-based and nothing plays
   on its own — scroll forwards and it runs forwards, scroll back and
   it runs back, stop and it stops.

   Each flavour owns a quarter of the track. The handovers straddle the
   boundaries rather than landing on them, so at no point does one
   flavour finish before the next begins; see `BLEND` in
   `lib/showcase.ts` for the exact beat.

   LAYERS. Every scene contributes its five planes as SIBLINGS of the
   stage, not as a nested per-scene wrapper. That matters: it puts all
   four scenes' planes into one stacking context, so during a handover
   the incoming pack can sit above the outgoing one while still passing
   under its own front ingredients. Nesting each scene would trap its
   planes in a private context and flatten the whole handover.

       ground  →  word  →  back ingredients  →  PACK  →  front  →  copy

   PERFORMANCE. There is no React state anywhere in this section and no
   scroll listener of its own. `useScroll` produces one MotionValue and
   everything else is a transform composed off it, which means a scroll
   frame writes transforms and opacities and never renders a component.

   ACCESSIBILITY. The moving copy is `aria-hidden` and the four
   flavours are also written out plainly, once, in a visually hidden
   list — the same approach the hero takes with its scrubbing headline.
   Content that only exists at one scroll position is content a screen
   reader cannot reach.
   ================================================================== */

const N = SCENES.length;

/* ------------------------------------------------------------------ *
 * Per-scene copy
 * ------------------------------------------------------------------ */

function SceneCopy({
  scene,
  index,
  presence,
  flow,
  animate,
}: {
  scene: ShowcaseScene;
  index: number;
  presence: MotionValue<number>;
  flow: MotionValue<number>;
  animate: boolean;
}) {
  /*
   * The copy windows DO NOT TOUCH, and that is deliberate — it is the rule the
   * hero's beats already follow. Two flavour names crossfading through each
   * other at display size does not read as a transition, it reads as a
   * rendering fault: at the midpoint of a handover both scenes sit at 0.5
   * presence, and a linear fade puts "Coconut" and "Peanut" on top of one
   * another at half ink each. Holding the copy at zero until presence passes
   * 0.62 means the outgoing line is fully gone before the incoming one starts,
   * with a short empty beat between them.
   */
  const opacity = useTransform(presence, [0, 0.62, 0.86, 1], [0, 0, 1, 1]);
  const y = useTransform(flow, [1, 0, -1], [26, 0, -22]);

  /*
   * The letter-spacing move the brief asked for, put on the eyebrow rather
   * than on the giant word. Here it is one short line of small caps, so the
   * relayout is trivial; on a full-width line of display type it would be a
   * layout pass per scroll frame.
   */
  const track = useTransform(presence, [0, 1], [0.46, 0.28]);
  const letterSpacing = useMotionTemplate`${track}em`;

  const nameBlock = (
    <>
      <motion.span
        className="block text-[clamp(0.68rem,0.9vw,0.8rem)] font-bold uppercase"
        style={{ color: scene.accent, letterSpacing }}
      >
        {scene.ingredient}
      </motion.span>

      {/*
       * The flavour's beauty shot, set to the right of its name.
       *
       * A CUT-OUT, NOT A CARD. It carries its own alpha, so it sits straight
       * on whichever ground the scene is painting — no frame, no fill, no
       * hairline. `drop-shadow` for the same reason `ProductPackage` uses it:
       * the shadow has to follow two cookies and a scatter of loose
       * ingredients, and a `box-shadow` would draw the rectangle they sit in.
       *
       * WIDTHS ARE BOUND BY THE NAME, NOT BY TASTE. The copy column is
       * `24rem`, capped at `32vw`, and the flavour name takes the rest of it —
       * "Cardamom" at the top of the type scale runs about 232px. 5.5rem holds
       * from `md`, where the column is at its narrowest relative to the type;
       * 7.5rem is what is left over at `lg` and above.
       *
       * The row is `items-end`: the shots are cropped to their own artwork and
       * so differ in height, and hanging them from a shared top edge leaves
       * each one floating a different distance above the name's baseline.
       */}
      <div className="mt-2 flex items-end justify-center gap-3 md:justify-start md:gap-4">
        <span className="text-title block font-display font-black text-ink">
          {scene.name}
        </span>
        <Image
          src={scene.shot.src}
          alt=""
          width={scene.shot.width}
          height={scene.shot.height}
          sizes="(max-width: 1023px) 88px, 120px"
          className="h-auto w-[5.5rem] shrink-0 drop-shadow-[0_10px_16px_rgba(58,35,24,0.18)] lg:w-[7.5rem]"
        />
      </div>
    </>
  );

  const noteBlock = (
    <>
      <span className="text-lead block text-ink/70">{scene.note}</span>
      <span
        className="mt-3 block text-[clamp(0.62rem,0.8vw,0.72rem)] font-bold tracking-[0.3em] tabular-nums"
        style={{ color: scene.accent }}
      >
        {String(index + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
      </span>
    </>
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={
        animate
          ? { zIndex: PLANE.copy, opacity, y, willChange: "transform, opacity" }
          : { zIndex: PLANE.copy, opacity }
      }
    >
      {/*
       * mobile 9:16 — name above the pack, note below it, neither over it.
       *
       * 13% rather than the 8% this started at. The stage's own chrome sits
       * across the top and at 8% the eyebrow landed about twenty pixels under
       * "ALL FOUR": not an overlap, but close enough that the two rows read as
       * one crowded block instead of as chrome and content.
       */}
      <div className="absolute inset-x-0 top-[13%] px-6 text-center md:hidden">
        {nameBlock}
      </div>
      <div className="absolute inset-x-0 bottom-[15%] px-6 text-center md:hidden">
        {noteBlock}
      </div>

      {/* desktop — one editorial column down the left, clear of the pack */}
      <div className="absolute bottom-[13%] left-10 hidden w-[24rem] max-w-[32vw] md:block lg:left-16">
        {nameBlock}
        <div className="mt-5">{noteBlock}</div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * One scene — every plane it owns, flat into the stage
 * ------------------------------------------------------------------ */

function Scene({
  scene,
  index,
  progress,
  animate,
}: {
  scene: ShowcaseScene;
  index: number;
  progress: MotionValue<number>;
  animate: boolean;
}) {
  const { presence, flow, spread, ink } = useSceneMotion(progress, index, N);

  return (
    <>
      <SceneWash scene={scene} presence={presence} />

      <div className="absolute inset-0" style={{ zIndex: PLANE.word }}>
        <FlavourWordmark
          scene={scene}
          presence={presence}
          flow={flow}
          animate={animate}
        />
      </div>

      <IngredientLayer
        scene={scene}
        plane="back"
        progress={progress}
        presence={presence}
        spread={spread}
        animate={animate}
      />

      <ProductPackage
        scene={scene}
        presence={presence}
        flow={flow}
        ink={ink}
        animate={animate}
        eager={index === 0}
      />

      <IngredientLayer
        scene={scene}
        plane="front"
        progress={progress}
        presence={presence}
        spread={spread}
        animate={animate}
      />

      <SceneCopy
        scene={scene}
        index={index}
        presence={presence}
        flow={flow}
        animate={animate}
      />
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Progress rail
 * ------------------------------------------------------------------ */

/** One tick, filling with its own scene's presence. */
function RailTick({
  scene,
  index,
  progress,
}: {
  scene: ShowcaseScene;
  index: number;
  progress: MotionValue<number>;
}) {
  const { presence } = useSceneMotion(progress, index, N);

  return (
    <span className="block h-[3px] w-9 overflow-hidden rounded-full bg-ink/15 md:w-12">
      <motion.span
        className="block h-full w-full origin-left rounded-full"
        style={{ backgroundColor: scene.accent, scaleX: presence }}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * The section
 * ------------------------------------------------------------------ */

export default function FlavourShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  /*
   * `useClientValue` over `useSyncExternalStore`, the same helper the hero
   * uses: it gives React an explicit server snapshot, so there is no hydration
   * mismatch and no cascading render on mount.
   */
  const mounted = useClientValue(() => true, false);
  const animate = mounted && !reduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /*
   * A light spring over the raw progress. Lenis already smooths the scroll
   * itself, so this is not about smoothing — it is about the last pixel of a
   * trackpad flick, where the raw value jitters and four crossfading layers
   * amplify it into a visible shimmer. Stiff and heavily damped so it settles
   * inside a frame or two and never reads as lag.
   *
   * `restDelta` has to be set. The default is 0.01, which on a value whose
   * whole range is 0→1 is a full percent of the section — the spring would
   * call itself finished a quarter of a flavour early.
   */
  const damped = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    mass: 0.3,
    restDelta: 0.0001,
  });

  /* Reduced motion takes the raw value: nothing should lag behind the scroll
     for someone who asked the interface to stop moving on its own. */
  const progress = reduced ? scrollYProgress : damped;

  /* Chrome takes the active flavour's accent, interpolated the same way the
     ground is — so the rules and labels belong to the flavour on screen. */
  const stops = [0, ...SCENES.map((_, i) => (i + 0.5) / N), 1];
  const chrome = useTransform(progress, stops, [
    SCENES[0].accent,
    ...SCENES.map((s) => s.accent),
    SCENES[N - 1].accent,
  ]);

  return (
    <section
      ref={ref}
      id="flavour-showcase"
      aria-labelledby="flavour-showcase-title"
      /*
       * `showcase-track` in globals.css carries the height: 460vh on a phone,
       * 520vh from `md`, and 240vh under reduced motion. It lives there rather
       * than here because the reduced-motion case has to be decided in CSS —
       * deciding it from the `reduced` hook would resize the section after
       * hydration and drag the scroll position with it.
       *
       * At full length the stage is pinned for 420vh and each flavour owns
       * about 105vh of scrolling. Shorter than that and a single trackpad
       * flick takes a flavour and a half with it; the handovers stop being
       * readable and the section turns into the slideshow it exists not to be.
       */
      className="showcase-track relative"
    >
      <h2 id="flavour-showcase-title" className="sr-only">
        The four Pandur flavours
      </h2>

      {/*
       * The flavours as plain content. Everything painted below is decorative
       * and scroll-dependent; this is the version that exists at every scroll
       * position, for a screen reader and for a crawler.
       */}
      <ul className="sr-only">
        {SCENES.map((s) => (
          <li key={s.id}>
            {s.name} — {s.ingredient}. {s.note}
          </li>
        ))}
      </ul>

      <div
        /*
         * `isolate` gives the stage its own stacking context, which is what
         * lets `PLANE` be a local five-step ladder without meeting the
         * semantic `--z-index-*` ladder in globals.css.
         *
         * `overflow-hidden` is load-bearing, not tidiness: ingredients are
         * placed with negative offsets and the word scales to 1.14 mid
         * handover, both of which would otherwise widen the page's scrollable
         * area. Clipping them is invisible; the horizontal scrollbar is not.
         */
        className="sticky top-0 isolate h-screen w-full overflow-hidden"
      >
        <BackgroundLayer progress={progress} scenes={SCENES} />

        {SCENES.map((scene, i) => (
          <Scene
            key={scene.id}
            scene={scene}
            index={i}
            progress={progress}
            animate={animate}
          />
        ))}

        {/* --- chrome: fixed to the stage, shared by all four scenes --- */}
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-8 md:px-10 md:pt-10 lg:px-16"
          style={{ zIndex: PLANE.copy }}
        >
          <motion.span
            className="text-eyebrow"
            style={{ color: chrome }}
            aria-hidden
          >
            Our signature range
          </motion.span>

          <motion.a
            href="/products"
            /* `min-h-11` is the 44px touch minimum; `py-2` alone left it 32px
               tall, and this is the section's only outbound link. */
            className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[clamp(0.6rem,0.8vw,0.7rem)] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-cream"
            style={{ color: chrome, borderColor: chrome }}
          >
            Explore our products
            <span aria-hidden>↗</span>
          </motion.a>
        </div>

        <div
          aria-hidden
          className="absolute bottom-[6%] left-1/2 flex -translate-x-1/2 gap-2 md:bottom-10 md:left-auto md:right-10 md:translate-x-0 lg:right-16"
          style={{ zIndex: PLANE.copy }}
        >
          {SCENES.map((s, i) => (
            <RailTick key={s.id} scene={s} index={i} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  );
}
