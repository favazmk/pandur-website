import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Text";
import { Tilt3D } from "@/components/motion/Scroll";
import { HoverSpotlight, HoverDrift, HoverRule } from "@/components/motion/Hover";
import { CookieDoodle } from "@/components/brand/Marks";
import { getAllPosts, formatDate } from "@/content/blog";
import { tiltAt } from "@/lib/motion";
import { FLAVOURS } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from Pandur on product, distribution and building a UAE bakery brand.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main id="main">
      <PageHero
        title="Notes from the bakery."
        lead="On product, distribution, and building a UAE bakery brand."
      />

      <section className="relative bg-cream px-6 pb-24 md:pb-32">
        <RevealGroup
          className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
          stagger={0.09}
        >
          {posts.map((p, i) => (
            <RevealItem key={p.slug} variant="scale">
              <Tilt3D max={9} lift={20} className="h-full">
                <Link
                  href={`/blog/${p.slug}`}
                  data-cursor-label="Read"
                  className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-ink/12 bg-white/50 transition-colors hover:border-ink/30"
                >
                  <HoverDrift
                    amount={18}
                    className="flex aspect-[16/10] items-center justify-center bg-cream/10 relative overflow-hidden"
                  >
                    {(() => {
                      const imgBlock = p.body.find(b => b.type === "image");
                      if (imgBlock && imgBlock.type === "image") {
                        return (
                          <img 
                            src={imgBlock.src} 
                            alt={imgBlock.alt} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        );
                      }
                      return (
                        <div
                          className="flex h-full w-full items-center justify-center"
                          style={{
                            backgroundColor: FLAVOURS[i % FLAVOURS.length].ground,
                          }}
                        >
                          <CookieDoodle
                            className={`h-24 w-24 ${tiltAt(i)}`}
                            strokeWidth={5}
                            stroke={FLAVOURS[i % FLAVOURS.length].line}
                          />
                        </div>
                      );
                    })()}
                  </HoverDrift>

                  <HoverSpotlight className="flex flex-1 flex-col p-8">
                    <p className="text-eyebrow text-red-deep">{p.category}</p>
                    <h2 className="mt-4 font-display text-2xl font-black leading-tight text-ink">
                      <HoverRule on="group">{p.title}</HoverRule>
                    </h2>
                    <p className="mt-3 flex-1 text-ash">{p.excerpt}</p>
                    <p className="text-eyebrow mt-6 text-ash">
                      <time dateTime={p.date}>{formatDate(p.date)}</time>
                      {" · "}
                      {p.readMinutes} min read
                    </p>
                  </HoverSpotlight>
                </Link>
              </Tilt3D>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-16 max-w-2xl text-center text-sm text-ash">
            Sample articles, written from the company brief. Replace with
            client-approved posts before launch.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
