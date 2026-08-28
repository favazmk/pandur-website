import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal, SplitLine } from "@/components/motion/Text";
import { CookieDoodle } from "@/components/brand/Marks";
import { getAllPosts, getPost, formatDate, type Block } from "@/content/blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "h2":
      return (
        <Reveal key={i} delay={0.02}>
          <h2 className="text-title mt-14 font-display font-black text-ink">
            {b.text}
          </h2>
        </Reveal>
      );
    case "quote":
      return (
        <Reveal key={i}>
          <blockquote className="my-12 border-l-4 border-red-deep pl-7">
            <p className="font-display text-2xl font-black leading-tight text-ink md:text-3xl">
              {b.text}
            </p>
          </blockquote>
        </Reveal>
      );
    case "list":
      return (
        <Reveal key={i}>
          <ul className="mt-6 space-y-3">
            {b.items.map((it, j) => (
              <li key={j} className="flex gap-4 text-lead text-ash">
                <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-red-deep" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      );
    case "image":
      return (
        <Reveal key={i}>
          <div className="my-10 overflow-hidden rounded-2xl border border-ink/10 shadow-sm">
            <Image 
              src={b.src} 
              alt={b.alt} 
              width={1200} 
              height={800} 
              className="w-full h-auto object-cover" 
            />
          </div>
        </Reveal>
      );
    default:
      return (
        <Reveal key={i}>
          <p className="text-lead mt-6 text-ash">{b.text}</p>
        </Reveal>
      );
  }
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <main id="main">
      <article>
        {/* --- header --- */}
        <header className="relative overflow-hidden bg-cream px-6 pt-36 pb-16 md:pt-48 md:pb-20">
          <span
            aria-hidden
            className="animate-drift absolute right-[8%] top-[26%] h-24 w-24 text-ink/10"
          >
            <CookieDoodle className="h-full w-full" strokeWidth={5} />
          </span>

          <div className="relative mx-auto max-w-3xl">
            <Reveal>
              <p className="text-eyebrow text-red-deep">{post.category}</p>
            </Reveal>

            <SplitLine
              as="h1"
              text={post.title}
              className="text-display mt-5 font-display font-black text-ink"
              stagger={0.035}
            />

            <Reveal delay={0.2}>
              <p className="text-eyebrow mt-8 text-ash">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {" · "}
                {post.readMinutes} min read
              </p>
            </Reveal>
          </div>
        </header>

        {/* --- body --- */}
        <div className="relative bg-cream px-6 pb-24 md:pb-32">
          <div className="mx-auto max-w-3xl border-t border-ink/12 pt-12">
            {post.body.map(renderBlock)}
          </div>
        </div>
      </article>

      {/* --- more --- */}
      {others.length > 0 && (
        <section className="relative bg-cream-deep px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-title font-display font-black text-ink">
              Keep reading
            </h2>

            <ul className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              {others.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <li>
                    <Link
                      href={`/blog/${p.slug}`}
                      data-cursor="grow"
                      className="group block rounded-[2rem] border border-ink/12 bg-white/50 p-8 transition-colors hover:border-ink/30"
                    >
                      <p className="text-eyebrow text-red-deep">{p.category}</p>
                      <h3 className="mt-4 font-display text-2xl font-black text-ink">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-ash">{p.excerpt}</p>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>

            <div className="mt-14">
              <Link
                href="/blog"
                data-cursor="grow"
                /* `min-h-11` is the 44px touch minimum — the bare eyebrow
                   text box was 15px tall, which is a hard link to hit. */
                className="text-eyebrow inline-flex min-h-11 items-center text-ink underline underline-offset-8 hover:text-red-deep"
              >
                ← All articles
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
