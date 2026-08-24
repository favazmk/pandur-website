"use client";

import Image from "next/image";

const PORTFOLIO = [
  { id: "coconut", name: "Coconut", src: "/products/hero-coconut-box.png" },
  { id: "peanut", name: "Peanut", src: "/products/hero-peanut-box.png" },
  { id: "cardamom", name: "Cardamom", src: "/products/hero-cardamom-box.png" },
  { id: "butter", name: "Butter", src: "/products/hero-butter-box.png" },
];

export default function PortfolioPreview() {
  return (
    <section className="relative bg-ink py-24 md:py-40">
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        
        <div className="text-center mb-20 md:mb-32">
          <p className="text-red-deep font-bold tracking-widest uppercase text-sm mb-6">Product Portfolio</p>
          <h2 className="text-3xl md:text-5xl font-display font-black text-cream uppercase tracking-tight">
            Four Signature Flavours.
          </h2>
        </div>

        {/* Clean Virtual Shelf */}
        <div className="relative">
          {/* Subtle Shelf line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream/20 to-transparent" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pb-4">
            {PORTFOLIO.map((item) => (
              <div key={item.id} className="relative group flex flex-col items-center">
                
                {/* Product Image with subtle hover lift */}
                <div className="relative w-full aspect-[3/4] transition-transform duration-700 ease-out group-hover:-translate-y-4">
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    className="object-contain drop-shadow-xl transition-all duration-700 group-hover:drop-shadow-2xl"
                  />
                </div>

                {/* Flavor Name appears on hover */}
                <div className="mt-8 opacity-0 translate-y-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0 text-center hidden md:block">
                  <span className="text-cream font-bold tracking-widest uppercase text-sm">
                    {item.name}
                  </span>
                </div>
                
                {/* Always visible on mobile */}
                <div className="mt-4 md:hidden text-center">
                   <span className="text-cream/70 font-bold tracking-widest uppercase text-xs">
                    {item.name}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
