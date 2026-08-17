"use client";

import Link from "next/link";
import { CookieDoodle, Wordmark } from "@/components/brand/Marks";
import { Reveal } from "@/components/motion/Text";
import { Parallax, ClipReveal } from "@/components/motion/Scroll";
import { HoverRule } from "@/components/motion/Hover";
import { COMPANY, NAV } from "@/lib/nav";

/** Independent drift per doodle — no two share a delay, so they never sync. */
const DOODLES = [
  { cls: "left-[6%] top-[18%] h-16 w-16", delay: "0s" },
  { cls: "left-[24%] bottom-[16%] h-10 w-10", delay: "-2.4s" },
  { cls: "right-[12%] top-[24%] h-20 w-20", delay: "-4.1s" },
  { cls: "right-[30%] bottom-[22%] h-12 w-12", delay: "-6.3s" },
  { cls: "left-[46%] top-[10%] h-8 w-8", delay: "-1.2s" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 pb-10 text-cream">
      {DOODLES.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className={`animate-drift absolute ${d.cls} text-cream/15`}
          style={{ animationDelay: d.delay }}
        >
          <CookieDoodle className="h-full w-full" strokeWidth={5} />
        </span>
      ))}

      <div className="relative mx-auto max-w-7xl px-6">
        <Parallax distance={-40}>
          <ClipReveal className="flex justify-center">
            <Wordmark className="w-full max-w-4xl brightness-0 invert" />
          </ClipReveal>
        </Parallax>

        <Reveal delay={0.1}>
          <nav aria-label="Footer" className="mt-16">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  {/* min-h-11 = 44px. The bare label measured 45x15, which
                      fails WCAG 2.2 AA target size (24x24) outright. */}
                  <Link
                    href={l.href}
                    data-cursor="grow"
                    className="text-eyebrow inline-flex min-h-11 items-center px-1 text-cream/70 transition-colors hover:text-cream"
                  >
                    <HoverRule colour="bg-cream">{l.label}</HoverRule>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-14 flex flex-col items-center gap-3 border-t border-cream/15 pt-8 text-center"
        >
          <p className="text-eyebrow text-cream/70">
            {COMPANY.legal} · {COMPANY.address} · {COMPANY.country}
          </p>
          <p className="text-xs text-cream/60">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
