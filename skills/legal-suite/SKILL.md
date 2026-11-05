---
name: legal-suite
description: Anthropic claude-for-legal picks for shipping open-source products — OSS licence review, trademark/name clearance, freedom-to-operate triage, invention intake, DMCA takedowns, privacy impact assessment, data-subject requests, AI use-case triage, EU AI Act assessment, marketing-claims review, launch review. Use alongside legal-compliance before any launch, package publish or public repo.
---

# Legal suite (picked from Anthropic's claude-for-legal)

First-pass legal workflows, not legal advice. Pair with the `legal-compliance` skill (our house rules). Pick the part that fits and read its SKILL.md:

| Need | Read |
|---|---|
| Open-source licence compliance of what we ship | parts/ip-legal-oss-review/SKILL.md |
| Name / trademark knockout before a name goes public | parts/ip-legal-clearance/SKILL.md |
| Could this product infringe someone's patent? (first pass) | parts/ip-legal-fto-triage/SKILL.md |
| Record a new invention (date, what's new, prior art) | parts/ip-legal-invention-intake/SKILL.md |
| A takedown notice arrived, or we need to send one | parts/ip-legal-takedown/SKILL.md |
| Privacy impact assessment for a feature that touches personal data | parts/privacy-legal-pia-generation/SKILL.md |
| Someone asked for their data / deletion | parts/privacy-legal-dsar-response/SKILL.md |
| Is this use of personal data / AI OK? | parts/privacy-legal-use-case-triage/SKILL.md |
| EU AI Act / AI impact assessment | parts/ai-governance-legal-aia-generation/SKILL.md |
| Check every marketing claim before launch | parts/product-legal-marketing-claims-review/SKILL.md |
| Pre-launch legal review | parts/product-legal-launch-review/SKILL.md |

Notes: the parts reference a cold-start "practice profile"; for our products use the facts in the project's PROJECT.md / privacy policy instead. The upstream plugin MCP connectors (legal research services) are NOT installed.

