"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import Marquee from "@/components/motion/Marquee";
import { SplitLine } from "@/components/motion/Text";
import { CookieDoodle } from "@/components/brand/Marks";
import ScrubVideo from "@/components/hero/ScrubVideo";
import { ease } from "@/lib/motion";
import {
  useClientValue,
  useIsMobile,
  usePrefersReducedMotion,
} from "@/lib/useMedia";

const TICKER = "MADE IN KHORFAKKAN · UAE · 45 YEARS · MADE TO GROW · ";

/**
 * Two cuts of the same film, framed for their own shape rather than one cut
 * cropped to both. Each carries its own poster, taken from its own first
 * frame, so nothing jumps when the video takes over from the still.
 */
const FILM = {
  desktop: {
    src: "/hero/hero-desktop.mp4",
    poster: "/hero/hero-desktop-poster.jpg",
  },
  mobile: {
    src: "/hero/hero-mobile.mp4",
    poster: "/hero/hero-mobile-poster.jpg",
  },
} as const;

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
   * The film is chosen by breakpoint, and `useIsMobile` only tells the truth
   * after hydration — so the video is not rendered until then. Otherwise the
   * server's guess (desktop) starts downloading on a phone and gets cancelled
   * a moment later, which is 2MB of wasted request on the connection least
   * able to afford it. The poster covers that gap and is what a reduced-motion
   * visitor keeps.
   *
   * `useClientValue` rather than a setState-in-effect: it is the module's own
   * helper over `useSyncExternalStore`, which gives React an explicit server
   * snapshot instead of a cascading render after mount.
   */
  const mounted = useClientValue(() => true, false);

  const film = mobile ? FILM.mobile : FILM.desktop;
  const scrub = mounted && !reduced;

  /*
   * 320vh. The film is nine and a half seconds, and a shorter track makes a
   * normal scroll tear through it — the ingredient beat would pass in a flick
   * of the wheel.
   */
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
        {/* --- the film, full bleed --- */}
        <div aria-hidden className="absolute inset-0 z-scene">
          {scrub ? (
            <ScrubVideo
              targetRef={ref}
              src={film.src}
              poster={film.poster}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={film.poster}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>

        {/*
         * Top-down scrim.
         *
         * The copy is centred now, and so is the film — the cookie travels
         * straight through the middle of the frame and the ingredients open
         * out around it. There is no still corner to hide the type in, so
         * legibility cannot depend on what the film is doing at that moment.
         *
         * It runs to cream at the very top and clears by 58%, which keeps the
         * plate and tea at the end of the film untouched.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-scene bg-[linear-gradient(to_bottom,var(--color-cream)_0%,rgba(251,245,236,0.88)_18%,rgba(251,245,236,0.6)_34%,rgba(251,245,236,0.24)_46%,transparent_58%)]"
        />

        {/* --- copy --- */}
        <motion.div
          className="relative z-content mx-auto w-full max-w-7xl px-6 pt-[15vh] text-center md:pt-[13vh]"
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
          <h1 className="text-hero-split mx-auto max-w-[13ch] font-display font-black text-balance text-ink">
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
           * Swapping them in the flow would reflow the copy on every scroll
           * frame.
           */}
          <div className="relative mx-auto mt-7 h-[4.5rem] max-w-md sm:h-[3.5rem]">
            {BEATS.map((b, i) => (
              <motion.p
                key={b.at}
                className="text-lead absolute inset-x-0 text-ash"
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
          className="relative z-content mt-auto flex justify-center pb-4"
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
            className="border-y border-ink/12 py-3"
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
