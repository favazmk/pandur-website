# Pandur — Premium Bakery Experience

[Live Link](#) *(Deployment Pending)*

> *Note: Screenshots skipped per user request during Phase 2 cleanup.*

## Project Description
Brand site for Pandur, the signature cookie brand of Royal Quality Bakes LLC, based in Khorfakkan, UAE. This project is a highly immersive, premium editorial web experience designed to showcase the brand's 45-year heritage, meticulous manufacturing process, and global growth ambitions.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Motion & Animation:** Framer Motion (`motion/react`)
- **Scroll Engine:** Lenis

## Features
- **Editorial Design System:** Premium, typography-led visual aesthetics with stark contrast (ink, cream, deep red) and sophisticated grid layouts.
- **Interactive Storytelling:** Scroll-driven animations mapping the company's 45-year heritage and its growth from the UAE to international markets.
- **Complex Micro-Interactions:** Custom CSS hover glows, staggered Framer Motion text reveals, and dynamic hardware-accelerated animations for the production pipeline.
- **High-Performance Architecture:** Fully static prerendering, preventing hydration mismatch, utilizing `transform: translate3d()` for GPU acceleration.
- **Accessible & Responsive:** Fluid typography scaling across all breakpoints with full support for `prefers-reduced-motion` to respect user OS preferences.

## Local Setup / Run Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

To judge real performance and test the fully compiled, static production build locally:
```bash
npm run build && npm run start
```
