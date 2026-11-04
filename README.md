<p align="center"><img src="assets/logo.svg" width="96" height="96" alt="Ship at Midnight kit logo: a clock face with both hands on twelve"></p>

<h1 align="center">Ship at Midnight kit</h1>

<p align="center">A studio workflow for Claude Code, from first sketch to release gate.</p>

<p align="center"><img src="assets/intro.png" width="880" alt="The kit's contents: design skills, security and legal skills, skill intake scanning, and model-pinned agents"></p>

One Claude Code plugin with the skills, agents and rules a small studio uses to design, build, review, secure and ship products with an AI coding agent. The rules are in [PLAYBOOK.md](PLAYBOOK.md); the skills and agents put them to work.

> Free, as-is, with no warranty. Nothing here is legal or security advice. The legal and security skills are practical checklists that reduce risk; they don't replace a lawyer or a security professional.

## Install

This repository is private. You need read access to it on GitHub, and `gh auth login` (or git credentials) on your machine.

```
/plugin marketplace add shreyassaw5394/shipatmidnight-kit
/plugin install shipatmidnight-kit@shipatmidnight-kit
```

From a terminal: `claude plugin marketplace add shreyassaw5394/shipatmidnight-kit` then `claude plugin install shipatmidnight-kit@shipatmidnight-kit`.

To try it without installing: `git clone` the repo and run `claude --plugin-dir ./shipatmidnight-kit`.

Skills and agents are namespaced by the plugin, e.g. `shipatmidnight-kit:security-hardening` and `shipatmidnight-kit:ecc-code-reviewer`.

## What's inside

### Skills

| Skill | What it does |
|---|---|
| `studio-playbook` | Loads the operating rules (PLAYBOOK.md) at the start of builds, releases and installs. |
| `product-site-design` | Design-first process for any site or UI: the product is the hero, restraint, real material, and the gates every page passes. |
| `ui-style-picker` | Names a visual style before building, writes a six-line style spec, checks contrast per style. Includes a contrast checker script. |
| `apple-motion` | Fluid, physical interface motion for the web (springs, gestures, interruptible transitions, reduced motion). |
| `game-feel` | "Juice" for games: hit-stop, screen shake, easing, squash and stretch, layered feedback. |
| `security-hardening` | Repo and supply chain, HTTP headers, auth, leakage, local-only servers, MCP servers, VS Code extensions, CI publishing. |
| `abuse-prevention` | Rate limits, cost caps, SSRF-safe fetching, spam and AI-specific abuse. Includes `safeFetch.ts` and a framework-neutral `rateLimit.ts`, with tests. |
| `legal-compliance` | Consent before tracking, policies, age gates, licences in every distributable, claims audit, accessibility, AI disclosure. Includes a privacy probe and a third-party licence generator. |
| `gha-security-review` | Exploit-focused review of GitHub Actions workflows. |

### Agents (model-pinned)

| Agent | Model | Use it for |
|---|---|---|
| `ecc-planner`, `ecc-architect` | opus | Plans and architecture decisions |
| `ecc-code-reviewer`, `ecc-typescript-reviewer`, `ecc-react-reviewer`, `ecc-database-reviewer`, `ecc-security-reviewer`, `ecc-tdd-guide` | sonnet | Review, security, database and test-first work |
| `ecc-build-error-resolver`, `ecc-silent-failure-hunter` | haiku | Getting the build green; finding swallowed errors |

### Tools

- `tools/skill-audit/audit.sh` runs NVIDIA SkillSpector and SkillEvaluator (fetched at pinned tags on first run, not bundled) on any skill folder or agent file. `tools/skill-audit/POLICY.md` is the intake and anti-bloat policy.

## Recommended companions (linked, not bundled)

These are part of the same workflow but live upstream. Install them from their own repos at the pinned commit, and scan each one with `audit.sh` first.

| What | Where (pinned) | Licence | Why it's linked, not bundled |
|---|---|---|---|
| karpathy-guidelines (coding behaviour) | [multica-ai/andrej-karpathy-skills @ 2c60614](https://github.com/multica-ai/andrej-karpathy-skills/tree/2c606141936f1eeef17fa3043a72095b4765b9c2) | MIT stated in README/manifest; no LICENSE file | Ships its own plugin marketplace |
| GSD (phase-based planning and execution) | [gsd-build/get-shit-done @ v1.20.4](https://github.com/gsd-build/get-shit-done/tree/v1.20.4) (npm `get-shit-done-cc@1.20.4`) | MIT | Upstream is **archived** (May 2026). Its installer writes absolute paths into the agent files, so they can't be shipped as-is. The maintained fork is [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) (MIT); scan it before adopting, it is much larger. If you use 1.20.4, don't enable its update-check hook (it polls the archived package). |
| taste-skill (art direction, inspector) | [Leonxlnx/taste-skill @ 12af471](https://github.com/Leonxlnx/taste-skill/tree/12af471f627f866411b4bd785b19646d3672784c) | MIT | Large and changes often; downloaded photos and fonts carry their own licences |
| image-to-code | [Leonxlnx/imagegen-skills @ beb16b0](https://github.com/Leonxlnx/imagegen-skills/tree/beb16b0d0f4dae9a6f5cb04ea41e97b93a54ab8e) | MIT | Needs an image-generation tool |
| awesome-design-md (reference design systems) | [VoltAgent/awesome-design-md @ fcc7028](https://github.com/VoltAgent/awesome-design-md/tree/fcc70284932276d085f01ef9f83edde90b1258cb) | MIT | Contains other brands' design descriptions; use for principles only |
| web-design-guidelines | [vercel-labs/agent-skills @ 1a2c79d](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62) · guidelines: [vercel-labs/web-interface-guidelines @ 434b7f9](https://github.com/vercel-labs/web-interface-guidelines/tree/434b7f91364665f2f733b310ec54809bf8f37937) | README says MIT, no LICENSE file · MIT | Licence file missing upstream; fetches live guidelines anyway |
| playwright-cli (browser testing) | [microsoft/playwright-cli @ v0.1.23](https://github.com/microsoft/playwright-cli/tree/v0.1.23) | Apache-2.0 | Install with npm |
| supabase, supabase-postgres-best-practices | [supabase/agent-skills @ v0.1.9](https://github.com/supabase/agent-skills/tree/v0.1.9) | MIT | Updated often upstream |
| legal-suite picks | [anthropics/claude-for-legal @ 4a6c651](https://github.com/anthropics/claude-for-legal/tree/4a6c651889c97cc9140580363c73e0eb17379c2b) | Apache-2.0 | Official upstream plugin |
| security-audit | [cloudflare/security-audit-skill @ c1c8a8c](https://github.com/cloudflare/security-audit-skill/tree/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8) | MIT | Upstream skill |
| NVIDIA SkillSpector / SkillEvaluator | [SkillSpector v2.13.3](https://github.com/NVIDIA/SkillSpector/tree/v2.13.3) · [SkillEvaluator v0.7.1](https://github.com/NVIDIA/SkillEvaluator/tree/v0.7.1) | Apache-2.0 | Fetched by `audit.sh` at run time |
| Debug Anything (runtime observation for agents: MCP server + skill) | [shreyassaw5394/debuganything @ 925fd9d](https://github.com/shreyassaw5394/debuganything/tree/925fd9df5ff7e25a4d1df0cdbd943f640a8e0dd9) | MIT | Ships as its own plugin with the MCP server it needs |
| Agent Theatre (watch and replay agent sessions) | [shreyassaw5394/agent-theatre @ v1.8.1](https://github.com/shreyassaw5394/agent-theatre/tree/v1.8.1) | MIT | Ships as its own plugin with hooks |

Not included on purpose: Sentry's `skill-scanner` (overlaps with `audit.sh`; get it from [getsentry/skills](https://github.com/getsentry/skills) if you want it), Apple HIG-derived design-review skills (unlicensed upstream, Apple-copyrighted text), account-synced Anthropic skills, any personal settings, memory, hooks or keys.

## Scanning and provenance

Every skill and agent in this repo was scanned with both scanners before publishing; see [SECURITY-SCAN.md](SECURITY-SCAN.md). Third-party pieces and their licences are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Licence

MIT for the kit's own files ([LICENSE](LICENSE)). Bundled third-party pieces keep their own licences (MIT or Apache-2.0), with LICENSE and NOTICE files in their folders and in `THIRD_PARTY/`.

Names of companies and products are used only to identify them; no affiliation or endorsement is implied. The kit is free and provided as-is.

## Credits

Made by Shreyas Sawant. Companion products by the same author: Debug Anything and Agent Theatre (linked above). Third-party credits are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
