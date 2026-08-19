"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Marquee from "@/components/motion/Marquee";
import { SplitLine } from "@/components/motion/Text";
import { CookieDoodle } from "@/components/brand/Marks";
import HeroIngredients from "@/components/hero/HeroIngredients";
import ProductStage from "@/components/hero/ProductStage";
import { BEAT, HERO_PRODUCTS } from "@/lib/heroLayers";
import { FLAVOURS } from "@/lib/assets";
import { ease } from "@/lib/motion";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/useMedia";

const TICKER = "MADE IN KHORFAKKAN · UAE · 45 YEARS · MADE TO GROW · ";

/** The two packs on show, with their flavour copy. */
const BEATS = HERO_PRODUCTS.map(
  (p) => FLAVOURS.find((f) => f.slug === p.slug)!
);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  /*
   * The pin is 150vh — one beat's worth. Off on mobile, where a hold costs a
   * third of the visitor's patience and buys a swap they can barely see, and
   * off under reduced motion, where the whole point is not to move the page
   * for them. In both cases the section is its natural height and the stage
   * renders landed.
   */
  const pinned = !mobile && !reduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const stops = [0, BEAT.hold, BEAT.swap, 1];

  // Copy holds through the swap, then lifts away ahead of the products, so
  // the two layers separate in depth on the way out.
  const copyY = useTransform(scrollYProgress, [BEAT.swap, 1], [0, -110]);
  const copyOpacity = useTransform(scrollYProgress, [BEAT.swap, 0.94], [1, 0]);
  const tickerX = useTransform(scrollYProgress, [0, 1], [0, -160]);

  // The flavour caption crosses with the pack it belongs to.
  const capA = useTransform(scrollYProgress, stops, [1, 1, 0, 0]);
  const capB = useTransform(scrollYProgress, stops, [0, 0, 1, 1]);
  const caps = [capA, capB];

  return (
    <section
      ref={ref}
      className="relative"
      style={pinned ? { height: "150vh" } : undefined}
    >
      <div
        className={
          pinned
            ? "sticky top-0 flex h-screen flex-col overflow-hidden"
            : "relative flex min-h-[100svh] flex-col overflow-hidden"
        }
      >
        {/*
         * No wash, and no doodle field either.
         *
         * The field grounds Partner and drifts through Craft; a third helping
         * here would make it the page's wallpaper rather than its signature.
         * A warm radial wash was the alternative and it had to come out: the
         * ingredient SVGs are opaque tiles whose ground is #FCF4E8, which
         * disappears against plain cream and shows as a rectangle against
         * anything else. The wash peaked exactly where the near ingredients
         * sit, so it drew a box around each of them.
         *
         * The packs are grounded by their own drop-shadow instead, which is
         * what was actually missing.
         */}

        <HeroIngredients plane="far" progress={scrollYProgress} parallax={pinned} />

        <div className="relative z-content mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-6 px-6 pt-28 md:pt-32 lg:grid-cols-2 lg:gap-10">
          {/* --- copy --- */}
          <motion.div
            className="text-center lg:text-left"
            style={pinned ? { y: copyY, opacity: copyOpacity } : undefined}
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
             * The h1 does NOT change across the swap. It is the page's one
             * heading and its text is what a crawler and a screen reader get;
             * rewriting it mid-scroll would mean the accessible name of the
             * page depends on how far down you are. The caption below is what
             * carries the beat instead.
             */}
            <h1 className="text-hero-split max-w-[13ch] font-display font-black text-balance text-ink lg:max-w-none">
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
             * Held in a fixed-height box with both captions stacked and
             * cross-faded. Swapping them in the flow would reflow the copy
             * column on every scroll frame.
             */}
            <div className="relative mt-7 h-[5.5rem] sm:h-[4.5rem]">
              {BEATS.map((f, i) => (
                <motion.div
                  key={f.slug}
                  className="absolute inset-0"
                  style={pinned ? { opacity: caps[i] } : { opacity: i === 0 ? 1 : 0 }}
                  aria-hidden={i === 0 ? undefined : true}
                >
                  <span className="text-eyebrow" style={{ color: f.accent }}>
                    {f.ingredient}
                  </span>
                  <p className="text-lead mt-2 max-w-md text-ash lg:mx-0">
                    {f.note}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* --- the packs --- */}
          <ProductStage progress={scrollYProgress} animate={pinned} />
        </div>

        <HeroIngredients plane="near" progress={scrollYProgress} parallax={pinned} />

        {/* --- scroll cue --- */}
        <motion.div
          className="relative z-content flex justify-center pb-4"
          style={pinned ? { opacity: copyOpacity } : undefined}
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
          style={pinned ? { x: tickerX } : undefined}
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
