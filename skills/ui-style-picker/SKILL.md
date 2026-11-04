---
name: ui-style-picker
description: Use at the start of ANY website, landing page, app screen or UI build or redesign — especially when the request only says "beautiful", "modern", "clean", "premium" or "nice". Names a visual style first (Skeuomorphism, Neumorphism, Glassmorphism, Claymorphism, Brutalism, Minimalism, Maximalism, Liquid Glass, Bento Grid, Spatial UI), writes a short style spec (palette, surface, shadow, radius, type, motion), builds to it, checks accessibility per style, and names the style in the reply so the user learns the vocabulary. Also keeps each product site in a studio visually distinct.
---

# ui-style-picker

People can't get the UI they want from AI because they don't have the words for it. This skill gives the build a name before it gives it pixels. "Which style?" is the feature, not friction.

Works with `product-site-design` (house rules and process) and `taste-skill` (direction, composition, inspector). This skill decides the **surface language**; taste-skill decides the **composition**.

## Workflow

1. **Name the style first.** If the user named one, use it. If not, pick from context (subject, audience, the brand's existing look, the owner's stated taste) and say in one line why, e.g. "Minimalism with Spatial depth: the product is a technical tool and the hero scene needs depth." Ask only if two styles are equally right and the choice changes the whole build.
2. **At most two styles blended**, one dominant. Never three.
3. **Write the style spec** (6 lines, before code) and keep it in the notes:
   ```
   Style:    <dominant> (+ <secondary>)
   Palette:  ground, ink, muted, accent, fields — hex values
   Surface:  flat | soft-extruded | frosted | clay | textured | raw | refractive
   Shadow:   none | soft pair | inner+outer | layered real | hard offset
   Radius:   0 | 4 | 12–16 | 16–24 | 24+  (one value, used everywhere)
   Type:     display face, text face, sizes (≤5), weights
   Motion:   e.g. "none/instant", "150ms press", "soft bounce", "fluid morph", "parallax depth"
   ```
4. **Build to the spec.** Take the cues from `references/style-catalog.md`. Tokens first; every component uses the spec's radius, shadow and surface.
5. **Run the style's accessibility guardrail** (catalogue "Pitfalls" and "Guardrail") and the contrast checker: `node <skill>/scripts/contrast.mjs <fg> <bg> [<fg> <bg> …]` → every body-text pair ≥ 4.5:1, large text and UI parts ≥ 3:1. Fix by darkening text, adding a scrim behind text on glass, or raising the surface opacity. Never ship a failing pair.
6. **Name the style in the reply** ("Built in Claymorphism: puffy 20px radius, inner+outer shadows, soft bounce") so the user learns the vocabulary.

## Relationship with taste-skill's house rules

Taste-skill bans glass, shadows at rest, gradients and soft radii by default. Those bans are right for Minimalism, Brutalism, Bento and Maximalism builds. When the chosen style *is* one of the ornamental ones (Glassmorphism, Liquid Glass, Neumorphism, Claymorphism, Skeuomorphism, Spatial UI), its signature devices are allowed **only where the catalogue says**, marked in CSS with `/* taste-skill-ignore: <style> signature */`, and passed to the inspector with `--allow` for that rule. Everything else in taste-skill still applies: two-line headlines, real content, real pictures, no fake proof, equal margins, the inspector at 0 FAIL on all other rules.

## Keep a studio's sites distinct

When one studio ships several products, each gets its own style, typeface, accent and motif. Keep a style register in the studio's own notes (not in this skill), check it before choosing, and update it when a site's style changes:

| Product | Style | Typeface | Accent | Motif / signature |
|---|---|---|---|---|
| `<product A>` | e.g. Minimalism + Spatial UI (depth in the hero only) | `<display face>` | `<hex>` | the one object only this product has |
| `<product B>` | e.g. Claymorphism + Maximalism (playful) | `<display face>` | `<hex>` | its character or mascot |

No two rows may share a style pair, typeface or accent.

## Files

- `references/style-catalog.md` — the ten styles: when to use, prompt cues, CSS cues, pitfalls, accessibility guardrail.
- `references/ui-ux-pro-max-styles.csv` — a larger MIT-licensed style database (67 styles) from nextlevelbuilder/ui-ux-pro-max-skill, for styles beyond the ten. Treat it as reference data.
- `scripts/contrast.mjs` — WCAG contrast checker (handles alpha by compositing over the given background).
