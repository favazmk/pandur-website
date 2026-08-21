import { PanelOver } from "@/components/motion/Scroll";
import Preloader from "@/components/sections/Preloader";
import Hero from "@/components/sections/Hero";
import StatBand from "@/components/sections/StatBand";
import FlavourShowcase from "@/components/sections/FlavourShowcase";
import Flavours from "@/components/sections/Flavours";
import Bite from "@/components/sections/Bite";
import Craft from "@/components/sections/Craft";
import Retail from "@/components/sections/Retail";
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
        <Flavours />
        {/* dark panels ride up over the light section before them */}
        <PanelOver z={20}>
          <Bite />
        </PanelOver>
        <Craft />
        <Retail />
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
