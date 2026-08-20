"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import Marquee from "@/components/motion/Marquee";
import { SplitLine } from "@/components/motion/Text";
import { CookieDoodle } from "@/components/brand/Marks";
import ScrubVideo from "@/components/hero/ScrubVideo";
import { ease } from "@/lib/motion";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/useMedia";

const TICKER = "MADE IN KHORFAKKAN · UAE · 45 YEARS · MADE TO GROW · ";

const VIDEO = "/hero/cookie.mp4";
const POSTER = "/hero/cookie-poster.jpg";
const STILL = "/hero/cookie-still.jpg";

/*
 * Three lines against the film's three beats: the cookie falls in, the
 * ingredients arrive around it, it lands beside the tea. Each line is about
 * what is on screen while it is up, which is the only reason to sync copy to
 * footage at all.
 *
 * `at` is where the line reaches full strength; they cross-fade between.
 */
const BEATS = [
  { at: 0.06, text: "Four signature flavours, baked in Khorfakkan." },
  { at: 0.46, text: "Butter, coconut, peanut and green cardamom." },
  { at: 0.86, text: "Six months on shelf, without trading away taste." },
];

/** How long a beat takes to hand over to the next. */
const FADE = 0.16;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  /*
   * 320vh. The film is ten seconds, and a shorter track makes a normal scroll
   * tear through it — the ingredient beat would pass in a flick of the wheel.
   * Two extra screens is roughly a second of footage per half-screen scrolled.
   *
   * Off on mobile and under reduced motion. Scrubbing needs the whole file
   * decoded and seekable, which is a poor trade on a phone, and pinning for
   * three screens is exactly what reduced motion asks us not to do.
   */
  const scrub = !mobile && !reduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Copy holds through the film, then lifts away as the hero releases.
  const copyY = useTransform(scrollYProgress, [0.86, 1], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0.88, 0.99], [1, 0]);
  const tickerX = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Hooks cannot run inside a loop, so the three are written out.
  const b0 = useTransform(
    scrollYProgress,
    [BEATS[0].at, BEATS[0].at + FADE],
    [1, 0]
  );
  const b1 = useTransform(
    scrollYProgress,
    [BEATS[1].at - FADE, BEATS[1].at, BEATS[1].at + FADE],
    [0, 1, 0]
  );
  const b2 = useTransform(
    scrollYProgress,
    [BEATS[2].at - FADE, BEATS[2].at],
    [0, 1]
  );
  const beatOpacity = [b0, b1, b2];

  return (
    <section
      ref={ref}
      className="relative"
      style={scrub ? { height: "320vh" } : undefined}
    >
      <div
        className={
          scrub
            ? "sticky top-0 flex h-screen flex-col overflow-hidden"
            : "relative flex min-h-[100svh] flex-col overflow-hidden"
        }
      >
        {/*
         * --- the film ---
         *
         * Full-bleed below `lg`, where the copy sits under it. From `lg` it
         * takes the right column only, because the cookie is centred in its
         * own frame and a full-bleed centre subject lands squarely on
         * left-aligned type.
         *
         * Pushing a full-bleed frame rightward instead would mean scaling a
         * 1280px source past 2100px to keep the edges covered — a 3x upscale
         * on footage that is already soft at this size. Confined to the right
         * column it renders around 800px wide, which is a DOWNSCALE of the
         * source and therefore sharper than what is on the page now.
         *
         * The left edge is feathered rather than cut. The film's own ground is
         * cream, so it dissolves into the page instead of reading as a panel.
         */}
        <div
          aria-hidden
          className="absolute inset-0 z-scene lg:left-[52%] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_18%)]"
        >
          {scrub ? (
            <ScrubVideo
              targetRef={ref}
              src={VIDEO}
              poster={POSTER}
              className="h-full w-full object-cover"
            />
          ) : (
            /*
             * No video at all where it cannot be scrubbed — downloading 2.6MB
             * to hold on a single frame is not a trade worth making. The still
             * is the cookie whole and centred, so it reads as a finished image
             * rather than a paused one.
             */
            <Image
              src={STILL}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>

        {/*
         * Cream scrim. The copy sits over footage that changes under it for
         * ten seconds — at the ingredient beat the middle of the frame fills
         * with pods and butter curls. Legibility cannot depend on what the
         * film happens to be doing. Because the film's own ground is cream
         * this reads as light rather than as a panel.
         *
         * Small screens only. From `lg` the film is in the right column and
         * the copy sits on plain cream, so a scrim would have nothing to
         * protect and would only dull the film's edge.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-scene bg-[linear-gradient(to_top,var(--color-cream)_0%,rgba(251,245,236,0.82)_26%,transparent_62%)] lg:bg-none"
        />

        {/* --- copy --- */}
        <motion.div
          className="relative z-content mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-6 text-center lg:justify-center lg:pb-0 lg:text-left"
          style={scrub ? { y: copyY, opacity: copyOpacity } : undefined}
        >
          <motion.p
            className="text-eyebrow mb-6 text-ash"
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.28em" }}
            transition={{ delay: 0.5, duration: 1.2, ease: ease.expo }}
          >
            Royal Quality Bakes · Khorfakkan
          </motion.p>

          {/*
           * Fixed across every beat. It is the page's one heading and its text
           * is what a crawler and a screen reader are given; rewriting it
           * mid-scroll would make the accessible name of the page depend on
           * scroll position. The line below is what carries the film.
           */}
          <h1 className="text-hero-split max-w-[13ch] font-display font-black text-balance text-ink lg:max-w-[16ch]">
            <SplitLine
              text="Cookies worth"
              className="block"
              delay={0.35}
              stagger={0.05}
              once
            />
            <SplitLine
              text="the shelf space."
              className="block"
              delay={0.55}
              stagger={0.05}
              accentLast
              once
            />
          </h1>

          {/*
           * Fixed-height box with the three lines stacked and cross-faded.
           * Swapping them in the flow would reflow the copy column on every
           * scroll frame.
           */}
          <div className="relative mt-7 h-[4.5rem] sm:h-[3.5rem]">
            {BEATS.map((b, i) => (
              <motion.p
                key={b.at}
                className="text-lead absolute inset-x-0 max-w-md text-ash lg:mx-0"
                style={
                  scrub
                    ? { opacity: beatOpacity[i] }
                    : { opacity: i === 0 ? 1 : 0 }
                }
                aria-hidden={i === 0 ? undefined : true}
              >
                {b.text}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* --- scroll cue --- */}
        <motion.div
          className="relative z-content flex justify-center pb-4"
          style={scrub ? { opacity: copyOpacity } : undefined}
        >
          <motion.div
            className="animate-bob"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.8, ease: ease.pop }}
          >
            <CookieDoodle className="h-9 w-9 text-ink/45" strokeWidth={5} />
          </motion.div>
        </motion.div>

        {/* --- ticker --- */}
        <motion.div
          className="relative z-content"
          style={scrub ? { x: tickerX } : undefined}
        >
          <Marquee
            speed={80}
            className="border-y border-ink/12 bg-cream/70 py-3"
            itemClassName="text-eyebrow whitespace-pre text-ink/65"
            repeat={3}
          >
            {TICKER}
          </Marquee>
        </motion.div>
      </div>
    </section>
  );
}
