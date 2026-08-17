import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Grain from "@/components/fx/Grain";
import Cursor from "@/components/fx/Cursor";
import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/sections/Footer";
import { ScrollProgress } from "@/components/motion/Scroll";

/**
 * Display face. The SOFT and WONK axes are what make Fraunces rhyme with the
 * hand-lettered logo without competing with it — do not drop them.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
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
    default: "Pandur — Our Signature Taste. Made to Grow.",
    template: "%s · Pandur",
  },
  description:
    "Pandur is the signature cookie brand of Royal Quality Bakes LLC — 45 years of bakery experience, four signature flavours, six-month shelf life, growing across the UAE.",
  openGraph: {
    title: "Pandur — Our Signature Taste. Made to Grow.",
    description:
      "Four signature flavours. Six-month shelf life. Eight UAE markets. Made in Khorfakkan.",
    type: "website",
    locale: "en_AE",
    siteName: "Pandur",
  },
  icons: { icon: "/brand/favicon.svg" },
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
      className={`${fraunces.variable} ${manrope.variable} antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-cream"
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
