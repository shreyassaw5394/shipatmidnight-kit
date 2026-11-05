---
name: vision
description: "Use when the user types /vision with a product idea, or asks where a vision flow stands. Runs the studio flow to a release gate with defaults and few questions; no publishing. Not for small edits."
argument-hint: "[one paragraph about the product] | status | resume"
version: 1.0.0
license: MIT
metadata:
  author: Ship at Midnight Authors <65935477+shreyassaw5394@users.noreply.github.com>
  tags: [workflow, release, planning]
---

# /vision

## Purpose

Runs the studio flow end to end from one product paragraph to a release candidate that stops at a ship gate: name check, GSD project in auto mode, one plan-check round, lean executors, review, security and legal passes, logo, README and a product page draft. It uses defaults and asks the owner only when blocked, and it does not publish, deploy or push to a public remote. Input: `$ARGUMENTS`. This is a workflow, not magic: every step is a checklist a model runs, and the gate says what was and was not checked.

## Prerequisites

- Claude Code with this kit loaded, and `git`. `gh` is used to check repository visibility when a remote exists.
- GSD installed (see step 0) for ground-up work; small local tasks do not need it.
- Optional: `gitleaks` for the secret scan, a headless browser for the intro image.

## Instructions

File naming: working files live in the `.planning` folder and are Markdown (extension omitted below): VISION, VISION-STATE, VISION-DECISIONS, CONVENTIONS and SHIP-GATE, plus GSD's own STATE and its config (JSON). Templates are in this skill's `references` folder and its `assets` folder.

**Hard rules for the whole run**
- Do not `git push` to any public remote, publish a package, deploy, or create a public repo or listing. The gate asks; the owner taps.
- Ask the owner only when blocked (name conflict, missing tool, failing build after two fixes, a decision with money or user data in it). For anything else, take the default below and list the choice in the VISION-DECISIONS log, then move on.
- Follow the `token-economy` skill: 2-3 parallel agents, model per task, commit lock for parallel commits, short reports.
- Commit messages stay neutral (no security or legal detail in public text).

## Subcommands

- `status`: read VISION-STATE (and GSD's STATE if present), print the current step, what landed (`git log --oneline -15`), what is next. No changes.
- `resume`: after a usage limit or a closed session. Read VISION-STATE, `git status`, `git log`. Continue from the recorded step; do not restart a finished step; resume stopped GSD agents by message where possible (`token-economy` section 7). Drop to 1-2 agents for the rest of the window.
- Anything else is the vision paragraph. Start at step 0.

## Step 0: preflight (stop here if anything is missing)

1. Must be inside a git repo (`git rev-parse --git-dir`). If not: `git init` and continue. Check `git remote -v`: if a remote exists and `gh repo view --json visibility` says PUBLIC, **tell the owner and stop**; this flow only runs against private or local repos.
2. GSD must be installed: `test -f ~/.claude/commands/gsd/new-project.md && test -f ~/.claude/get-shit-done/VERSION`. If missing, print exactly this and stop:
   `npx get-shit-done-cc@1.20.4 --claude --global` (upstream is archived; pinned version; do not enable its update-check hook)
3. Write VISION with the paragraph and today's date. Write VISION-STATE from the state template in this skill's `references` folder. Update it at the end of every step; it is the resume point.

## Step 0.5: pick the path, say which and why

GSD is for ground-up work only: a new project, or a big new phase of an existing one (several files, more than one session, needs a plan). A small local task (a fix, a doc edit, a config change, a single-file feature) gets **no planner, plan-check or executor ceremony**: do it directly, or with one small agent on the mid model, run the project's own checks, commit, and go straight to step 5 with a short gate. Decide from the paragraph and the repo (`git log --oneline -5`, file count, whether `.planning/` already exists). Print one line before doing anything: `Path: GSD (ground-up) because ...` or `Path: direct because ...`, and record it in VISION-DECISIONS. Steps 1-4 below are the GSD path; the direct path runs step 1 only when the work adds a new product name, and step 3 only for the files it touched.

## Step 1: name knockout check

Take the product name from the paragraph (or propose one short, plain name and record it). Search what you can reach: npm (`npm view <name> name` exits 0 if taken), PyPI (the PyPI JSON API for the name), GitHub (`gh search repos <name> --limit 5`), and a web search for the name plus "software" or "app" if a search tool is available. Names built on others' marks (names ending in GPT or Copilot, or starting with Claude) are rejected. Record the search date and results in VISION-DECISIONS. A same-name hit in the same category is **blocking**: propose two alternatives and ask. State plainly in the gate: this is a scripted search, not a trademark clearance opinion.

## Step 2: GSD project in auto mode

1. Write the GSD config in `.planning` from the config in this skill's `assets` folder (yolo, quick depth, balanced profile, research on, one plan-check pass, verifier on, auto-advance on, 3 concurrent agents, commit docs).
2. Run `/gsd:new-project --auto` with the VISION file. GSD 1.20.4 still asks three setup questions in auto mode (depth, git, models); answer with the config already written (Quick, commit docs, Balanced) if the harness lets you, otherwise this is the one place the owner has to press enter three times. Say so once.
3. GSD then chains discuss → plan → execute for each phase on its own (`auto_advance`). Before the first execute wave, write CONVENTIONS from the conventions template in this skill's `references` folder (stack, commands, style line, token-economy line, commit-lock recipe) and point every executor at it.
4. **Plan check, one round**: when `gsd-plan-checker` reports issues, let the planner revise once, then continue with `--skip-verify`. Do not loop three times.
5. **Build**: executors run under `/gsd:execute-phase` with the config's cap of 3. Model per task: executors and reviewers on the mid model, mechanical fixes on the small model, planning on the frontier model. Each executor runs only the tests for what it touched; full build and tests once per wave end. After each phase, if the build is red, one `ecc-build-error-resolver` pass; red twice means stop and ask.
6. If GSD stops with "needs review", read the gap list; fix what is mechanical, record the rest as owner decisions, continue.

## Step 3: review, security, legal

Run after the last GSD phase, in sequence, each as one agent with the repo path and the relevant checklist:
1. `ecc-code-reviewer` on the full diff since the first commit; apply fixes that are clear, list the rest.
2. The `security-hardening` skill, plus `abuse-prevention` if there are endpoints or URL fetching, plus `gha-security-review` if a workflows folder exists. For a full audit (the owner asked for one, or the product handles accounts, payments or user data) run the `security-audit` skill in full audit mode instead of the short pass, and record its report location. Then `gitleaks git .` and `gitleaks dir .` (if gitleaks is missing, record "secret scan not run").
3. The `legal-compliance` skill: licences and notices in every distributable, claims audit of every README and page, "free, as-is" wording, consent before any tracking, accessibility basics. Then, before any public release, use the matching parts of the `legal-suite` skill (OSS licence review, name clearance, marketing-claims review, launch review; PIA if personal data). Items that do not apply get "not applicable because ...".
Record each finding as fixed, accepted-by-default (say why), or owner decision.

## Step 4: face and words

1. Logo: an original SVG logo file in the `assets` folder, in this product's own style (`ui-style-picker`); no other brands' marks, no stock art.
2. Intro image: an intro HTML page in `assets`, rendered to a PNG beside it at a known size (use a headless browser if one is installed; otherwise leave the HTML and record "intro image not rendered").
3. README: what it is in one line, quickstart, what it does, requirements, licence, "free, as-is" line, credits for every third-party piece. No absolute claims, no numbers without a method.
4. Product page draft: an index page in a `site` folder (or the project's own page route) built with `product-site-design`; the product is the hero, real material only. Draft, not deployed.

## Step 5: ship gate (always the last output)

Write SHIP-GATE from the ship-gate template in this skill's `references` folder and print it. It has exactly four parts:
1. **Verified**: each check that ran, with the command and its result (build, tests, scans, reviews).
2. **Unverified**: what did not run or cannot be checked by this flow (real-user behaviour, production headers, trademark clearance, legal sufficiency, licence of anything not in a package manifest, anything needing an account or a key).
3. **Owner decisions**: name, pricing/none, public or private, what to cut, every accepted-by-default item worth a second look.
4. **Next taps** (the owner runs these, not the flow): create the repo / set visibility, push, publish, deploy, announce.

Then stop. Do not run anything in part 4. If the owner says "ship it", the `studio-playbook` release rules still apply, one tap per public action.

## Examples

```text
/vision a CLI that turns meeting notes into a tidy changelog
  Step 0.5: "Path: GSD (ground-up) because it is a new project with several files."
  ... steps 1-4 ...
  Step 5: SHIP-GATE printed, flow stops. The owner decides on repo visibility, push, publish.

/vision status      -> prints the recorded step, recent commits and what is next; changes nothing
```

## Limitations

- Static checklists and scans give a floor, not a guarantee; the gate lists what was not checked.
- It depends on GSD for ground-up work, and GSD's setup prompts may need the owner once.
- A scripted name search is not a trademark clearance.

## Troubleshooting

- Problem: preflight stops because the remote repository is public. Fix: run the flow against a private or local repository, or ask the owner to change visibility first.
- Problem: GSD is missing. Fix: run the pinned install command printed in step 0, then re-run `/vision resume`.
- Problem: a usage limit stopped the run. Fix: `/vision resume` after the reset; it reads the recorded state and does not repeat finished steps.
- Problem: the build is red after a phase. Fix: one `ecc-build-error-resolver` pass; if it is red again, stop and ask the owner.

## What this flow cannot do

It cannot judge taste, clear a name, confirm a policy fits the law, test with real users, or see production. Scanners and checklists are a floor. Say this in the gate every time.
