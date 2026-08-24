# Post-build check — static HTML sites

A standing prompt to run after any UI work on a plain HTML/CSS/JS site, before
publishing. Paste the block below to the agent as-is.

Self-contained: nothing here assumes a framework, a bundler, or a build step.
For the Next.js version of this repo, see [post-build-check.md](post-build-check.md).

## Why this exists

A static site has no compiler, no type checker and no build that can fail. That
sounds like fewer things to go wrong. It means the opposite: **nothing sits
between a mistake and the published page.** The failure modes that survive to
production are the quiet ones.

- **Invalid CSS fails silently.** A browser drops a declaration it cannot parse
  and says nothing — no console error, no warning. `calc(Math.cos(1.5) * 80px)`
  is not an error, it is *nothing*, and the element sits at its untransformed
  position looking entirely plausible.
- **Every style string is hand-written.** There is no type checker that can see
  inside a `style="…"` attribute, a `el.style.transform = …`, or a class name.
  A typo in any of them is invisible until someone looks at the right element
  at the right width.
- **Pages drift apart.** Head blocks, navs and footers get copy-pasted between
  files, then edited in one place. A page that quietly lost its stylesheet link
  or kept a stale nav will not announce itself.
- **A page that renders is not a page that works.** Rendering is the weakest
  possible evidence. Something wrong is still something.

---

## The prompt

> Run the full post-publish check on this site. Do not stop at "the pages
> load" — loading is the entry condition for this check, not the result of it.
> Report findings with evidence; where you assert something works, say what you
> ran or measured to know that.
>
> **1 — Gates. Run all of these, paste real output, fix everything.**
>
> ```bash
> npx html-validate "**/*.html"
> npx stylelint "**/*.css"
> npx linkinator ./ --recurse
> npx pa11y-ci
> ```
>
> Serve the site properly first — `npx serve .` or `python -m http.server` —
> and check it over `http://`, never `file://`. Relative paths, fetches and
> module scripts all behave differently on the two, and a site that works from
> the filesystem can still be broken on a server.
>
> Fix what the tools report. Do not silence a rule or add an ignore to reach
> green; fix the markup or CSS the rule is pointing at.
>
> **2 — Hunt the silent failures. This is the important section.**
>
> Never take a rendered page as proof. For every element positioned, sized or
> transformed from CSS you wrote by hand, read back the **computed** value in
> the browser and confirm it is what you intended:
>
> ```js
> getComputedStyle(el).transform    // "matrix(1, 0, 0, 1, 0, 0)" == nothing applied
> getComputedStyle(el).width        // did the calc() survive?
> ```
>
> An identity matrix where you expected an offset means the declaration was
> dropped as invalid and the browser never told you. Specifically check:
>
> - **`calc()` built by string concatenation or a template literal.** All maths
>   must be evaluated in **JS**, with only finished numbers crossing into the
>   string. `calc()` has no `Math.cos()`, no `Math.sin()`, no JS of any kind.
>   One invalid token voids the entire declaration.
> - **Every `var(--custom-prop)` actually resolves.** Check with
>   `getComputedStyle(document.documentElement).getPropertyValue('--x')`. An
>   undefined custom property invalidates the whole declaration it sits in, not
>   just itself. Any property read by more than one component belongs on
>   `:root` in the main stylesheet, defined exactly once.
> - **Every class name is real.** Invented utilities compile to nothing and are
>   never flagged by anything. If you use a utility framework, grep any class
>   you do not recognise against its docs before assuming it works.
> - **Units are present.** `width: calc(100% - 20)` is invalid and dropped;
>   `margin: 0 auto` is fine but `margin: 0px auto 20` is not.
>
> **3 — Check every page, not just the one you edited.**
>
> Static sites duplicate their head, nav and footer across files, and those
> copies drift. For every `.html` file in the project, confirm:
>
> - It links the same stylesheets and scripts as its siblings, in the same
>   order. A page missing one link is the classic static-site bug.
> - Its nav matches the others, and every link in it resolves.
> - Its `<title>` and meta description are page-specific, not a leftover copy.
> - There are no duplicate `id` attributes on the page — duplicates silently
>   break anchor links, `label[for]`, and `getElementById`.
> - The console is clean when it loads. Check **each page**, not just the
>   homepage.
>
> **4 — Verify the states nobody looks at.**
>
> The default — motion on, desktop width, light theme, mouse — is the one state
> that gets checked by eye. Check the others and tell me what you saw in each.
>
> - **Reduced motion.** DevTools → Rendering → *Emulate prefers-reduced-motion:
>   reduce*, then hard-reload. Animations and transitions must settle rather
>   than run. Nothing may be left permanently invisible, off-screen, or at
>   `opacity: 0` because the animation that would have revealed it no longer
>   runs. **No information may exist only in motion.**
> - **Mobile.** 375px wide. Check nothing overflows horizontally — the page
>   body must never scroll sideways — and that tap targets are at least 44px.
> - **Keyboard.** Tab through every page. Focus must stay visible at all times
>   and must never be trapped. Any custom control that can be clicked must also
>   be reachable and operable by keyboard.
> - **Dark mode**, if the site declares one. Confirm every colour is defined in
>   both, and that nothing inherits a transparent background.
> - **Slow network.** Throttle to Fast 3G and reload. Confirm nothing important
>   depends on a font or script that may not arrive.
>
> **5 — Assets and links.**
>
> - Every `src` and `href` referenced anywhere in the HTML, CSS and JS resolves
>   to a file that exists. Check the CSS too — `url()` references are missed by
>   most link checkers.
> - Paths are consistent about being root-relative (`/img/x.png`) or
>   document-relative (`img/x.png`). Mixing them is what breaks a site the
>   moment it moves into a subdirectory.
> - Every `<img>` has an `alt`, and a `width`/`height` or an aspect-ratio, so
>   the layout does not jump as images arrive.
> - Nothing 404s in the network panel on any page.
>
> **6 — Scroll and animation libraries.**
>
> If the site uses a scroll or animation library, a scripted `scrollTo` will
> read a stale position unless the library is told to recalculate. Use the
> right call for the one in play before asserting anything about what is on
> screen — `ScrollTrigger.refresh()` for GSAP, `.update()` for Locomotive, a
> dispatched `resize` for libraries that cache offsets on that event. Plain
> `window` scroll listeners need nothing.
>
> **7 — Report.**
>
> Give me a table: check, pass/fail, evidence. For each fix, say what changed
> visually at default settings — "nothing, this only affects reduce-motion
> users" is a valid and useful answer, and the one I most need to hear, since I
> verify by eye and will not otherwise notice the difference.
>
> Do not report done until §1 is green **and** §4 has been actually observed in
> the browser rather than reasoned about.

---

## The 30-second version

Before every publish, serve the site over HTTP and run:

```bash
npx html-validate "**/*.html" && npx linkinator ./ --recurse
```

Then toggle *Emulate prefers-reduced-motion* in DevTools and reload, and check
the console on **every** page rather than just the homepage.

That covers the three things most likely to be wrong: malformed markup, dead
paths, and content that only exists while something is moving.
