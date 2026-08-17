"use client";

import { ReactNode, useMemo } from "react";
import { motion } from "motion/react";
import { ease, dur } from "@/lib/motion";

/**
 * Masked headline reveal — the site's default entrance for every heading.
 * Words rise from behind an overflow-hidden mask on a stagger. Splitting to
 * words (not characters) keeps screen readers and text selection intact; the
 * whole string is exposed once via an sr-only copy.
 */
export function SplitLine({
  text,
  className,
  delay = 0,
  stagger = 0.03,
  as: Tag = "span",
  accentLast = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  accentLast?: boolean;
}) {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-block">
        {words.map((w, i) => (
          <span key={i} className="line-mask inline-block align-bottom">
            <motion.span
              className={`inline-block ${
                accentLast && i === words.length - 1 ? "text-red" : ""
              }`}
              initial={{ y: "115%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.95,
                ease: ease.expo,
                delay: delay + i * stagger,
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Generic fade-and-rise for supporting copy and UI. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: dur.slow, ease: ease.expo, delay }}
    >
      {children}
    </motion.div>
  );
}
