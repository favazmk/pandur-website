# Hero film prompts — corrected after the last generation

Three fixes, applied to both aspects. Nothing else changed.

## What went wrong, and why

**The cup landed inside the plate.** "A white plate and a cup of tea come into
frame below" describes them as one arriving thing. They are now two objects
with table between them, and the cup gets its own saucer so it reads as a
separate setting.

**Five cookies instead of four.** The likely cause is the wording, not the
model's arithmetic. The old step 3 named *two* objects — "gathers into its own
round cookie silhouette **and settles into** one finished cookie" — so a
silhouette and a cookie are both things in the scene, and a fifth falls out of
that gap. It is now a single action: each group resolves directly into its
flavour's cookie. The four are also enumerated by flavour at both formation and
final frame, because a one-to-one mapping anchors a count far better than a
number does. And the plate is stated as empty until they land — a cookie
already sitting on it is the other easy way to end up with five.

**The tea appeared after the fall.** "Come into frame" invited the model to
create the scene at that moment. It is now established from the start and
merely reached by the camera: poured and steaming before the cookies arrive,
revealed by the descent rather than filled at the end.

---

## 16:9 — desktop

> Widescreen 16:9 cinematic food-product film for a scroll-controlled website
> hero. One continuous shot, slow motion, premium commercial food photography,
> photoreal.
>
> **SET:** a warm cream room with a soft linen curtain and a pale table. On the
> table, low in the scene, a white plate sits empty, and beside it — set clearly
> apart on the table, on its own small saucer, with visible table between them —
> a cup of tea, already poured and gently steaming from the start. The same
> environment, lighting direction and colour hold from the first frame to the
> last.
>
> **FRAME:** the left 55% stays clean empty background for the entire film —
> website text sits there. All action happens in the right 45%.
>
> **SEQUENCE**
>
> 1. Opens high in the room, above the table, held about one second. Empty.
> 2. Four ingredient groups travel in from off-screen edges — top, right and
>    bottom only — toward four separate convergence points inside the right
>    45%: cardamom pods with a few loose seeds; small broken coconut chunks;
>    small butter curls; peanuts, some shelled and some in shell. Each group
>    keeps its own shape and stays clearly separate from the other three.
> 3. Each group draws together and resolves into that flavour's finished
>    cookie: the cardamom cookie, the coconut cookie, the butter cookie, the
>    peanut cookie. Four groups, four cookies, one each, formed at the same
>    time.
> 4. The four cookies drift downward together, spaced apart, rotating slightly.
>    The camera tracks smoothly down with them, and as it descends the plate and
>    the steaming tea that were already set on the table come into view below —
>    the camera reaches them; they are not poured or placed.
> 5. The four cookies settle onto the empty plate, arranged so all four stay
>    visible. The cup stays where it was on the table beside the plate,
>    untouched, still steaming.
> 6. Ends on the plate holding those four cookies — cardamom, coconut, butter,
>    peanut, and nothing else on the plate — the cup of tea beside it on the
>    table, fine steam rising, all in the right 45%, the left 55% still clear.
>
> **COOKIES:** thick, round, gently domed, warm golden-orange. The tops are
> smooth and continuous with a fine, even bake texture, like a soft shortbread
> dome. All four match in size, thickness, proportion and colour, and stay whole
> throughout.
>
> **CAMERA:** vertical descent only, slow and constant, one unbroken take at one
> constant speed so it can be scrubbed forward and backward by scroll.
>
> **LIGHT:** warm diffused key from the upper left, soft fill, natural highlights
> on the cookies, soft plate shadow, subtle tea reflections.
>
> **AVOID:** any object entering the left 55%; the cup resting on the plate; the
> four groups merging into one; a cookie on the plate before they land; cuts;
> speed changes; camera shake; white flash; glow; sparkles; smoke.

---

## 9:16 — mobile

Identical film. Clean zone is the top 40% instead of the left 55%, the
composition is centred, and entrances use left, right and bottom.

> Vertical 9:16 cinematic food-product film for a scroll-controlled website
> hero. One continuous shot, slow motion, premium commercial food photography,
> photoreal.
>
> **SET:** a warm cream room with a soft linen curtain and a pale table. On the
> table, low in the scene, a white plate sits empty, and beside it — set clearly
> apart on the table, on its own small saucer, with visible table between them —
> a cup of tea, already poured and gently steaming from the start. The same
> environment, lighting direction and colour hold from the first frame to the
> last.
>
> **FRAME:** centred composition, weighted low. The top 40% stays clean empty
> background for the entire film — website text sits there. All action happens
> in the middle and lower thirds, horizontally centred.
>
> **SEQUENCE**
>
> 1. Opens high in the room, above the table, held about one second. Empty.
> 2. Four ingredient groups travel in from off-screen edges — left, right and
>    bottom only — toward four separate convergence points near the centre:
>    cardamom pods with a few loose seeds; small broken coconut chunks; small
>    butter curls; peanuts, some shelled and some in shell. Each group keeps its
>    own shape and stays clearly separate from the other three.
> 3. Each group draws together and resolves into that flavour's finished
>    cookie: the cardamom cookie, the coconut cookie, the butter cookie, the
>    peanut cookie. Four groups, four cookies, one each, formed at the same
>    time.
> 4. The four cookies drift downward together, spaced apart, rotating slightly.
>    The camera tracks smoothly down with them, and as it descends the plate and
>    the steaming tea that were already set on the table come into view below —
>    the camera reaches them; they are not poured or placed.
> 5. The four cookies settle onto the empty plate, arranged so all four stay
>    visible. The cup stays where it was on the table beside the plate,
>    untouched, still steaming.
> 6. Ends on the plate holding those four cookies — cardamom, coconut, butter,
>    peanut, and nothing else on the plate — the cup of tea beside it on the
>    table, fine steam rising, all in the lower centre, the top 40% still clear.
>
> **COOKIES:** thick, round, gently domed, warm golden-orange. The tops are
> smooth and continuous with a fine, even bake texture, like a soft shortbread
> dome. All four match in size, thickness, proportion and colour, and stay whole
> throughout.
>
> **CAMERA:** vertical descent only, slow and constant, one unbroken take at one
> constant speed so it can be scrubbed forward and backward by scroll.
>
> **LIGHT:** warm diffused key from the upper left, soft fill, natural highlights
> on the cookies, soft plate shadow, subtle tea reflections.
>
> **AVOID:** any object entering the top 40%; the cup resting on the plate; the
> four groups merging into one; a cookie on the plate before they land; cuts;
> speed changes; camera shake; white flash; glow; sparkles; smoke.

---

## If it still comes back with five

Counting is the weakest thing these models do, and no wording makes it certain.
If the next pass is still wrong, drop the transformation: open on four finished
cookies already formed and have them fall into the waiting scene. The count
stops being something the model derives and becomes something it copies from
its own opening frames — and the four-flavour story survives either way.
