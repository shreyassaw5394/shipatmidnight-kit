# Style catalogue

Ten named styles. For each: what it is, when to use it, prompt cues (words that get the look), CSS cues, pitfalls, and the accessibility guardrail that must pass before shipping. CSS values are starting points; tune them to the palette. Sources: the idea of naming ten styles comes from a social post by Sachin (@egpg.builds), "Never say: build me a beautiful website"; the descriptions here are written in our own words. Style data cross-checked with nextlevelbuilder/ui-ux-pro-max-skill (MIT, see `ui-ux-pro-max-LICENSE`) and WCAG 2.2.

---

## 1. Skeuomorphism — realistic materials
- **Use for:** premium/luxury products, games, storytelling, things with a physical twin (a deck of slides, a notebook, an instrument). **Avoid for:** data-dense tools, enterprise, low-power devices.
- **Prompt cues:** real materials (paper, leather, brushed metal, glass, wood), tactile buttons, stitched edges, light from top-left, texture, depth that obeys physics.
- **CSS cues:** layered real shadows (2–3 layers), subtle noise/grain texture image, gradients that model a light source (not decorative), `filter: drop-shadow`, press = translateY(1px) + shadow shrink, 200–300ms.
- **Pitfalls:** kitsch; heavy images; text on textures losing contrast; every element a different material.
- **Guardrail:** text sits on a flat, calm area (never directly on texture); 4.5:1 on the lightest/darkest part of any textured background; reduced-motion removes press bounces; image weight budget (≤ 300 KB per screen).

## 2. Neumorphism (Soft UI) — soft extruded plastic
- **Use for:** wellness, calm single-purpose tools, a few big controls. **Avoid for:** dense content, data, anything that needs clear affordances.
- **Prompt cues:** monochrome surface, elements extruded from the same material, soft light-and-dark shadow pair, convex/concave states, rounded 12–16px.
- **CSS cues:** `background: var(--surface)` same as the page; `box-shadow: -6px -6px 14px rgba(255,255,255,.7), 6px 6px 14px rgba(0,0,0,.12)`; pressed = the same shadows `inset`; radius 12–16px.
- **Pitfalls:** buttons that don't look clickable; text contrast collapses because everything is one tone; focus invisible.
- **Guardrail (fails most often):** text and icons get a real ink colour (≥ 4.5:1 against the surface, usually near-black or near-white, not a tint); every control has a 2px+ visible focus ring in the accent; primary actions get a filled accent, not just extrusion; component edges ≥ 3:1 against the page via the shadow pair or a border.

## 3. Glassmorphism — frosted blur
- **Use for:** overlays, navigation, cards floating over a rich background (photo, gradient, video). **Avoid for:** reading surfaces, flat dark backgrounds (nothing to frost), low-power devices.
- **Prompt cues:** frosted glass panel, background blur, translucent white 10–30%, thin light border, vivid background behind.
- **CSS cues:** `backdrop-filter: blur(16px) saturate(140%)` (+ `-webkit-`), `background: rgba(255,255,255,.14)`, `border: 1px solid rgba(255,255,255,.22)`; fallback `@supports not (backdrop-filter: blur(1px))` → opaque surface.
- **Pitfalls:** text over busy backgrounds; stacked glass on glass; heavy blur jank on scroll.
- **Guardrail (fails most often):** measure contrast against the *worst* background point behind the panel; if under 4.5:1, raise panel opacity or add a scrim (`rgba(0,0,0,.35)` under light text). Respect `prefers-reduced-transparency` (opaque surface) and `prefers-reduced-motion`. Max one glass layer at a time.

## 4. Claymorphism — puffy pastel clay
- **Use for:** playful products, characters, onboarding, kids/education, fun developer tools. **Avoid for:** legal, finance, medical, serious data.
- **Prompt cues:** chunky soft 3D, inflated shapes, pastel colours, thick rounded corners (20–32px), inner highlight + soft outer shadow, toy-like, bouncy.
- **CSS cues:** radius 20–28px; `box-shadow: inset -6px -6px 12px rgba(0,0,0,.08), inset 6px 6px 12px rgba(255,255,255,.6), 10px 14px 24px rgba(0,0,0,.12)`; pastel fills; press = `scale(.97)`; bounce `cubic-bezier(.34,1.56,.64,1)` only on playful elements.
- **Pitfalls:** pastel text on pastel fill; everything bouncing; childish when the audience is professional.
- **Guardrail:** body text in a dark ink on pastels (≥ 4.5:1); bounce motion off under reduced motion; bounce only on direct interaction, never on load loops.

## 5. Brutalism — raw, high-contrast
- **Use for:** developer tools, editorial, counter-culture brands, honest/raw data (a debugger's raw output). **Avoid for:** conservative audiences, consumer trust flows.
- **Prompt cues:** raw HTML energy, hard edges, 0 radius, heavy type, visible structure, stark black/white with one loud colour, hard offset shadows (neo-brutalism).
- **CSS cues:** `border-radius: 0`; `border: 3px solid var(--ink)`; neo-brutal `box-shadow: 6px 6px 0 var(--ink)`; transitions instant or ≤ 100ms; bold 700+ display.
- **Pitfalls:** unreadable by design; inaccessible colour pairs (pure red on blue); chaos without hierarchy.
- **Guardrail:** keep hierarchy obvious (one headline per screen); every colour pair measured; focus states as loud as hover.

## 6. Minimalism (incl. Swiss/editorial) — whitespace, restraint
- **Use for:** most product sites, docs, technical tools; a good default (restraint first). **Avoid for:** when it reads as empty or generic — that's the vibe-coded failure.
- **Prompt cues:** generous space, one strong typeface set large, strict grid, one accent, real content as the only decoration.
- **CSS cues:** no shadows at rest, flat fills, tone steps between surfaces, radius 0–4px or fully round, 2–5 type sizes, 12-column grid.
- **Pitfalls:** thin, empty pages; grey-on-grey text; looking like every other AI page (eyebrows, numbered sections, hairlines, mono labels).
- **Guardrail:** full ink for running text (not soft grey); taste-skill inspector "empty-screens" and "fullness" must pass — fill space with scale, real pictures or colour fields, not ornaments.

## 7. Maximalism — bold, dense, more-is-more
- **Use for:** entertainment, studios, launches, umbrella brands with many products, playful worlds. **Avoid for:** forms, checkout, long reading.
- **Prompt cues:** saturated colour fields, big type collisions, layered pictures, stickers, patterns, many things on screen but each deliberate, cinematic.
- **CSS cues:** full-bleed colour fields per section, oversized display type (12–20vw), overlapping layers with `z-index`, mixed media; motion on scroll.
- **Pitfalls:** no focal point; text over pictures; performance; motion sickness.
- **Guardrail:** one focal point per screen; text never over a busy picture without a scrim; reduced-motion drops all scroll-linked motion; page weight budget.

## 8. Liquid Glass — fluid refractive glass (Apple 2025 style)
- **Use for:** navigation and controls floating over content, app chrome. **Avoid for:** content layers and reading surfaces.
- **Prompt cues:** refractive lens edges, adaptive tint from the content beneath, fluid morphing between states, specular highlight, capsule controls.
- **CSS cues:** layered `backdrop-filter: blur(12px) saturate(160%)`, edge highlight with an inner border `inset 0 1px 0 rgba(255,255,255,.5)`, SVG `feDisplacementMap` for refraction (sparingly), shape morph with `border-radius` transitions; content on its own non-glass layer.
- **Pitfalls:** used for content panels; expensive filters; low contrast on varied backgrounds.
- **Guardrail:** as Glassmorphism, plus `prefers-reduced-transparency` → solid material and `prefers-reduced-motion` → no morph; test contrast over light and dark content.

## 9. Bento Grid — tiled compartments
- **Use for:** feature overviews, results with several facets (e.g. an answer, its claims, sources and a score), dashboards, portfolios. **Avoid for:** long reading and dense tables.
- **Prompt cues:** modular tiles of varied spans, one hero tile, consistent gap, each tile one idea with real content, Apple-style keynote board.
- **CSS cues:** `display:grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(180px, auto); gap: 8–16px`; spans 1×1, 2×1, 2×2; one radius (12–24px); fills one tone step from the ground; collapses 4 → 2 → 1.
- **Pitfalls:** identical tiles in rows (the generated-page tell); icon + title + sentence in every tile; empty decorative tiles.
- **Guardrail:** varied spans with real content (numbers, fragments, pictures) per tile; reading order matches visual order on mobile; tiles that are links have one clear target.

## 10. Spatial UI — 3D depth layers (visionOS-like)
- **Use for:** immersive heroes, space/orbit metaphors, product worlds (an orbit, a night sky). **Avoid for:** dense text, forms.
- **Prompt cues:** floating layers at different depths, parallax, soft light, scale on focus, a scene the eye can enter.
- **CSS cues:** `perspective` + `transform: translateZ()`, layered parallax (2–3 layers max), canvas/WebGL for the scene, depth shadows only on floating layers, focus = scale(1.03).
- **Pitfalls:** motion sickness; text floating over moving layers; GPU cost; inaccessible canvas content.
- **Guardrail:** the scene is decorative (`aria-hidden`), meaning lives in real text; pause when off-screen or tab hidden; reduced-motion shows a still frame; text never moves with parallax.

---

## Pairing guide (max two)

Good pairs: Minimalism + Spatial (calm page, one deep hero) · Minimalism + Brutalism (technical, raw) · Bento + Minimalism (structured product pages) · Claymorphism + Maximalism (playful worlds) · Glassmorphism + Spatial (immersive overlays) · Skeuomorphism-lite + Minimalism (one physical object on a calm page).

Bad pairs: Neumorphism + Glassmorphism (both low-contrast) · Brutalism + Claymorphism (fight each other) · Maximalism + Liquid Glass (glass over chaos is unreadable).
