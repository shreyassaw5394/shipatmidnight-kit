---
name: product-site-design
description: Use when building or redesigning a website, landing page, launch page, product page, docs home, dashboard or any user-facing UI for a product your studio ships. A design-first house process — the product is the hero, restraint over ornament, never a "vibe-coded" page — plus the gates (style, taste, guidelines, interaction, accessibility, legal, security) every site passes before anyone sees it.
---

# Product site design (house process)

The bar: the product is the hero of the page, and everything that does not serve it is cut. Say no to a thousand good ideas so the one that matters reads clearly. A page should feel designed for this product and no other — never the average of every AI-generated landing page.

## Principles

- **The product is the hero.** The first screen shows the product doing its job (real output, a real screenshot, a live demo), not a slogan over a gradient.
- **Restraint.** One idea per section, one accent colour, a few type sizes, one signature motion. If a detail does not help someone understand or use the product, remove it.
- **Storytelling in acts.** Problem → the product doing its job → what it does → proof → how to start → questions. Each section makes one claim and shows its proof.
- **Real material, never faked.** Real CLI output, real screenshots or recordings (run the product and capture them), measured numbers with method and date. No invented testimonials, logos, user counts or dashboards.
- **The owner's eye beats the meter.** Passing every automated check is the floor, not the goal. A redesign that passes every check but loses the personality the owner liked is a failure: keep what they liked.
- **Every product distinct.** Different typeface, accent, motif and composition per product (keep a style register; see `ui-style-picker`). Products share a level of craft and the legal/security footer, not a template.
- **Live sites change through a preview.** Redesigns of a live site ship to a preview URL or draft PR first and replace production only after the owner approves. Unlaunched sites can go straight to production.

## The process (in order)

1. **Read the current site and the product.** Screenshot the live site at desktop and phone width as the "before". List 8–12 things only this product has (its output, numbers, name, constraint, artefacts). The design idea comes from that list.
2. **Name the style** with `ui-style-picker`. At most two styles blended. Say which in the reply.
3. **Find the direction.** Write one idea sentence: the composition carries something only this product has. If you have an art-direction skill installed (for example taste-skill, linked in this kit's README), deal three directions and pick the one built on that item. Reference design systems (e.g. awesome-design-md) give principles only — never copy another brand's assets, logos or look.
4. **Write the copy first.** Headlines at most two lines at every width (~32 characters), one supporting sentence, full content in every section, no invented proof.
5. **Build** in the project's existing stack (or static HTML/CSS/JS). Tokens first, then the hero, then each section. Neighbouring sections never share a layout. One live interactive thing made from the product. Motion: one signature move, staggered entrances, feedback on every control, all with reduced-motion fallbacks.
6. **Gate** (all must pass before the owner sees it):
   - Taste/lint inspector of your art-direction skill at 0 failures at 1440, 768 and 390 px, if installed. Serve the built site over HTTP for inspection (file paths break root-relative assets). Document any deliberate exception next to the code.
   - Web interface guidelines review (e.g. Vercel's Web Interface Guidelines; skill linked in the README): focus, reduced motion, pause control on looping video, `translate="no"` on code, `aria-live` for copy confirmations, safe-area insets, touch-action, image dimensions.
   - Interaction test in a real browser (Playwright or playwright-cli): click and keyboard-drive every control, check the DOM result.
   - Accessibility: WCAG 2.2 AA (see `legal-compliance` item 21) — contrast ≥ 4.5:1, targets ≥ 24 px, focus never hidden behind sticky bars or the cookie banner, keyboard-only pass.
   - Headless browser check: no console errors, no CSP violations, no third-party requests, no cookies or storage before consent, no horizontal overflow, no broken links, at desktop and phone, plus a reduced-motion pass.
7. **Look and critique** the screenshots yourself. Fix the top three problems and look again (at most three rounds). Read every screenshot, not just the first screen.
8. **Ship** the repo's normal way with neutral PR and commit text, preview first for live sites, then verify production with `curl -sI` and the browser check.

## The look (defaults when nothing more specific applies)

- A ground with a slight tint (not pure `#000` on `#fff`), soft but readable ink, one accent used on the main action and perhaps one other thing. A contrasting field once or twice per page for rhythm.
- One characterful, self-hosted typeface per product, with its licence file (e.g. OFL.txt) shipped beside it. A mono face only for real code and literal tool output. Avoid defaulting to the system stack or the most common UI face as the brand voice.
- Big type, left-aligned, two to five sizes. Square or fully round buttons, decided once.
- None of the generated-page tells: eyebrow labels over every heading, 01/02/03 numbering, hairline grids, gradient text, glows, decorative glass, pill badges, rows of identical icon-topped cards, emoji as UI, purple gradients, fake dashboards, filler verbs.
- For developer tools, "dark ground + one neon accent + terminal hero" is itself the generic look. Earn it from the product or choose something else.

## Build rules

- **No third-party requests** on page load: no hosted font services, CDNs, analytics, pixels or embeds unless behind explicit consent. Self-host fonts with their licence.
- **CSP-ready:** no inline scripts, no `style=""`, no inline handlers; CSP `default-src 'self'`.
- Accessible and responsive down to 390 px with zero horizontal overflow; navigation collapses on small screens.
- SVG favicon, meta description, canonical URL, and an Open Graph image rendered from HTML at 1200×630 in the site's own style.

## Every site also gets (pair with the other skills in this kit)

- `legal-compliance`: Privacy and Terms that match what the product really does, an "as is" / not-professional-advice footer line for free projects, a trademark notice when other companies are named, licence and notice files (fonts too), consent before any optional tracking (prefer none), and a claims audit (no absolutes; numbers with method and date).
- `security-hardening`: headers (HSTS, nosniff, frame DENY, referrer, permissions, strict CSP) verified with `curl -sI` on the live URL; frontend rules (URL validation, no raw HTML from data).
- `abuse-prevention`: only if the site has endpoints or forms.
- Nothing that can't be backed up: don't link private repos or unpublished packages as if they were live — say "launching <date>".
