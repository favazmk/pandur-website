import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Grain from "@/components/fx/Grain";
import Cursor from "@/components/fx/Cursor";
import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/sections/Footer";
import { ScrollProgress } from "@/components/motion/Scroll";

/**
 * Display face.
 *
 * This was Fraunces with its WONK axis on — a high-contrast wonky serif. It
 * read as ornate rather than appetising next to the rounded hand-lettered
 * logo, so it was replaced. Bricolage Grotesque keeps a little of that
 * character in its odd terminals while sitting much closer to the wordmark's
 * geometry, and it holds up far better at display sizes.
 *
 * To try another: change the import and this call only — everything downstream
 * reads `--font-display`. Fraunces without WONK, Outfit and Archivo were the
 * other candidates.
 *
 * Its weight axis tops out at 800, so `font-black` (900) renders at 800. That
 * is the heaviest the family has, and it is applied consistently everywhere.
 */
const display = Bricolage_Grotesque({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

/**
 * Body face. The brief named Satoshi / General Sans (Fontshare). Manrope is the
 * closest self-hostable Google equivalent — swap if the client licenses either.
 */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pandur.ae"),
  title: {
    /*
     * Matches the h1. The tagline it replaced is not lost — MarqueeBand still
     * runs "OUR SIGNATURE TASTE" across the page, and the hero ticker still
     * carries "MADE TO GROW".
     */
    default: "Pandur — Cookies worth the shelf space.",
    template: "%s · Pandur",
  },
  description:
    "Pandur is the signature cookie brand of Royal Quality Bakes LLC — 45 years of bakery experience, four signature flavours, six-month shelf life, growing across the UAE.",
  openGraph: {
    title: "Pandur — Cookies worth the shelf space.",
    description:
      "Four signature flavours. Six-month shelf life. Eight UAE markets. Made in Khorfakkan.",
    type: "website",
    locale: "en_AE",
    siteName: "Pandur",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF5EC",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
     * suppressHydrationWarning on <html> and <body> only.
     *
     * Browser extensions inject attributes onto these two elements before React
     * hydrates (ad blockers, AI assistants, password managers), which React
     * reports as a hydration mismatch we cannot fix from application code. This
     * suppresses the warning for these elements' own attributes ONLY — it does
     * not extend to any descendant, so genuine mismatches inside the app still
     * surface normally.
     */
    <html
      lang="en"
      className={`${display.variable} ${manrope.variable} antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-preloader focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-cream"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <ScrollProgress />
          <SiteHeader />
          {children}
          <Footer />
        </SmoothScroll>
        <Grain />
        <Cursor />
      </body>
    </html>
  );
}
