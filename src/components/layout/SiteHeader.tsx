"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Logo } from "@/components/brand/Marks";
import { HoverLetters, HoverSweep } from "@/components/motion/Hover";
import { NAV } from "@/lib/nav";
import { ease } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useMedia";

export default function SiteHeader() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  /*
   * Both bits of state are stamped with the path they belong to, so navigating
   * implicitly resets them. Without this the bar stays hidden after you scroll
   * down and follow a link — the new page loads with no visible nav, which
   * looks like navigation is broken. Deriving beats resetting in an effect.
   */
  const [menu, setMenu] = useState({ path: pathname, open: false });
  const [bar, setBar] = useState({ path: pathname, hidden: false, scrolled: false });

  const open = menu.path === pathname && menu.open;
  const hidden = bar.path === pathname && bar.hidden;
  const scrolled = bar.path === pathname && bar.scrolled;

  const setOpen = (v: boolean | ((p: boolean) => boolean)) =>
    setMenu((m) => ({
      path: pathname,
      open: typeof v === "function" ? v(m.path === pathname && m.open) : v,
    }));

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    // Never hide the bar while the mobile menu is open, or near the top.
    const nextHidden = open || y < 120 ? false : y > prev;
    setBar({ path: pathname, hidden: nextHidden, scrolled: y > 24 });
  });

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-header"
        animate={{ y: hidden && !reduced ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: ease.expo }}
      >
        <div
          className={`transition-colors duration-500 ${
            scrolled && !open
              ? "border-b border-ink/10 bg-cream/80 backdrop-blur-xl"
              : "border-b border-transparent"
          }`}
        >
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10">
            <Link
              href="/"
              aria-label="Pandur — home"
              data-cursor="grow"
              onClick={() => setOpen(false)}
              /*
               * `min-h-11` is the 44px touch minimum. It costs no layout: the
               * row is already 44px tall because the menu toggle beside it is
               * `h-11`, and the 36px logo was simply sitting short inside it.
               */
              className="relative z-10 flex min-h-11 items-center"
            >
              <Logo className="h-9 w-auto md:h-12" />
            </Link>

            {/* --- desktop nav --- */}
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {NAV.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      data-cursor="grow"
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className="group relative flex min-h-11 items-center px-4 text-xs font-extrabold uppercase tracking-[0.16em] text-ink transition-opacity hover:opacity-100"
                    >
                      {/* 70%, not 60%: ink at 60% over cream is 4.22:1, under the AA floor for this size. */}
                      <span
                        className={
                          isActive(l.href) ? "" : "opacity-70 group-hover:opacity-100"
                        }
                      >
                        <HoverLetters text={l.label} />
                      </span>
                      <span
                        className={`absolute inset-x-4 -bottom-0.5 h-[2px] origin-left bg-red-deep transition-transform duration-400 ease-[var(--ease-expo)] ${
                          isActive(l.href)
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                data-cursor="grow"
                className="hidden overflow-hidden rounded-full bg-ink text-xs font-extrabold uppercase tracking-[0.16em] text-cream lg:block"
              >
                <HoverSweep fill="bg-red-deep" className="min-h-11 px-6">
                  Get in Touch
                </HoverSweep>
              </Link>

              {/* --- menu toggle --- */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                data-cursor="grow"
                className="relative z-10 flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border-2 border-ink lg:hidden"
              >
                <motion.span
                  className="block h-[2px] w-4 bg-ink"
                  animate={{ rotate: open ? 45 : 0, y: open ? 3.5 : 0 }}
                  transition={{ duration: 0.3, ease: ease.expo }}
                />
                <motion.span
                  className="block h-[2px] w-4 bg-ink"
                  animate={{ rotate: open ? -45 : 0, y: open ? -3.5 : 0 }}
                  transition={{ duration: 0.3, ease: ease.expo }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* --- mobile overlay --- */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            /*
             * Scrollable, and the scroll is not decoration.
             *
             * The links are sized in `vw`, so on a LANDSCAPE phone they get
             * enormous while the viewport gets short: at 812x375 the six items
             * stood 674px tall inside a 375px overlay, which put "Home" fully
             * above the screen and "Contact" fully below it with no way to
             * reach either. Two of six destinations were simply gone.
             *
             * `data-lenis-prevent` is required, not optional: Lenis owns the
             * wheel globally, and without it a wheel over this overlay scrolls
             * the page behind instead of the menu.
             */
            className="fixed inset-0 z-menu overflow-y-auto overscroll-contain bg-cream lg:hidden"
            data-lenis-prevent
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: ease.expo }}
          >
            {/*
             * `min-h-full` + `justify-center` is the pairing that centres short
             * content and scrolls tall content from its TOP. Centring on the
             * scroll container itself instead would push the overflow above the
             * scrollable area, where it cannot be reached — which is the bug
             * this markup exists to avoid.
             *
             * `pt-24` clears the header: it sits at `z-header`, ABOVE this
             * overlay, so the close button stays reachable and the first link
             * must not run underneath it.
             */}
            <div className="flex min-h-full flex-col justify-center px-8 pt-24 pb-12">
              <nav aria-label="Mobile">
                <ul className="space-y-1">
                  {NAV.map((l, i) => (
                    <li key={l.href} className="line-mask">
                      <motion.div
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "110%" }}
                        transition={{
                          duration: 0.7,
                          ease: ease.expo,
                          delay: 0.1 + i * 0.05,
                        }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive(l.href) ? "page" : undefined}
                          /*
                           * Capped against the viewport HEIGHT as well as its
                           * width. `13vw` alone only knows how wide the screen
                           * is, which is the wrong axis for a stack of six
                           * items. On every portrait phone 13vw is still the
                           * smaller of the two and the size is unchanged.
                           */
                          className="block py-1.5 font-display text-[min(13vw,9vh)] font-black leading-[0.95] text-ink"
                        >
                          <span className={isActive(l.href) ? "text-red-deep" : ""}>
                            {l.label}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>

              <motion.p
                className="text-eyebrow mt-14 text-ash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
              >
                Zubara, Khorfakkan · UAE
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
