import { PanelOver } from "@/components/motion/Scroll";
import Preloader from "@/components/sections/Preloader";
import Hero from "@/components/sections/Hero";
import StatBand from "@/components/sections/StatBand";
import FlavourShowcase from "@/components/sections/FlavourShowcase";

import CookieJourney from "@/components/journey/CookieJourney";
import ConsistencyJourney from "@/components/consistency/ConsistencyJourney";

import Markets from "@/components/sections/Markets";
import MarqueeBand from "@/components/sections/MarqueeBand";
import Vision from "@/components/sections/Vision";
import Partner from "@/components/sections/Partner";

export default function Home() {
  return (
    <>
      <Preloader />
      <main id="main">
        <Hero />
        <StatBand />
        <FlavourShowcase />

        {/* Signature physical interactive cookie journey */}
        <CookieJourney />

        {/* Production & Shelf Life Storyline */}
        <ConsistencyJourney />

        <Markets />
        <MarqueeBand />
        <PanelOver z={30}>
          <Vision />
        </PanelOver>
        <Partner />
      </main>
    </>
  );
}
