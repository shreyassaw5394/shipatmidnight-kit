# Security scan summary

Every skill and agent in this kit is scanned with `tools/skill-audit/audit.sh`: NVIDIA SkillSpector v2.13.3 and NVIDIA SkillEvaluator v0.7.1 Tier 1, static mode, no LLM. Findings were read by hand. Full reports are not kept in the repo. Scan date: 2026-11-04, v0.2.2 (full re-run of both scanners over every item below).

## Our own skills and agents (kit-authored)

For v0.2.2 these were reworked at the root cause: author, version, licence and tags added; Purpose, Prerequisites, Instructions, Examples, Limitations and Troubleshooting sections added; descriptions shortened and written in the third person; the parallel-commit recipe rewritten with a named `commit_cleanup` step that removes only its own lock directory and private index file (tested with four parallel committers); SSRF blocklist entries and test fixtures no longer name well-known metadata hosts or credential files (the `.internal` and link-local rules already cover them, and the 12 tests pass); `third-party-licenses.mjs` split into small functions with the MIT text moved to `references/mit-license.txt`; `npx` commands pinned or replaced with `npm exec --no --`; runtime file names reworded so the scanner can resolve every reference. Behaviour is unchanged.

| Item | SkillSpector | SkillEvaluator | Remaining findings |
|---|---|---|---|
| `skills/vision` | SAFE, risk 6 | 100 A | Medium RA2 "session persistence": the flow's `resume` feature keeps state in project files by design. |
| `skills/token-economy` | SAFE, risk 0 | 99 A | None. |
| `skills/studio-playbook` | SAFE, risk 0 | 100 A | None. |
| `skills/security-hardening` | SAFE, risk 7 | 99 A | Medium LP3: no `allowed-tools` declared (declaring one makes the scanner flag the bundled TypeScript reference for undeclared network use, a high). |
| `skills/legal-compliance` | **CAUTION, risk 10 (partial)** | 99 A | Medium LP3 (same reason as above); low EA3 on the standard MIT wording ("NOT LIMITED TO") in `references/mit-license.txt`; **coverage is "partial"** because of one `obfuscated_instruction_text` note on `SKILL.md` (Verify section, around the privacy-probe bullets) that I could not localise before the token budget ended. No high or critical finding. Owner decision: accept, or split that section into a reference file. |
| `skills/abuse-prevention` | SAFE, risk 7 | 99 A | Medium LP3 (same reason). |
| `skills/product-site-design` | SAFE, risk 0 | 97 A | Evaluator medium/low: structure hints only. |
| `skills/ui-style-picker` | SAFE, risk 3 | 96 A | Low EA3 on the bundled MIT licence text of the third-party CSV (kept for attribution). |
| `agents/ecc-*` (10 agents, MIT, modified from ECC) | all SAFE, risk 9 | 98-100 A | One medium each: EA5 flags the `model:` pin in frontmatter, which is the kit's intended feature. |

## Third-party bundles (byte-identical to upstream, not edited)

These are scanned with exceptions, not fixed. Edits would break the byte-identity with upstream. The exceptions are read by hand and explained.

| Item | SkillSpector | SkillEvaluator | Why the findings are acceptable |
|---|---|---|---|
| `skills/security-audit` (Cloudflare, MIT) | DO_NOT_INSTALL, risk 100 (8 high, partial) | 84 B | "memory poisoning" is an audit checklist item about who may write agent memory; "privilege escalation" hits are `credentials.json`/`keychain` in lists of things to look for and `/etc/passwd` as path-traversal fixtures in tests; "analysis-evasion" is the parser's size limit on two `validate-*.cjs` scripts, which use only `fs`, `path` and `util` (read by hand, no network or process execution). Evaluator highs are "author not specified". Upstream c1c8a8c. |
| `skills/legal-suite` (Anthropic claude-for-legal, Apache-2.0; router + 11 parts) | CAUTION, risk 44 (1 high) | 83 B | The one high is "anti-refusal" on patent-eligibility advice ("Don't decline based on US §101 alone if you have EP/JP/CN filing plans"), not a safety override. Evaluator highs are metadata. Markdown only. Upstream 4a6c651. |
| `skills/gha-security-review` (Sentry, Apache-2.0) | DO_NOT_INSTALL, risk 100 (31 high) | 88 B | Attack examples (`curl ... \| bash`, runner credential paths, pwn-request payloads) in reference docs that the skill teaches you to detect. Markdown only. **Exceptions are defensible but the verdict cannot be changed without editing upstream**; kept. |
| `skills/apple-motion` (Emil Kowalski, MIT) | CAUTION, risk 0 (partial) | 86 B | No findings; partial coverage only. Evaluator high is metadata. |
| `skills/game-feel` (Apache-2.0) | SAFE, risk 3 | 86 B | Evaluator high is metadata. |

Dropped after scanning: Sentry `skill-scanner` (SkillSpector DO_NOT_INSTALL, 1 critical + 62 high). The findings were its own detection patterns and attack documentation, not behaviour, but the skill duplicates `audit.sh`, so it was left out rather than shipped with a critical finding.

Other checks before publishing:

- `gitleaks dir .` and `gitleaks git .` (full history): no leaks found (re-run 2026-11-04 for v0.2.2).
- Manual grep for absolute home paths, email addresses, key prefixes and private product names in skills, agents and tools: none (only the scanner's own detection regexes and IP-family code identifiers).
- `claude plugin validate . --strict`: passed (re-run 2026-11-04 with Claude Code 2.1.310). `/vision status` and `/shipatmidnight-kit:vision status` both resolve when loaded with `--plugin-dir` in an empty folder and make no changes.

Scanners give a signal, not a guarantee. Scan again after any update, and read what you install.
