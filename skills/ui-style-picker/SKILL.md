---
name: ui-style-picker
description: "Use at the start of a website, landing page or UI build or redesign, especially when asked only for modern or clean. Names a visual style, writes a style spec, checks contrast. Not for backend work."
version: 1.0.0
license: MIT
metadata:
  author: Ship at Midnight Authors <65935477+shreyassaw5394@users.noreply.github.com>
  tags: [design, style, ui, accessibility]
---

# ui-style-picker

## Purpose

Names a visual style before any pixels: Skeuomorphism, Neumorphism, Glassmorphism, Claymorphism, Brutalism, Minimalism, Maximalism, Liquid Glass, Bento Grid or Spatial UI. It writes a short style spec (palette, surface, shadow, radius, type, motion), builds to it, checks accessibility per style, and names the style in the reply so the user learns the vocabulary. It also keeps each product site in a studio visually distinct.

## Prerequisites

- Node.js for `scripts/contrast.mjs`.
- The catalogue in `references/style-catalog.md`; optionally `product-site-design` and an art-direction skill for composition.

## Instructions

People can't get the UI they want from AI because they don't have the words for it. This skill gives the build a name before it gives it pixels. "Which style?" is the feature, not friction.

Works with `product-site-design` (house rules and process) and `taste-skill` (direction, composition, inspector). This skill decides the **surface language**; taste-skill decides the **composition**.

## Workflow

(Use the steps in order; a step that cannot be completed is reported, not skipped.)

1. **Name the style first.** If the user named one, use it. If not, pick from context (subject, audience, the brand's existing look, the owner's stated taste) and say in one line why, e.g. "Minimalism with Spatial depth: the product is a technical tool and the hero scene needs depth." Ask only if two styles are equally right and the choice changes the whole build.
2. **At most two styles blended**, one dominant. Not three.
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
5. **Run the style's accessibility guardrail** (catalogue "Pitfalls" and "Guardrail") and the contrast checker: `node <skill>/scripts/contrast.mjs <fg> <bg> [<fg> <bg> …]` → every body-text pair ≥ 4.5:1, large text and UI parts ≥ 3:1. Fix by darkening text, adding a scrim behind text on glass, or raising the surface opacity. Fix every failing pair before shipping.
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
- `references/ui-ux-pro-max-styles.csv` — a larger MIT-licensed style database from nextlevelbuilder/ui-ux-pro-max-skill, for styles beyond the ten. Treat it as reference data (licence: `references/ui-ux-pro-max-LICENSE`).
- `references/CHANGES.md` — provenance of the third-party content in this skill.
- `scripts/contrast.mjs` — WCAG contrast checker (handles alpha by compositing over the given background).

## Examples

```text
Request: "make a clean, modern landing page for a developer tool"
Reply: "Built in Minimalism with Spatial UI depth in the hero only: ground #F6F4EF, ink #14120F, one accent, 4px radius,
        150ms press feedback."
Check: node scripts/contrast.mjs "#14120F" "#F6F4EF"   -> body text pair must be 4.5:1 or higher
```

## Limitations

- It chooses the surface language, not the layout; composition comes from `product-site-design` or an art-direction skill.
- The catalogue covers ten styles in depth; the CSV is reference data and has not been reviewed style by style.
- The contrast checker tests the colour pairs you give it, not rendered pages.

## Troubleshooting

- Problem: the contrast script reports a failing pair. Fix: darken the text, add a scrim behind text on glass, or raise surface opacity, then re-run it.
- Problem: the contrast script rejects a colour. Fix: pass colours with a leading `#` (for example `"#14120F"`), with alpha as an 8-digit hex if needed.
- Problem: two product sites end up in the same style. Fix: check the style register and change the dominant style, typeface or accent of the newer site.
