# Playbook

The operating rules behind this kit, in plain words. They are written for a small studio (one owner, often one person) that ships several products with an AI coding agent doing much of the work. "The owner" is whoever decides what ships.

## 1. Design first

- **The product is the hero.** Every page, screen and README leads with the product doing its job, not with decoration. Hold the work to a Steve Jobs bar: is this the simplest thing that is still delightful?
- **Say no to a thousand things.** Focus is choosing what not to build. Cut features, sections, settings and words that don't earn their place. One clear idea beats five good ones.
- **Never vibe-coded.** A page that looks like the average of every AI-generated page is a failure even if it works. Name the style (`ui-style-picker`), find the idea only this product has (`product-site-design`), and use real material, never fake proof.
- **The owner's eye is the final gate.** Automated checks are the floor. If the owner liked something, keep it.

## 2. Plan, then build

- For anything bigger than a small fix: plan first (`ecc-planner`, `ecc-architect`, or a phase-based workflow such as GSD, linked in the README), then build in small, verifiable steps.
- Each step has a success check you can run. Define it before writing the code.
- Make surgical changes. Don't refactor what you weren't asked to touch.
- Build straight through the plan; collect what needs the owner's eyes into one verification list at the end instead of stopping at every step.

## 3. Test before commit

- Run the project's own checks (typecheck, lint, tests, build) before every commit. Compare failures with the main branch and report pre-existing ones separately.
- Exercise the real thing: start the app, call the endpoint, click the button. A green unit test is not proof a feature works.
- After a deploy, check production too (`curl -sI` for headers, a headless browser for pages).
- Review your own diff with a reviewer agent (`ecc-code-reviewer`, plus `ecc-typescript-reviewer` / `ecc-react-reviewer` / `ecc-database-reviewer` / `ecc-security-reviewer` where they apply) before opening a PR.

## 4. Debug by observing

- Observe the running system before theorising: stacks, profiles, sockets, file descriptors, logs. A runtime-observation tool for agents (one is linked in the README) makes this routine.
- Never state a root cause without evidence you can point to. Unproven ideas are hypotheses, with the test that would confirm them.
- After a fix, measure again with the same tool and show before and after.

## 5. Neutral wording for security and legal fixes

- Commit messages, PR titles and PR bodies for security or legal fixes stay short and neutral ("Request handling updates", "Privacy page and consent"). Public details of a weakness are an attack guide.
- Explain the actual reasoning to the owner in chat or in a private note, never in public text.

## 6. Nothing public without the owner

- No public repo, package publish, deploy to a public URL, marketplace listing, post or announcement until the owner says yes, explicitly, for that thing.
- Default new repos to private. Previews before production for anything live.
- Never bypass branch protection unless the owner says to.

## 7. Release gates (before any publish)

Nothing ships publicly until both passes are complete and their findings are fixed or consciously accepted by the owner:

1. **Security pass**: `security-hardening` (repo, supply chain, headers, auth, leakage, local servers, MCP, CI), `abuse-prevention` where there are endpoints, `gha-security-review` for workflows, and a full-history secret scan (`gitleaks git .`).
2. **Legal pass**: `legal-compliance` (consent, policies, age gate, licences and notices in every distributable, claims audit, name check, accessibility, AI disclosure, "as is" posture).

Publish with short-lived credentials only (trusted publishing / OIDC), with provenance, from CI.

## 8. Skill and plugin intake

- Scan every skill, agent and plugin with **both** scanners before installing it: `tools/skill-audit/audit.sh <path>` (see `tools/skill-audit/POLICY.md`). Read every high or critical finding yourself.
- Install from quarantine, from the official source, at a pinned commit. Cherry-pick; keep a cap; replace instead of stacking.
- Re-audit monthly and after every update.

## 9. Pick the model per task

Agents in this kit carry a `model:` pin so each job runs on the right model without anyone choosing by hand:

| Job | Model | Agents |
|---|---|---|
| Architecture, planning: decisions that are expensive to get wrong | `opus` | `ecc-architect`, `ecc-planner` |
| Review, security, database, tests: careful reading and reasoning | `sonnet` | `ecc-code-reviewer`, `ecc-typescript-reviewer`, `ecc-react-reviewer`, `ecc-security-reviewer`, `ecc-database-reviewer`, `ecc-tdd-guide` |
| Narrow, mechanical work: fix the build, find swallowed errors | `haiku` | `ecc-build-error-resolver`, `ecc-silent-failure-hunter` |

If you use GSD, its "balanced" profile follows the same idea: the strongest model only for planning, the middle model for execution, research and verification, the fastest for codebase mapping. Override per agent when a task needs more.

## 10. Every repo gets a face

Every repo and README gets an original logo and at least one intro image, generated for that project in its own style (an SVG mark, and an image rendered from HTML at a known size). No stock art, no other brands' marks, no AI-made images that imitate a real company's look.
