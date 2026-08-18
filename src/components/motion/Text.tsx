"use client";

import { Fragment, ReactNode, useMemo } from "react";
import { motion, type TargetAndTransition } from "motion/react";
import { ease, dur } from "@/lib/motion";

/**
 * Bidirectional by default.
 *
 * `once: false` is the point of this file — content animates IN as it enters
 * the viewport and back OUT as it leaves, so scrolling up un-reveals rather
 * than leaving everything frozen on. Pass `once` where replaying would be
 * irritating (a counter, a success state).
 */
const VIEWPORT = { once: false, margin: "-12% 0px -12% 0px" } as const;
const VIEWPORT_ONCE = { once: true, margin: "-12% 0px -12% 0px" } as const;

export type RevealVariant = "rise" | "fade" | "scale" | "blur" | "wipe";

/**
 * Masked headline reveal — the site's default entrance for every heading.
 * Words rise from behind an overflow-hidden mask on a stagger, and sink back
 * behind it on exit. Splitting to words (not characters) keeps screen readers
 * and text selection intact; the whole string is exposed once via an sr-only
 * copy.
 */
export function SplitLine({
  text,
  className,
  delay = 0,
  stagger = 0.03,
  as: Tag = "span",
  accentLast = false,
  once = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  accentLast?: boolean;
  once?: boolean;
}) {
  const words = useMemo(() => text.split(" "), [text]);

  /*
   * The viewport observer MUST sit on this unclipped container, never on the
   * translated word itself.
   *
   * IntersectionObserver clips a target against its ancestors' overflow. A word
   * parked at y:115% inside an overflow-hidden mask has an empty intersection
   * rect, so `whileInView` on the word never fires — and because it never fires
   * the word never moves, so it stays clipped forever. That deadlock leaves
   * headlines permanently invisible. Observing the parent and driving the words
   * through variants avoids it entirely.
   */
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="inline-block"
        initial="hidden"
        whileInView="shown"
        viewport={once ? VIEWPORT_ONCE : VIEWPORT}
        variants={{
          hidden: {},
          shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {/*
         * The space between words is a real text node in THIS inline flow,
         * deliberately outside the mask.
         *
         * Putting it inside the word's inline-block — which is the obvious
         * place — silently loses it: trailing whitespace at the end of an
         * inline-block is collapsed away, so every headline renders as
         * "Fourcookies.Fourreasons". The mask must contain the word and
         * nothing else.
         */}
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="line-mask inline-block align-bottom">
              <motion.span
                className={`inline-block ${
                  accentLast && i === words.length - 1 ? "text-red" : ""
                }`}
                variants={{
                  hidden: { y: "125%", rotate: 4 },
                  shown: {
                    y: "0%",
                    rotate: 0,
                    transition: { duration: 0.95, ease: ease.expo },
                  },
                }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * Character-level scrub for a single hero word. Heavier than SplitLine, so
 * reserve it for one or two moments per page.
 */
export function SplitChars({
  text,
  className,
  delay = 0,
  stagger = 0.028,
  once = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const chars = useMemo(() => [...text], [text]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {/* Same rule as SplitLine: observe the unclipped container, never the
          masked characters, or they deadlock permanently out of view. */}
      <motion.span
        aria-hidden
        className="inline-flex flex-wrap"
        initial="hidden"
        whileInView="shown"
        viewport={once ? VIEWPORT_ONCE : VIEWPORT}
        variants={{
          hidden: {},
          shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {chars.map((c, i) => (
          <span key={i} className="line-mask inline-block">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%", rotateX: -75, opacity: 0 },
                shown: {
                  y: "0%",
                  rotateX: 0,
                  opacity: 1,
                  transition: { duration: 0.8, ease: ease.expo },
                },
              }}
              style={{ transformOrigin: "50% 100%" }}
            >
              {c === " " ? " " : c}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </span>
  );
}

const VARIANTS: Record<
  RevealVariant,
  { hidden: TargetAndTransition; shown: TargetAndTransition }
> = {
  rise: { hidden: { y: 44, opacity: 0 }, shown: { y: 0, opacity: 1 } },
  fade: { hidden: { opacity: 0 }, shown: { opacity: 1 } },
  scale: {
    hidden: { scale: 0.88, opacity: 0, y: 24 },
    shown: { scale: 1, opacity: 1, y: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(14px)", y: 26 },
    shown: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  wipe: {
    hidden: { clipPath: "inset(0 0 100% 0)", y: 20 },
    shown: { clipPath: "inset(0 0 0% 0)", y: 0 },
  },
};

/** Generic reveal for supporting copy, cards and UI. Reverses on exit. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 44,
  variant = "rise",
  once = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  variant?: RevealVariant;
  once?: boolean;
}) {
  const v = VARIANTS[variant];
  const hidden = variant === "rise" ? { y, opacity: 0 } : v.hidden;

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={v.shown}
      viewport={once ? VIEWPORT_ONCE : VIEWPORT}
      transition={{ duration: dur.slow, ease: ease.expo, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered container — children reveal in sequence and un-reveal in sequence.
 * Use for lists and card grids instead of hand-delaying each item.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  once = false,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={once ? VIEWPORT_ONCE : VIEWPORT}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Child of RevealGroup. */
export function RevealItem({
  children,
  className,
  variant = "rise",
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
}) {
  const v = VARIANTS[variant];
  return (
    <motion.div
      className={className}
      variants={{
        hidden: v.hidden,
        shown: {
          ...v.shown,
          transition: { duration: dur.slow, ease: ease.expo },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
