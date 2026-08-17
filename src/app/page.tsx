import Preloader from "@/components/sections/Preloader";
import Hero from "@/components/sections/Hero";
import StatBand from "@/components/sections/StatBand";
import Flavours from "@/components/sections/Flavours";
import Bite from "@/components/sections/Bite";
import Craft from "@/components/sections/Craft";
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
        <Flavours />
        <Bite />
        <Craft />
        <Markets />
        <MarqueeBand />
        <Vision />
        <Partner />
      </main>
    </>
  );
}
