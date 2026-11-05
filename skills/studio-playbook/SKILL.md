---
name: studio-playbook
description: "Use at the start of a build, launch, release or publish, a security or legal fix, or when installing a skill, agent or plugin. Loads the studio operating rules. Not for small one-off questions."
version: 1.0.0
license: MIT
metadata:
  author: Ship at Midnight Authors <65935477+shreyassaw5394@users.noreply.github.com>
  tags: [playbook, release, workflow]
---

# Studio playbook

## Purpose

Loads the studio's operating rules at the start of any build, launch, release, publish, security or legal fix, and when a new skill, agent or plugin is installed: design first, plan then build, test before commit, neutral wording for security and legal fixes, nothing public without the owner, release gates, skill intake scanning, and a model per task.

## Prerequisites

- The kit's PLAYBOOK file (the full rules) readable at the PLAYBOOK file in the plugin root (`${CLAUDE_PLUGIN_ROOT}`).
- For skill intake: `git`, `uv` and `python3` (used by the audit script).

## Instructions

Read the full rules in the PLAYBOOK file in the plugin root (`${CLAUDE_PLUGIN_ROOT}`) before acting. The short version:

1. **Design first.** The product is the hero; say no to what doesn't serve it; avoid template-looking pages (`product-site-design`, `ui-style-picker`).
2. **Plan, then build** in small steps, each with a check you can run. Surgical changes only. GSD and agent ceremony only for ground-up work (new project, big new phase); small local tasks are done directly or with one small agent, and you say which path you took.
3. **Test before commit.** Project checks plus exercising the real app; review the diff with the `ecc-*` reviewer agents.
4. **Debug by observing**; name a root cause only with evidence.
5. **Neutral public text** for security and legal fixes; reasoning goes to the owner in chat.
6. **Nothing public without the owner's explicit yes**: no public repo, publish, deploy, listing or announcement. New repos default to private.
7. **Release gates**: a full security pass (`security-hardening`, `abuse-prevention`, `gha-security-review`, history secret scan) and a full legal pass (`legal-compliance`) before any publish.
8. **Skill intake**: scan every new skill, agent or plugin with both scanners first:
   `bash "${CLAUDE_PLUGIN_ROOT}/tools/skill-audit/audit.sh" <folder-or-agent.md>` — policy in `${CLAUDE_PLUGIN_ROOT}/tools/skill-audit/POLICY.md`. Read every high or critical finding yourself.
9. **Model per task** via the agents' `model:` pins (opus plans, sonnet reviews, haiku does narrow mechanical fixes).
10. **Every repo gets a face**: an original SVG logo and an intro image rendered from HTML.

## Examples

```text
Request: "publish the new package to npm"
Playbook path: rule 6 applies (nothing public without the owner's yes), so run the release gates (rule 7),
then stop at a ship gate that lists verified items, unverified items and the owner's next taps.
```

## Limitations

- The rules are guidance for the agent; they do not block a command on their own. Permission settings and branch protection do that.
- The playbook states the studio's own preferences, not legal or security advice.

## Troubleshooting

- Problem: The PLAYBOOK file cannot be found. Fix: check that the plugin is loaded (`--plugin-dir` or installed) so `${CLAUDE_PLUGIN_ROOT}` resolves; otherwise use the short list above.
- Problem: the audit script fails to start. Fix: install the missing tool it names (`git`, `uv` or `python3`) and re-run; do not install the scanned skill until the scan has run.
