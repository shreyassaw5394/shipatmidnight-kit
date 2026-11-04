---
name: studio-playbook
description: Use at the start of any build, launch, release, publish, security or legal fix, or when installing a new skill, agent or plugin. Loads the studio's operating rules — design first, plan then build, test before commit, neutral wording for security/legal fixes, nothing public without the owner, release gates, skill intake scanning, model choice per task.
---

# Studio playbook

Read the full rules in `${CLAUDE_PLUGIN_ROOT}/PLAYBOOK.md` before acting. The short version:

1. **Design first.** The product is the hero; say no to what doesn't serve it; never a vibe-coded page (`product-site-design`, `ui-style-picker`).
2. **Plan, then build** in small steps, each with a check you can run. Surgical changes only.
3. **Test before commit.** Project checks + exercise the real app; review the diff with the `ecc-*` reviewer agents.
4. **Debug by observing**; no root cause without evidence.
5. **Neutral public text** for security and legal fixes; reasoning goes to the owner in chat.
6. **Nothing public without the owner's explicit yes**: no public repo, publish, deploy, listing or announcement. New repos default to private.
7. **Release gates**: full security pass (`security-hardening`, `abuse-prevention`, `gha-security-review`, history secret scan) and full legal pass (`legal-compliance`) before any publish.
8. **Skill intake**: scan every new skill, agent or plugin with both scanners first:
   `bash "${CLAUDE_PLUGIN_ROOT}/tools/skill-audit/audit.sh" <folder-or-agent.md>` — policy in `${CLAUDE_PLUGIN_ROOT}/tools/skill-audit/POLICY.md`. Read every high/critical finding yourself.
9. **Model per task** via the agents' `model:` pins (opus plans, sonnet reviews, haiku does narrow mechanical fixes).
10. **Every repo gets a face**: an original SVG logo and an intro image rendered from HTML.
