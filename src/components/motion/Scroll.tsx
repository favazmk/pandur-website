"use client";

import { ReactNode, useRef } from "react";
import {
  MotionValue,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { spring } from "@/lib/motion";
import { usePrefersReducedMotion, useIsTouch } from "@/lib/useMedia";

/** Shared scrub range: element entering the viewport bottom → leaving the top. */
const THROUGH = ["start end", "end start"] as const;

/**
 * Scroll-linked vertical parallax. Positive `distance` moves the element up as
 * you scroll (faster than the page); negative lags behind.
 */
export function Parallax({
  children,
  distance = 80,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...THROUGH],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const smooth = useSpring(y, { stiffness: 120, damping: 30, mass: 0.6 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y: smooth }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Scale + fade tied to viewport position: content grows into place as it
 * arrives and recedes as it leaves. Continuous, so it reverses for free.
 */
export function ScrollScale({
  children,
  className,
  from = 0.86,
  fade = true,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  fade?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...THROUGH],
  });

  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [from, 1, 1, from]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    fade ? [0, 1, 1, 0] : [1, 1, 1, 1]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { scale, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * 3D "stand up" — the card is tipped away from the viewer as it enters from
 * below, rotates flat at centre screen, and tips the other way as it exits.
 */
export function ScrollTilt({
  children,
  className,
  angle = 26,
  perspective = 1200,
}: {
  children: ReactNode;
  className?: string;
  angle?: number;
  perspective?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...THROUGH],
  });

  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [angle, 0, -angle * 0.6]
  );
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [0, 1, 1, 0.25]);

  const rx = useSpring(rotateX, { stiffness: 110, damping: 26 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className} style={{ perspective }}>
      <motion.div
        style={{ rotateX: rx, y, opacity, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Pointer-driven 3D tilt. The card leans toward the cursor with a slight lift.
 * Inert on touch and under reduced motion.
 */
export function Tilt3D({
  children,
  className,
  max = 10,
  lift = 14,
  perspective = 900,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  perspective?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  const rx = useSpring(0, spring.soft);
  const ry = useSpring(0, spring.soft);
  const z = useSpring(0, spring.soft);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
    z.set(lift);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    z.set(0);
  };

  if (touch || reduced) return <div className={className}>{children}</div>;

  return (
    <div className={className} style={{ perspective }}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{
          rotateX: rx,
          rotateY: ry,
          translateZ: z,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Clip-path wipe. Reveals upward on enter, closes back down on exit. */
export function ClipReveal({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const reduced = usePrefersReducedMotion();

  // MotionConfig's reducedMotion="user" drops transforms, but clip-path is not
  // a transform — it has to be opted out explicitly or content stays hidden.
  if (reduced) return <div className={className}>{children}</div>;

  const closed = {
    up: "inset(0 0 100% 0)",
    down: "inset(100% 0 0 0)",
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
  }[direction];

  return (
    <motion.div
      className={className}
      initial={{ clipPath: closed }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scroll-driven word fill.
 *
 * Words start muted and darken one by one as the block scrolls through the
 * viewport, so reading the sentence and scrolling become the same gesture.
 *
 * Deliberately interpolates COLOUR, not opacity: the muted state is `--ash`,
 * which still clears AA at 5.05:1 on cream. Fading opacity toward zero (the
 * usual way this effect is built) leaves the un-filled words illegible for
 * anyone who has not scrolled to them yet.
 */
export function ScrollFillText({
  text,
  className,
  from = "#6E6866",
  to = "#221F1F",
}: {
  text: string;
  className?: string;
  from?: string;
  to?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.3"],
  });

  const words = text.split(" ");

  if (reduced) {
    return (
      <p ref={ref} className={className} style={{ color: to }}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <FillWord
            key={i}
            word={w}
            index={i}
            total={words.length}
            progress={scrollYProgress}
            from={from}
            to={to}
          />
        ))}
      </span>
    </p>
  );
}

function FillWord({
  word,
  index,
  total,
  progress,
  from,
  to,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  from: string;
  to: string;
}) {
  // Overlap each word's range slightly so the fill sweeps rather than steps.
  const start = index / total;
  const end = Math.min(1, (index + 1.4) / total);
  const color = useTransform(progress, [start, end], [from, to]);
  return <motion.span style={{ color }}>{word} </motion.span>;
}

/**
 * Panel slide-over. The section rides up over whatever precedes it with a hard
 * top edge, instead of the page simply scrolling it into view — the transition
 * the reference uses between its light and dark sections.
 */
export function PanelOver({
  children,
  className,
  distance = "16vh",
  z = 10,
}: {
  children: ReactNode;
  className?: string;
  distance?: string;
  z?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.35"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, "0vh"]);

  return (
    <div
      ref={ref}
      className={`relative ${className ?? ""}`}
      style={{ zIndex: z }}
    >
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** Thin page-progress rail, fixed under the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-red-deep"
      style={{ scaleX }}
    />
  );
}

/** Exposes a section's own 0→1 scroll progress to children. */
export function useSectionProgress(): [
  React.RefObject<HTMLDivElement | null>,
  MotionValue<number>,
] {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...THROUGH],
  });
  return [ref, scrollYProgress];
}
