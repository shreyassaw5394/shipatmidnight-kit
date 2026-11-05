# Third-party notices

The Ship at Midnight kit's own files are MIT-licensed (see `LICENSE`). The pieces below were written by others and are bundled under their own licences. Each one also carries its licence (and NOTICE, where upstream has one) inside its own folder, and a copy is kept in `THIRD_PARTY/`.

| Piece in this kit | Upstream (pinned) | Licence | Copyright | What changed |
|---|---|---|---|---|
| `agents/ecc-*.md` (10 agents) | [affaan-m/ECC](https://github.com/affaan-m/ECC) `agents/` @ `b38be6a` | MIT — `THIRD_PARTY/ECC-LICENSE` | (c) 2026 Affaan Mustafa | Renamed with an `ecc-` prefix; "PROACTIVELY" / "MUST BE USED" removed from descriptions; `model:` pins changed for `ecc-build-error-resolver` and `ecc-silent-failure-hunter` (sonnet → haiku); illustrative API-key strings in `ecc-code-reviewer` reworded; provenance comment added at the end of each file. |
| `skills/game-feel` | [gamedev-skills/awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) `skills/disciplines/game-feel` @ `19d93f9` | Apache-2.0 — `THIRD_PARTY/game-feel-LICENSE` | (c) 2026 Abhishek Barali and contributors | No changes to skill files. Upstream `NOTICE` reproduced verbatim (`THIRD_PARTY/game-feel-NOTICE`, `skills/game-feel/NOTICE`). |
| `skills/gha-security-review` | [getsentry/skills](https://github.com/getsentry/skills) `skills/gha-security-review` @ `0c464f411bdfb8d4c12314b36264d06cb2f60270` | Apache-2.0 — `THIRD_PARTY/sentry-skills-LICENSE` | getsentry/skills authors (no copyright line upstream) | No changes to skill files; `LICENSE` and `CHANGES.md` added. |
| `skills/security-audit` | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) `skills/security-audit` @ `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8` | MIT — `THIRD_PARTY/security-audit-LICENSE` | (c) 2025-2026 Cloudflare, Inc. | None; byte-identical to upstream. `SOURCE.txt` added. |
| `skills/legal-suite` | [anthropics/claude-for-legal](https://github.com/anthropics/claude-for-legal) @ `4a6c651889c97cc9140580363c73e0eb17379c2b` | Apache-2.0 — `THIRD_PARTY/claude-for-legal-LICENSE` | Anthropic, PBC (no copyright line or NOTICE upstream) | 11 of the plugin's skills only, each upstream `SKILL.md` unchanged but moved to `parts/<area>-<name>/`; router `SKILL.md` and `SOURCE.txt` written by this kit. No connectors or MCP servers. |
| `skills/apple-motion` | [emilkowalski/skills](https://github.com/emilkowalski/skills) `skills/apple-design` @ `a81dbca` | MIT — `THIRD_PARTY/apple-motion-LICENSE` | (c) 2026 Emil Kowalski | Renamed from `apple-design` to `apple-motion` (frontmatter name only). |
| `skills/ui-style-picker/references/ui-ux-pro-max-styles.csv` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) `src/ui-ux-pro-max/data/styles.csv` @ `a38d04c` | MIT — `THIRD_PARTY/ui-ux-pro-max-LICENSE` | (c) 2024 Next Level Builder | Unmodified. |

## Credits for ideas (no text or code copied)

- `skills/ui-style-picker/references/style-catalog.md`: the idea of naming ten visual styles comes from a social post by Sachin (@egpg.builds); the catalogue is written in our own words.
- `skills/legal-compliance`, `skills/security-hardening`, `skills/abuse-prevention`: several items are paraphrased from, and credit inline, Anthropic `claude-for-legal` (Apache-2.0), Sentry skills (Apache-2.0), OpenAI security skills (Apache-2.0), supabase/agent-skills (MIT), github/awesome-copilot (MIT), Addy Osmani web-quality-skills (MIT), Trail of Bits skills (CC-BY-SA-4.0, ideas paraphrased, no text copied), Semgrep `llm-security` (ideas only), OWASP and W3C publications.

## Fetched at run time, not bundled

`tools/skill-audit/audit.sh` downloads these on first use, at pinned tags. They are not part of this repository:

- [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) `v2.13.3` — Apache-2.0
- [NVIDIA/SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) `v0.7.1` (`3da8c573ff1aaf7e9d560f4ad58a019700fa014d`) — Apache-2.0

## Fonts used to render images

`assets/intro.png` was rendered with IBM Plex Sans and IBM Plex Mono (SIL Open Font License 1.1, (c) IBM Corp.). No font files are distributed in this repository.

## Trademarks

Names of companies and products (Anthropic, Claude, Apple, Sentry, NVIDIA, Vercel, Supabase, GitHub, Microsoft and others) are used only to identify them. No affiliation with or endorsement by any of them is implied.
