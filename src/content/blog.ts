/**
 * File-based blog content.
 *
 * No CMS was specified, and none is needed to launch — posts live here as typed
 * data, which keeps the build dependency-free and fully static. If the client
 * needs to publish without a developer, this module is the seam: swap the two
 * accessors below for CMS fetches and the pages are unchanged.
 *
 * The posts below are SAMPLE content written only from facts in the company
 * brief. Nothing here is invented news. Replace with client-approved copy.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date */
  date: string;
  category: string;
  readMinutes: number;
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "why-six-months-matters",
    title: "Why six months matters",
    excerpt:
      "Shelf life isn't a technical footnote. It decides which shelves a cookie can reach.",
    date: "2026-07-28",
    category: "Product",
    readMinutes: 6,
    body: [
      {
        type: "image",
        src: "/blog/shelf_life.jpg",
        alt: "Packaged Pandur cookies neatly arranged on a modern retail shelf",
      },
      {
        type: "p",
        text: "Every bakery product carries an invisible constraint: how far it can travel before it stops being worth selling. Shelf life sets that radius. When a product has a short shelf life, it can only serve the immediate geography, severely limiting its commercial potential and placing intense pressure on logistics.",
      },
      {
        type: "p",
        text: "A six-month shelf life changes the fundamentals of a bakery business. It is the dividing line between a local artisan baker and a regional commercial brand. To bridge that gap, you need deep understanding of formulation, moisture control, and packaging.",
      },
      {
        type: "h2",
        text: "The distribution maths",
      },
      {
        type: "p",
        text: "A six-month life changes what a distributor can plan. Stock can move through a warehouse, sit in a delivery cycle, and still reach a shelf with enough runway to sell through.",
      },
      {
        type: "list",
        items: [
          "Longer ordering cycles and larger, more efficient drops which reduce transport costs",
          "Room for slower-turning outlets without the constant fear of expensive write-offs",
          "Realistic reach into markets beyond the immediate region, enabling a truly GCC-wide footprint",
          "Better relationships with retailers who value reduced wastage and predictable restocking",
        ],
      },
      {
        type: "quote",
        text: "Six months on shelf. Tastes like it left the oven this morning.",
      },
      {
        type: "p",
        text: "The harder part is holding taste across that window. It's one thing to make a cookie last six months; it's entirely another to ensure that the texture remains satisfyingly crunchy and the flavours stay vibrant. That is a formulation and process question, and it is where decades of manufacturing experience earn their keep.",
      },
      {
        type: "p",
        text: "Our research and development team spent months adjusting baking temperatures, resting times, and packaging materials to ensure that the Pandur cookie you eat on day 180 is indistinguishable from the one you eat on day 1. That is our true competitive advantage.",
      },
    ],
  },
  {
    slug: "seven-emirates-one-taste",
    title: "Seven emirates, one taste",
    excerpt:
      "Consistency across a growing footprint is a manufacturing problem before it is a brand one.",
    date: "2026-06-15",
    category: "Distribution",
    readMinutes: 5,
    body: [
      {
        type: "image",
        src: "/blog/manufacturing.jpg",
        alt: "A pristine, modern bakery production line producing uniform cookies",
      },
      {
        type: "p",
        text: "Pandur is already moving across Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah. While expanding reach is the primary goal of any FMCG brand, it brings a hidden challenge that tests the limits of operational capacity: consistency.",
      },
      {
        type: "h2",
        text: "Growth exposes inconsistency",
      },
      {
        type: "p",
        text: "A single bakery serving a single town can absorb variation between batches. A brand on seven sets of shelves cannot — the customer who buys in Fujairah expects exactly what they bought in Abu Dhabi. If the bite is different, the brand promise is broken.",
      },
      {
        type: "p",
        text: "That is why controlled, repeatable production matters more as distribution widens. Consistency is what lets a footprint keep growing without the brand thinning out. When we designed our production lines, we eliminated manual variables that could alter the final product.",
      },
      {
        type: "list",
        items: [
          "Automated ingredient scaling to ensure exact proportions every time",
          "Continuous temperature monitoring in multi-zone baking ovens",
          "Laser-guided thickness checks before the packaging stage",
        ],
      },
      {
        type: "p",
        text: "It is an engineering mindset applied to a culinary product. By treating the cookie as a precise, replicable unit, we guarantee that the Pandur experience is identical whether you pick it up in a bustling Dubai supermarket or a quiet neighborhood grocer in Ras Al Khaimah.",
      },
    ],
  },
  {
    slug: "45-years-in-the-oven",
    title: "45 years in the oven",
    excerpt:
      "Pandur is a new brand built on a manufacturing base that is anything but new.",
    date: "2026-05-02",
    category: "Brand",
    readMinutes: 5,
    body: [
      {
        type: "image",
        src: "/blog/heritage.jpg",
        alt: "A beautifully lit, high-end commercial bakery oven with a golden glow",
      },
      {
        type: "p",
        text: "Royal Quality Bakes has spent 45 years in food manufacturing and bakery production. Pandur is what that experience looks like when it is pointed at a single signature product. We aren't a startup learning how to bake; we are master bakers learning how to introduce ourselves to a new generation.",
      },
      {
        type: "h2",
        text: "Why launch a brand now?",
      },
      {
        type: "p",
        text: "Decades of production teach you what consumers return to, what survives a supply chain, and what a retailer will re-order. We have seen trends come and go, but the fundamentals of a great cookie—rich ingredients, perfect snap, and satisfying mouthfeel—never change.",
      },
      {
        type: "quote",
        text: "We spent 45 years perfecting the process so we could spend today perfecting the brand.",
      },
      {
        type: "p",
        text: "The ambition is straightforward: build a trusted UAE bakery brand, then grow it across the GCC. Pandur was developed against these core principles at once, ensuring that we weren't just creating a tasty treat, but a robust commercial product.",
      },
      {
        type: "p",
        text: "Behind every pack of Pandur lies nearly half a century of trial, error, optimization, and passion. The ovens have been running for 45 years, but in many ways, we feel like we are just getting started.",
      },
    ],
  },
];

export const getAllPosts = (): Post[] =>
  [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug: string): Post | undefined =>
  POSTS.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
