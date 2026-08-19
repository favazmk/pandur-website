# Hero scroll-video brief — round 3, camera-led

Two earlier rounds failed:

- **Turntable** — technically fine, visually dead.
- **Assembly / break** — both asked the model to invent structure that exists
  in no input frame. That is the hardest thing these models do, and it is where
  they produce mush and flicker.

So: the cookie stays whole and unchanged, and the **camera** carries the shot.
Drama comes from scale, depth and things passing the lens. Both prompts below
explicitly forbid breaking, crumbling and forming, because that is what the
model keeps reaching for on its own.

---

## The cookie — use this description verbatim

The earlier brief said "deeply crackled and craggy" and that was wrong. It is
what produced the over-cracked result.

> a round domed golden butter cookie with a fine, even, shallow-relief surface
> texture — small uniform raised ridges across the whole dome, like a pressed
> lace pattern, divided by a few soft broad seams. Warm golden amber, matte,
> smooth round silhouette

**Not** cracked, fissured, craggy, broken, split or rustic. The texture is
shallow, regular and all-over. Crop a real one from
`public/products/hero-cardamom-scene.png` and attach it as the start frame.

---

## Concept C — the descent

Scroll goes down; the camera goes down. The motion axis matches the input axis,
which is the most natural scroll hero there is.

> Extreme slow motion. A [cookie description] falls slowly and steadily
> downward through the air against a plain warm cream background. The camera
> descends alongside it at the same speed, so the cookie stays roughly centred
> while the background streaks upward past it. Butter curls, green cardamom
> pods, coconut pieces and roasted peanuts drift upward past the lens at
> different depths, some close and soft, some far and sharp.
>
> The camera moves continuously downward for the ENTIRE duration at a constant
> speed, one unbroken shot. It never stops, never slows, never reverses. The
> descent is still going on the very last frame.
>
> The cookie stays completely whole and unchanged throughout — it does not
> break, crumble, split, crack, spin or change shape. Soft diffused studio
> light from the upper left, constant throughout. Photoreal, premium food
> advertising photography, macro lens, very high frame rate.

## Concept D — the dive

The scale change is what makes a scroll feel powerful.

> Extreme slow motion. The camera pushes slowly and continuously forward toward
> a [cookie description] suspended in the air against a plain warm cream
> background, starting wide with the whole cookie in shot and ending in extreme
> macro on its surface texture. The camera drifts in a slight arc as it travels
> so the move reads as real cinematography rather than a zoom. Crumbs, cardamom
> pods and coconut pieces drift past the lens at different depths on the way
> in, some passing very close and soft.
>
> The push happens gradually and continuously across the ENTIRE duration at a
> constant speed, one unbroken shot. At the halfway point the camera is only
> halfway in. It is still moving closer on the very last frame.
>
> The cookie stays completely whole and unchanged throughout — it does not
> break, crumble, split, crack or change shape. Soft diffused studio light from
> the upper left, constant throughout. Photoreal, premium food advertising
> photography, macro lens, very high frame rate.

## Avoid / negative

    cracked, deeply cracked, fissured, craggy, broken, split, crumbling,
    shattering, forming, assembling, morphing, camera cuts, shot changes,
    speed ramps, action completing early, static hold, frozen frame, camera
    shake, jitter, flicker, strobing, changing lighting, hands, people, text,
    packaging, busy background

## Settings

- Aspect **16:9** for both tests. The 9:16 companion comes after we pick one.
- **Longest duration available.**
- **Audio off.**
- Highest tier your plan offers — check whether Pro gives you something above
  **Flash**, which is the fast default and may be part of why these are failing.
- Attach the real-cookie crop as the start frame.

---

## Check before we use it

1. **Scrub to the middle.** If the move is finished, the clip is unusable —
   the whole hero would happen in the first few percent of the scroll.
2. **Scrub back and forth over the same two seconds.** Drifting ingredients are
   fine detail; the usual failure is them flickering or re-forming. Playing
   forward once will not show it.
3. **The cookie is still a cookie** at the end — same shape, same size, texture
   not crawling.
4. **The texture is shallow and even**, not cracked open.
5. **Constant speed**, one shot, stable lighting.
6. **Opening frames calm enough** for a headline to sit over. Copy only has to
   be legible at the start — it lifts and fades as the scroll progresses.

## Send back

Both MP4s at the highest quality available.

ffmpeg is installed and verified here (9.0, with libx264 / libvpx-vp9 / libwebp
/ png), so I can extract a frame sequence or re-encode with a keyframe on every
frame. Whatever the export settings are, I can work with them.
