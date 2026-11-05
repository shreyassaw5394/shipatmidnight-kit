---
name: legal-compliance
description: "Use when shipping or auditing a site, app, package or extension for legal exposure, or before launching a product. Covers consent, policies, age checks, licence notices, claims. Not legal advice."
version: 1.0.0
license: MIT
metadata:
  author: Ship at Midnight Authors <65935477+shreyassaw5394@users.noreply.github.com>
  tags: [legal, privacy, licences, compliance]
---

# Legal compliance pass

## Purpose

A practical risk-reduction pass for the products the studio ships (sites, apps, packages, extensions, MCP servers). Typical requests: "make sure we don't get sued", "privacy policy", "cookie banner", "tracking pixels", "GDPR", "CCPA", "COPPA", "age gate", "DMCA", "terms of service", "licence files", or a check before launching a new product. It is not legal advice: say so once in the final report and suggest a lawyer review for anything touching money or real user data.

## Prerequisites

- Read access to the code, backend configuration and every README and page of the product.
- Node.js for the bundled scripts (`scripts/third-party-licenses.mjs`, `scripts/privacy-probe.mjs`); the probe also needs Playwright.
- Optional: `license-checker-rseidelsohn` (npm) or `pip-licenses` (Python) for dependency licence summaries.

## Instructions

Read the standing rules, then work through the numbered pass for the product, then run Verify and write the Report.

## Standing rules

- **Keep the legal reasoning out of commits, PRs and public files.** PR titles and bodies stay short and neutral ("Privacy page, consent, security headers"). Explain the why to the owner in chat only.
- **Say what the product is.** If it is free and non-commercial, state it in the footer, Privacy Policy, Terms, README and every package README (e.g. "a free, non-commercial project by an independent developer"). If it charges money, the payment and subscription items below apply in full and a lawyer review is strongly advised.
- **Accuracy over boilerplate.** Read the code and the backend before writing a policy. Every sentence must match what the product actually does (what is stored, for how long, which processors, what is sent where). A wrong policy is worse than a short one.
- **Test before committing**, and verify on production after deploy.

## The pass, per product

Work out first which features exist (sign-up? uploads? emails? payments? user-generated public pages? analytics?). Items that don't apply get an explicit "not applicable because …" in the report, so nothing is skipped silently.

1. **Tracking before consent.** Nothing optional (analytics, pixels, session replay, chat widgets, third-party embeds) may load or set a cookie before the visitor opts in. "Reject" must be as prominent as "Accept". Treat Global Privacy Control and Do Not Track as a refusal with no banner. Provide "Cookie settings" in the footer to change the choice. Store the decision with a timestamp and policy version.
2. **No third-party requests on page load.** Self-host fonts (font packages or copied woff2 files), not a hosted font service. Move browser-side calls to GitHub, npm, PyPI and similar behind a same-origin serverless function with CDN caching. Inline avatars as data URIs from that function.
3. **Session replay** off by default. If ever on: consent first, mask all inputs and text.
4. **Age gate on every sign-up path** (OAuth included). 16+ by default; 18+ when the product involves finance, credit, gambling, alcohol or adult content. Use a neutral date-of-birth field for strict cases (never send or store the date; remember a failed check on the device). For OAuth, a required "I am at least N and agree to the Terms and Privacy Policy" checkbox before the redirect starts, covering every sign-in button (gate it inside the shared sign-in function).
5. **Privacy Policy** (`/privacy`): who runs it and a contact; what is collected, why, legal basis and retention per category; cookies/local storage table; processors with countries; international transfers (DPF / SCCs); security and breach notice; rights and how to use them (30 days, 45 under CCPA); California section ("we do not sell or share"); children; automated processing/AI; changes. Linked from every footer and from sign-up.
6. **Terms** (`/terms`): agreement, eligibility, what the service is, user content licence, acceptable use, AI output disclaimer, copyright complaints (DMCA notice elements + counter-notice + repeat infringers), payments ("free today; renewal terms shown before purchase"), disclaimers and liability cap, termination, changes with notice, contact.
7. **Self-serve deletion** where there are accounts: a "Delete all my data" control, plus email for account closure.
8. **Uploads and public user content**: a rights confirmation before the first upload ("I own this or have permission…"), copyright section in Terms, and tell the owner to register a DMCA designated agent at copyright.gov (manual, about $6, needs a postal address; list every service with user uploads or public pages).
9. **Referral/affiliate links**: a disclosure next to listings that the poster may earn a reward (FTC).
10. **Email**: transactional emails say why the recipient got them. Marketing email only opt-in, with one-click unsubscribe and a postal address (CAN-SPAM). Waitlist forms say what the address is used for.
11. **Subscriptions**: price, billing interval, auto-renewal and how to cancel shown right next to the buy button, before payment.
12. **Marketing claims about AI**: no absolutes ("no hallucinations", "100% accurate", "guaranteed", "improves with every query" unless literally true). Comparison pages carry an "as of <date>" and a trademark notice.
13. **Open-source licences in every distributable**: LICENSE (and NOTICE for Apache-2.0) inside each npm tarball, wheel, sdist, VSIX. For bundles that inline third-party code, generate notices from source maps with `scripts/third-party-licenses.mjs` (wire it into the build; check `npm pack --dry-run`, the built wheel, and `unzip -l *.vsix`). Fresh-install audit of what users actually get: install the packed tarball in an empty folder, `npm audit --omit=dev`, licence summary.
14. **Remove dev scripts from production** (for example a hosted editor script injected by a site builder): strip at build time, keep for dev.

15. **What we ship *with*, not just what we ship.** For every distributable (site bundle, npm, wheel, VSIX, MCP server) classify the production dependency tree: permissive / weak copyleft (LGPL, MPL, EPL) / strong copyleft (GPL, AGPL) / non-OSI "source-available" (SSPL, BUSL, Elastic, Commons Clause, fair-source) / unknown.
    - Unknown or missing licence = **needs review**; do not assume "probably MIT". Read the actual LICENSE text when metadata and file disagree.
    - AGPL anywhere in a hosted service (an API, a hosted MCP server) and GPL in anything we distribute (CLI, VSIX, wheel) are blockers until replaced or reviewed.
    - Watch relicensed projects (Redis, Elastic, HashiCorp, etc.): the pinned version decides the licence.
    - Our own licences agree in three places: `LICENSE`, SPDX `license` in package.json/pyproject, and the README. If parts of a repo carry different licences (e.g. Apache-2.0 + BSL-1.1), each directory's licence is stated where it lives.
    - Fonts and images count too: keep OFL.txt (or the asset's licence) beside every self-hosted font.
    - Quick check: `npx license-checker-rseidelsohn@5.0.1 --production --summary` (npm) / `pip-licenses` (Python) on a fresh install of the packed artifact.
    _Source: Anthropic claude-for-legal `ip-legal/oss-review` (Apache-2.0)._
16. **Claims audit before every launch or copy change.** List every factual, comparative or absolute claim on the site, READMEs, npm/PyPI descriptions and launch posts. For each: is it true today, can we show the evidence, does the product still do it?
    - "Only", "first", "no competitor does X", "the most accurate": cut unless we can prove it *and* date it. One counter-example makes it false. Prefer "we verify X" over "nobody else verifies X".
    - Implied claims carry the same weight: "enterprise-grade", "secure", "compliant", "HIPAA/GDPR-ready", "trusted by N". Say exactly what is true (e.g. "releases are signed with Sigstore provenance") or drop it.
    - Numbers come from a reproducible test, with method and date shown or linked. Counts are current, not cumulative.
    - Drift check: compare copy against the code and changelog; marketing text often describes an older spec.
    _Source: Anthropic claude-for-legal `product-legal/marketing-claims-review` (Apache-2.0)._
17. **Name knockout check before a new product or package name goes public.** Search USPTO (TESS successor), EUIPO/TMview, npm, PyPI, VS Code Marketplace, GitHub orgs, and .com/.dev domains for the same or confusingly similar names in software. Don't build names on other companies' marks ("…GPT", "Claude…", "…Copilot"). Use others' marks only in a nominative way ("works with Claude Code") plus the trademark notice. Record the search date in the repo's private notes. A lawyer's clearance opinion is still the real answer for anything we might monetise.
    _Source: Anthropic claude-for-legal `ip-legal/clearance` (Apache-2.0)._
18. **Access/export, not just delete.** Where there are accounts: a self-serve "Download my data" (JSON) alongside "Delete all my data", covering every store (DB rows, storage buckets, caches, analytics, logs keyed by user id). Requests that arrive by email: verify the requester controls the account email before sending anything; reply within 30 days (45 for California); keep a one-line log of each request (date, type, done).
19. **Retention is enforced by a job, not a sentence.** Every store holding personal data has a retention period in the Privacy Policy *and* a scheduled job (Supabase `pg_cron`, Vercel cron) that deletes/anonymises past it, with expired rows checked in tests. Logs: no tokens, keys, passwords or full request bodies; truncate IPs (IPv4 /24, IPv6 /48) in anything kept past the rate-limit window.
    _Sources: Anthropic claude-for-legal `privacy-legal/dsar-response` (Apache-2.0); github/awesome-copilot `gdpr-compliant` (MIT)._
20. **When a takedown notice arrives** (shared sessions, public pages, uploads): check it has the six §512(c)(3) elements; if complete, remove/disable the content promptly, tell the uploader with a copy of the notice, accept a counter-notice and restore in 10–14 business days unless the complainant files suit; count strikes per account for the repeat-infringer policy. Keep a private log. Incomplete notices get a short reply listing what's missing. Don't argue fair use on the claimant's behalf; that's a lawyer question.
    _Source: Anthropic claude-for-legal `ip-legal/takedown` (Apache-2.0)._
21. **WCAG 2.2 AA on every site/UI.** Beyond contrast and alt text, check the 2.2 additions: target size ≥24×24 CSS px (2.5.8), focused element never fully hidden by sticky headers/cookie banner (2.4.11), a non-drag alternative for any drag interaction (2.5.7), no cognitive test/CAPTCHA-only login and allow paste into password/OTP fields (3.3.8), help/contact link in a consistent place (3.2.6), don't make users re-enter info in one flow (3.3.7). Also: `lang` on `<html>`, skip link, visible focus, labelled form fields, errors announced (`aria-live`), reduced-motion respected.
    - Automated pass in the site test: `@axe-core/playwright` (or `npx @axe-core/cli@4.14.0 <url>`) with zero serious/critical violations, plus a keyboard-only walkthrough.
    - Add a short `/accessibility` statement (target standard, known gaps, contact). The EU Accessibility Act exempts microenterprises *providing services*, and free non-commercial projects may sit outside its commercial scope (check). US ADA web suits don't depend on revenue, so treat AA as the baseline anyway.
    _Source: Addy Osmani `web-quality-skills/accessibility` (MIT); W3C WCAG 2.2._
22. **AI disclosure.** Any feature where a person reads model-generated text says so where it appears (not only in Terms): "AI-generated, may be wrong; check the sources." EU AI Act Art. 50 transparency duties start applying from Aug 2026 (check the current status; the EU has proposed timing changes). The habit costs nothing.
23. **Liability posture for free projects.** Every site and package of a free project says, near the footer and in Terms: a free, non-commercial project by an independent developer; provided "as is" without warranty; liability limited to the extent the law allows; automated/AI output may be wrong or incomplete and is not professional (legal, medical, financial, security) advice; the user (and their agent) decides what to rely on. Keep this language consistent across your sites, and do not contradict it in marketing copy (no "guaranteed", "trusted", "verified truth").

## Verify

- `node scripts/privacy-probe.mjs` with the page URL as its argument, run from a folder with Playwright.
- Expected: no third-party requests and no cookies before a choice.
- After Reject, or with Global Privacy Control enabled, still none; analytics load only after Accept.
- Screenshot the banner, sign-up gate and footers at 1280 px and 390 px; check footer links don't overflow.
- After deploy, re-run the probe against production and confirm `/privacy` and `/terms` return 200.

## Report

Lead with what changed per product and what is live. Then a short "what only the owner can do" list (DMCA agent, postal address, provider plan terms, lawyer review). Note pre-existing failures separately from new work.

## Examples

```text
Request: "we are about to launch a free CLI with a small marketing site"
Pass: items 1-3 (no tracking before consent, nothing third-party on load), 5-6 (Privacy, Terms matching the code),
      13-16 (licence files in the npm tarball, dependency licences, claims audit), 21 (accessibility), 23 (liability wording).
Report: per-item result, "not applicable because ..." for sign-up and payments, and a list of owner-only actions.
```

## Limitations

- A checklist and scripts, not legal advice. Laws, deadlines and fees quoted here change; confirm current rules before relying on them.
- `privacy-probe.mjs` observes network requests and cookies in one browser; it does not prove a policy is accurate.
- `third-party-licenses.mjs` reads source maps, so it only covers bundles built with source maps enabled.

## Troubleshooting

- Problem: `third-party-licenses.mjs` reports "no source maps found". Fix: enable source maps in the build and point the script at the output directory.
- Problem: a package is listed as "without licence text". Fix: read its repository's LICENSE and add the text by hand, or replace the package.
- Problem: the privacy probe cannot find the banner. Fix: pass the banner selector and the Reject and Accept button texts as arguments.
- Problem: the probe fails to start. Fix: install Playwright and a browser (`playwright install chromium`) in the folder where you run it.
