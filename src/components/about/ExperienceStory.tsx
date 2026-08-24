"use client";

const ARCHIVE_ITEMS = [
  {
    title: "Craft",
    subtitle: "The Foundation",
    description: "Every recipe begins with an uncompromising commitment to traditional baking methods, scaled carefully for modern demands.",
  },
  {
    title: "Experience",
    subtitle: "45 Years",
    description: "Decades of understanding ingredient behavior, temperature profiling, and the subtle mechanics of the perfect bake.",
  },
  {
    title: "Knowledge",
    subtitle: "Refined Process",
    description: "Continuous iteration and technological investment ensure our quality remains absolutely consistent across every single batch.",
  },
  {
    title: "Precision",
    subtitle: "Strict Standards",
    description: "From ingredient sourcing to final sealing, every stage is monitored to meet the highest international safety and taste metrics.",
  }
];

export default function ExperienceStory() {
  return (
    <section className="relative bg-ink py-24 md:py-40">
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24 text-center">
          <p className="text-red-deep font-bold tracking-widest uppercase text-sm mb-4">Heritage</p>
          <h2 className="text-3xl md:text-5xl font-display font-black text-cream uppercase tracking-tight">
            Years of Food Manufacturing <br className="hidden md:block" />& Bakery Experience.
          </h2>
        </div>

        {/* Offset 2x2 Grid for Editorial Look */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {ARCHIVE_ITEMS.map((item, index) => (
            <div 
              key={index} 
              className={`group relative bg-cream/5 border border-cream/10 rounded-3xl p-8 md:p-12 overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:border-red-deep/40 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:bg-cream/10 backdrop-blur-sm ${
                index % 2 !== 0 ? 'md:mt-24' : ''
              }`}
            >
              {/* Massive Watermark */}
              <div className="absolute -right-6 -bottom-10 text-[10rem] font-display font-black text-cream/5 transition-all duration-700 group-hover:scale-110 group-hover:text-cream/10 group-hover:-rotate-6 pointer-events-none select-none">
                0{index + 1}
              </div>

              {/* Animated Top Line */}
              <div className="w-8 h-1 bg-cream/20 mb-8 transition-all duration-700 group-hover:w-24 group-hover:bg-red-deep" />

              <h3 className="relative z-10 text-2xl md:text-3xl font-display font-black text-cream uppercase tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="relative z-10 text-xs font-bold tracking-widest uppercase text-red-deep mb-6 transition-colors duration-500 group-hover:text-cream">
                {item.subtitle}
              </p>
              <p className="relative z-10 text-cream/70 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
