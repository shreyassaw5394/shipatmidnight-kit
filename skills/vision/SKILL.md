---
name: vision
description: Use when the user types /vision followed by a product idea, "/vision status" or "/vision resume". Runs the studio flow end to end with defaults and no questions unless something blocks - name check, GSD project in auto mode, one plan-check round, lean executors, security and legal passes, logo, README, product page draft - and stops at a ship gate for the owner's tap. Never publishes, deploys or pushes to a public remote.
argument-hint: "[one paragraph about the product] | status | resume"
---

# /vision

Input: `$ARGUMENTS`. One paragraph in, a release candidate out, stopped at a gate. This is a workflow, not magic: every step is a checklist a model runs, and the gate says what was and was not checked.

**Hard rules for the whole run**
- Never `git push` to any public remote, never publish a package, never deploy, never create a public repo or listing. The gate asks; the owner taps.
- Ask the owner only when blocked (name conflict, missing tool, failing build after two fixes, a decision with money or user data in it). Everything else: pick the default below, write it down in `.planning/VISION-DECISIONS.md`, move on.
- Follow `${CLAUDE_PLUGIN_ROOT}/skills/token-economy/SKILL.md`: 2-3 parallel agents, model per task, commit lock for parallel commits, short reports.
- Commit messages stay neutral (no security or legal detail in public text).

## Subcommands

- `status`: read `.planning/VISION-STATE.md` (and `.planning/STATE.md` if present), print the current step, what landed (`git log --oneline -15`), what is next. No changes.
- `resume`: after a usage limit or a closed session. Read `VISION-STATE.md`, `git status`, `git log`. Continue from the recorded step; never restart a finished step; resume stopped GSD agents by message where possible (token-economy §7). Drop to 1-2 agents for the rest of the window.
- Anything else is the vision paragraph. Start at step 0.

## Step 0: preflight (stop here if anything is missing)

1. Must be inside a git repo (`git rev-parse --git-dir`). If not: `git init` and continue. Check `git remote -v`: if a remote exists and `gh repo view --json visibility` says PUBLIC, **tell the owner and stop**; this flow only runs against private or local repos.
2. GSD must be installed: `test -f ~/.claude/commands/gsd/new-project.md && test -f ~/.claude/get-shit-done/VERSION`. If missing, print exactly this and stop:
   `npx get-shit-done-cc@1.20.4 --claude --global` (upstream is archived; pinned version; do not enable its update-check hook)
3. Write `.planning/VISION.md` with the paragraph and today's date. Write `.planning/VISION-STATE.md` from `${CLAUDE_PLUGIN_ROOT}/skills/vision/references/state-template.md`. Update it at the end of every step; it is the resume point.

## Step 0.5: pick the path, say which and why

GSD is for ground-up work only: a new project, or a big new phase of an existing one (several files, more than one session, needs a plan). A small local task (a fix, a doc edit, a config change, a single-file feature) gets **no planner, plan-check or executor ceremony**: do it directly, or with one small agent on the mid model, run the project's own checks, commit, and go straight to step 5 with a short gate. Decide from the paragraph and the repo (`git log --oneline -5`, file count, whether `.planning/` already exists). Print one line before doing anything: `Path: GSD (ground-up) because ...` or `Path: direct because ...`, and record it in `VISION-DECISIONS.md`. Steps 1-4 below are the GSD path; the direct path runs step 1 only if a new name is introduced, and step 3 only for the files it touched.

## Step 1: name knockout check

Take the product name from the paragraph (or propose one short, plain name and record it). Search what you can reach: npm (`npm view <name> name` exits 0 if taken), PyPI (`https://pypi.org/pypi/<name>/json`), GitHub (`gh search repos <name> --limit 5`), and a web search for the name plus "software" / "app" if a search tool is available. Names built on others' marks ("...GPT", "Claude...", "...Copilot") are rejected. Record the search date and results in `.planning/VISION-DECISIONS.md`. A same-name hit in the same category is **blocking**: propose two alternatives and ask. State plainly in the gate: this is a scripted search, not a trademark clearance opinion.

## Step 2: GSD project in auto mode

1. Write `.planning/config.json` from `${CLAUDE_PLUGIN_ROOT}/skills/vision/references/gsd-config.json` (yolo, quick depth, balanced profile, research on, one plan-check pass, verifier on, auto-advance on, 3 concurrent agents, commit docs).
2. Run `/gsd:new-project --auto @.planning/VISION.md`. GSD 1.20.4 still asks three setup questions in auto mode (depth, git, models); answer with the config already written (Quick, commit docs, Balanced) if the harness lets you, otherwise this is the one place the owner has to press enter three times. Say so once.
3. GSD then chains discuss → plan → execute for each phase on its own (`auto_advance`). Before the first execute wave, write `.planning/CONVENTIONS.md` from `${CLAUDE_PLUGIN_ROOT}/skills/vision/references/conventions-template.md` (stack, commands, style line, token-economy line, commit-lock recipe) and point every executor at it.
4. **Plan check, one round**: when `gsd-plan-checker` reports issues, let the planner revise once, then continue with `--skip-verify`. Do not loop three times.
5. **Build**: executors run under `/gsd:execute-phase` with the config's cap of 3. Model per task: executors and reviewers on the mid model, mechanical fixes on the small model, planning on the frontier model. Each executor runs only the tests for what it touched; full build and tests once per wave end. After each phase, if the build is red, one `ecc-build-error-resolver` pass; red twice means stop and ask.
6. If GSD stops with "needs review", read the gap list; fix what is mechanical, record the rest as owner decisions, continue.

## Step 3: review, security, legal

Run after the last GSD phase, in sequence, each as one agent with the repo path and the relevant checklist:
1. `ecc-code-reviewer` on the full diff since the first commit; apply fixes that are clear, list the rest.
2. `${CLAUDE_PLUGIN_ROOT}/skills/security-hardening/SKILL.md`, plus `abuse-prevention` if there are endpoints or URL fetching, plus `gha-security-review` if `.github/workflows` exists. For a full audit (the owner asked for one, or the product handles accounts, payments or user data) run `${CLAUDE_PLUGIN_ROOT}/skills/security-audit/SKILL.md` in full audit mode instead of the short pass, and record its report location. Then `gitleaks git .` and `gitleaks dir .` (if gitleaks is missing, record "secret scan not run").
3. `${CLAUDE_PLUGIN_ROOT}/skills/legal-compliance/SKILL.md`: licences and notices in every distributable, claims audit of every README and page, "free, as-is" wording, consent before any tracking, accessibility basics. Then, before any public release, use the matching parts of `${CLAUDE_PLUGIN_ROOT}/skills/legal-suite/SKILL.md` (OSS licence review, name clearance, marketing-claims review, launch review; PIA if personal data). Items that do not apply get "not applicable because ...".
Record each finding as fixed, accepted-by-default (say why), or owner decision.

## Step 4: face and words

1. Logo: an original SVG mark at `assets/logo.svg`, in this product's own style (`ui-style-picker`); no other brands' marks, no stock art.
2. Intro image: `assets/intro.html` rendered to `assets/intro.png` at a known size (use a headless browser if one is installed; otherwise leave the HTML and record "intro image not rendered").
3. README: what it is in one line, quickstart, what it does, requirements, licence, "free, as-is" line, credits for every third-party piece. No absolute claims, no numbers without a method.
4. Product page draft: `site/index.html` (or the project's own page route) built with `product-site-design`; the product is the hero, real material only. Draft, not deployed.

## Step 5: ship gate (always the last output)

Write `.planning/SHIP-GATE.md` from `${CLAUDE_PLUGIN_ROOT}/skills/vision/references/ship-gate-template.md` and print it. It has exactly four parts:
1. **Verified**: each check that ran, with the command and its result (build, tests, scans, reviews).
2. **Unverified**: what did not run or cannot be checked by this flow (real-user behaviour, production headers, trademark clearance, legal sufficiency, licence of anything not in a package manifest, anything needing an account or a key).
3. **Owner decisions**: name, pricing/none, public or private, what to cut, every accepted-by-default item worth a second look.
4. **Next taps** (the owner runs these, not the flow): create the repo / set visibility, push, publish, deploy, announce.

Then stop. Do not run anything in part 4. If the owner says "ship it", the `studio-playbook` release rules still apply, one tap per public action.

## What this flow cannot do

It cannot judge taste, clear a name, confirm a policy fits the law, test with real users, or see production. Scanners and checklists are a floor. Say this in the gate every time.
