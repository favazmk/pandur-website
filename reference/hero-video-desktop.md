# Hero film — 16:9 desktop prompt

Same film as the 9:16 version. The only change is where the clean zone sits:
the top 40% becomes the left 55%, because the desktop headline is left-aligned
rather than stacked above.

Two knock-on edits that follow from that and nothing else:

- entrances drop the left edge (it is now the clean zone) and use top, right
  and bottom;
- the plate and tea arrive within the right 45% rather than centred.

---

> Widescreen 16:9 cinematic food-product film for a scroll-controlled website
> hero. One continuous shot, slow motion, premium commercial food photography,
> photoreal.
>
> **SET:** a warm cream room with a soft linen curtain and a pale table. The
> same environment, lighting direction and colour hold from the first frame to
> the last.
>
> **FRAME:** the left 55% stays clean empty background for the entire film —
> website text sits there. All action happens in the right 45%, vertically
> centred.
>
> **SEQUENCE**
>
> 1. Opens on the empty room, held about one second.
> 2. Four ingredient groups travel in from off-screen edges — top, right and
>    bottom only — toward four separate convergence points inside the right
>    45%: cardamom pods with a few loose seeds; small broken coconut chunks;
>    small butter curls; peanuts, some shelled and some in shell. Each group
>    keeps its own shape and stays clearly separate from the other three.
> 3. Each group gathers into its own round cookie silhouette and settles into
>    one finished cookie. Four groups, four cookies, formed independently and
>    at the same time.
> 4. The four cookies drift downward together, spaced apart, rotating slightly.
>    The camera tracks smoothly down with them.
> 5. A white plate and a cup of tea come into frame below, within the right
>    45%. The cookies settle onto and around the plate, arranged so all four
>    stay visible.
> 6. Ends on the four cookies, the plate, the tea and fine steam rising, all in
>    the right 45%, the left 55% still clear.
>
> **COOKIES:** thick, round, gently domed, warm golden-orange. The tops are
> smooth and continuous with a fine, even bake texture, like a soft shortbread
> dome. All four match in size, thickness, proportion and colour, and stay
> whole throughout.
>
> **CAMERA:** vertical descent only, slow and constant, one unbroken take at one
> constant speed so it can be scrubbed forward and backward by scroll.
>
> **LIGHT:** warm diffused key from the upper left, soft fill, natural
> highlights on the cookies, soft plate shadow, subtle tea reflections.
>
> **AVOID:** any object entering the left 55%; the four groups merging into one;
> more or fewer than four cookies; cuts; speed changes; camera shake; white
> flash; glow; sparkles; smoke.

---

## One thing this prompt decides for us

A left-clean film only pays off **full-bleed**, where the copy sits on the
empty ground the film provides. The hero is currently the other arrangement —
the film in the right column from `lg`, which you asked for and which fixed the
centred-cookie collision.

Put this film in that column and most of it is thrown away. At 1440 the column
is 684x900; a 16:9 source covering it renders at 1600x900, so the visible
window is 684 of 1600 — the middle 42.75%, from 28.6% to 71.4% of the frame.
The action lives from 55% to 100%. **Only 55%-71.4% survives: roughly two
thirds of it is cropped off the right edge.**

So, when the clip lands:

- **Full-bleed** is the match for this prompt. The film's own empty left
  becomes the copy's ground, which is a better answer to the original problem
  than moving the film sideways was — the footage reserves the space rather
  than the layout dodging it. Costs a 1.25x upscale of a 1280px source at
  1440, which is what it was doing before.
- **Keep the right column** and this prompt is the wrong one — it would want a
  centred composition instead, and the clean-left instruction removed.

I would go full-bleed. Say which and I will wire it when the file arrives; the
warm ground and softened feather stay either way, they just move.
