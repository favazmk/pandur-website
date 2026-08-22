# Post-build check

A standing prompt to run after any UI work on this repo, before committing.
Paste the block below to the agent as-is.

## Why this exists

A visual pass in one browser at default settings is the weakest check this
project has, because the three bug classes that actually reach production here
are all invisible to it:

- **Hook-order bugs** never fire on the machine that wrote them. They fire for
  the visitor whose OS setting differs. ESLint catches every one of them in two
  seconds — but only if someone runs it.
- **Invalid CSS fails silently.** A browser drops a declaration it cannot parse
  and says nothing. `calc(Math.cos(1.5) * 80px)` is not an error, it is nothing,
  and the element just sits at its untransformed position looking plausible.
- **TypeScript cannot see into a string.** Every inline `calc()`, every
  `var(--x)`, every Tailwind class name is opaque to `tsc`. A green type check
  says nothing about any of them.

None of these produce a red screen. All of them produce a wrong page.

---

## The prompt

> Run the full post-build check on this repo. Do not stop at "the build
> passed" — a green build is the entry condition for this check, not the
> result of it. Report findings with evidence; where you assert something
> works, say what you ran or measured to know that.
>
> **1 — Gates. Run all three, paste real output, fix everything.**
>
> ```
> npx tsc --noEmit
> npm run lint
> npm run build
> ```
>
> `npm run lint` is not optional and its warnings are not noise. Treat every
> `react-hooks/rules-of-hooks` error as a crash that has not happened yet, not
> as a style nit — it means the component renders a different number of hooks
> on two different renders, and React tears down the whole tree when it does.
> Do not silence a rule, add a disable comment, or "work around the linter" to
> get to green. Fix the code the rule is pointing at.
>
> **2 — The two-render trap. This is where the real bugs are.**
>
> Any value that differs between the server and the client renders *twice*:
> once with the server's answer during hydration, then again with the truth.
> In this repo that is everything in `src/lib/useMedia.ts` —
> `usePrefersReducedMotion`, `useIsMobile`, `useIsTouch`, `useClientValue`.
> They all report `false` through hydration and flip immediately after.
>
> For every component that reads one of those hooks, confirm:
>
> - No hook — `useTransform`, `useSpring`, `useScroll`, anything — is called
>   after an early return, inside a condition, or inside a `.map()`/callback.
>   The fix for a per-item transform is a child component that owns its own
>   hooks, never a hook in a loop body.
> - The flag changes **values**, not the shape of the tree. Follow the pattern
>   in `FlavourShowcase.tsx`: `const animate = mounted && !reduced`, then
>   `style={animate ? {...} : undefined}`. Never `if (reduced) return <X/>`.
> - Nothing that affects **layout height** is decided in JS. Section track
>   heights belong in `globals.css` behind a media query — see
>   `.showcase-track` and `.consistency-track`. A JS-decided height resizes
>   the page after hydration and drags the scroll position with it.
>
> **3 — Verify the states I never look at.**
>
> I only ever check the default: motion on, desktop width, light theme. Check
> the others and tell me what you saw in each.
>
> - **Reduced motion.** DevTools → Rendering → *Emulate prefers-reduced-motion:
>   reduce*, then hard-reload and read the console. The page must still render
>   — if it shows "This page couldn't load" or the console says "Rendered fewer
>   hooks than expected", that is the bug from §2. Then confirm every pinned
>   section's track has collapsed, and that content is still reachable rather
>   than hidden at opacity 0 forever.
> - **Mobile.** 375px wide. Check that nothing scroll-driven has drifted off
>   screen, and that anything positioned with a per-breakpoint pixel offset
>   still lands where it should.
> - **Keyboard.** Tab through the page. Focus must stay visible and must not
>   get trapped inside a pinned section.
>
> **4 — Hunt the silent failures. Never take a rendered page as proof.**
>
> For every element positioned or transformed from an inline style, read back
> the **computed** value in the browser and check it is what the code intended:
>
> ```js
> getComputedStyle(el).transform   // "matrix(1, 0, 0, 1, 0, 0)" == nothing applied
> ```
>
> An identity matrix where you expected an offset means the declaration was
> dropped as invalid. Specifically check:
>
> - `calc()` strings built by template literal. JS math must be evaluated in
>   **JS**, with only finished numbers crossing into the string. `calc()` has
>   no `Math.cos()`, no `Math.sin()`, no JS of any kind.
> - Every `var(--custom-prop)` used in an inline style actually resolves —
>   `getComputedStyle(document.documentElement).getPropertyValue('--x')`. An
>   undefined var invalidates the entire declaration it sits in. Custom props
>   read by more than one component belong on `:root` in `globals.css`, not in
>   a `<style>` tag inside one of them.
> - Every Tailwind class is real. Invented ones (`transform-origin-center`,
>   `text-huge`) compile to nothing and are never flagged. Grep any class you
>   do not recognise against the Tailwind docs before assuming it works.
>
> **5 — Assets and routes.**
>
> Confirm every `/…` path referenced in `src/` exists in `public/`, and that
> every route in `src/lib/nav.ts` resolves. Load each route and check for
> console errors and 404s in the network panel.
>
> **6 — Driving the pinned sections.**
>
> These cannot be judged from a screenshot of the top of the page. Scroll into
> `#flavour-showcase`, `#cookie-journey`, `#consistency-journey` and `#markets`
> and step through each. **After any programmatic `scrollTo`, dispatch a
> `resize` event** — Motion caches section offsets and Lenis owns the real
> scroll, so without it you are reading a stale progress value and looking at
> the wrong stage.
>
> **7 — Report.**
>
> Give me a table: check, pass/fail, evidence. For each fix, say what changed
> visually at default settings — "nothing, this only affects reduce-motion
> users" is a valid and useful answer, and the one I most need to hear, since
> I verify by eye and will not otherwise notice the difference.
>
> Do not report done until §1 is green **and** §3 has been actually observed
> in the browser rather than reasoned about.

---

## The 30-second version

If nothing else, run this before every commit:

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Then toggle *Emulate prefers-reduced-motion* in DevTools and reload the page.
That pair would have caught every bug found in the audit of 2026-08-22.
