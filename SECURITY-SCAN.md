# Security scan summary

Every skill and agent in this kit was scanned before publishing with `tools/skill-audit/audit.sh`:
NVIDIA SkillSpector v2.13.3 and NVIDIA SkillEvaluator v0.7.1 Tier 1, static mode, no LLM. Every high or critical finding was then read by hand. Full reports are not kept in the repo.

Scan date: 2026-11-04. `skills/security-audit` and `skills/legal-suite` were bundled and scanned for v0.2.1 (same day; `audit.sh` on the root and on each legal part). Full re-run of both scanners over every skill and agent on 2026-11-04 (launch review, `audit.sh skills/* agents/*.md`): verdicts, risk scores and quality grades matched the table below, with no new high or critical findings. Earlier note: (`skills/token-economy` and `skills/vision` added and scanned the same day; `token-economy` rescanned after its §0 addition).

| Item | SkillSpector | SkillEvaluator | High/critical findings, read by hand |
|---|---|---|---|
| `skills/studio-playbook` | SAFE, risk 0 | quality 79 C, high 1 | Metadata only ("author not specified"). |
| `skills/product-site-design` | SAFE, risk 0 | quality 82 B, high 1 | Metadata only. |
| `skills/ui-style-picker` | SAFE, risk 3 | quality 88 B, high 1 | Metadata only. |
| `skills/game-feel` | SAFE, risk 3 | quality 86 B, high 1 | Metadata only. |
| `skills/apple-motion` | CAUTION, risk 0 | quality 86 B, high 1 | Metadata only. |
| `skills/security-hardening` | CAUTION, risk 24 (1 high) | quality 83 B, high 2 | The phrase "personal access token" in advice to *use a scoped token*. Text only; no code acts on credentials. |
| `skills/legal-compliance` | CAUTION, risk 49 (1 high) | quality 82 B, high 2 | "analysis-evasion" = the static parser hit its size limit on `scripts/third-party-licenses.mjs`. Read by hand: it reads local source maps and `package.json` files and writes one text file; no network, no exec. |
| `skills/abuse-prevention` | DO_NOT_INSTALL, risk 91 (4 high) | quality 83 B, high 5 | All hits are the SSRF blocklist and its tests (`169.254.169.254`, `metadata.google.internal`, `file:///etc/passwd` as URLs that must be *refused*). This is defensive code; tests pass. |
| `skills/gha-security-review` (third party) | DO_NOT_INSTALL, risk 100 (31 high) | quality 88 B, high 32 | Attack examples in the reference docs (`curl … \| bash`, credential paths on runners, pwn-request payloads) that the skill teaches you to find. Markdown only; no scripts. Kept. |
| `skills/security-audit` (third party, Cloudflare, MIT) | DO_NOT_INSTALL, risk 100 (8 high, partial) | quality 84 B, high 9 | Read by hand: "memory poisoning" is the audit checklist item about who may write agent memory (AI-AND-LLM.md); "privilege escalation" hits are `credentials.json`/`keychain` in lists of things to look for, and `/etc/passwd` as path-traversal test fixtures in the `*.test.cjs` files; two "analysis-evasion" hits are the static parser's size limit on the two `validate-*.cjs` scripts. Read both scripts: they use only `fs`, `path` and `util`, no network and no process execution. Evaluator highs are metadata ("author not specified"). Files are byte-identical to upstream c1c8a8c. Kept. |
| `skills/legal-suite` (third party, Anthropic claude-for-legal, Apache-2.0; router + 11 parts) | CAUTION, risk 44 (1 high); parts SAFE/CAUTION, risk 6-27 | quality 83 B (parts 84-90 B), high 2 (parts 2-3 each) | Read by hand: the one SkillSpector high is "anti-refusal" on the sentence "Don't decline based on US §101 alone if you have EP/JP/CN filing plans" in `ip-legal-invention-intake` (patent-eligibility advice, not a safety override). Evaluator highs are metadata only ("author not specified"; directory name differs from frontmatter name because parts are filed as `<area>-<name>`). Markdown only; no scripts. Parts byte-identical to upstream 4a6c651. Kept. |
| `skills/token-economy` | CAUTION, risk 28 (2 high) | quality 88 B, high 3 (unchanged after §0) | Two "chaining abuse" hits on `; rm -f "$idx"` in the commit-lock recipe: it deletes the recipe's own `mktemp` index file and lock directory only. Third is metadata ("author not specified"). Text only; no scripts. |
| `skills/vision` | DO_NOT_INSTALL, risk 68 (3 high) | quality 81 B, high 4 | Read by hand: (1) "memory poisoning" on the plain-text phrase "if a new name is introduced" in SKILL.md; (2)(3) "chaining abuse" on `; rm -f "$idx"` in `references/conventions-template.md`, the same commit-lock recipe as `token-economy` (deletes its own `mktemp` index only). Fourth evaluator high is metadata ("author not specified"). A fifth, angle brackets in `argument-hint`, was fixed before this scan. Markdown and one JSON config; no scripts. The skill's own rules forbid push, publish and deploy. |
| `agents/ecc-*` (10 agents) | SAFE or CAUTION, risk 9–21, no high | quality 87–90 B, high 1–2 each | Metadata only ("author not specified"; two files lack a top-level heading). |

Dropped after scanning: Sentry `skill-scanner` (SkillSpector DO_NOT_INSTALL, 1 critical + 62 high). The findings were its own detection patterns and attack documentation, not behaviour, but the skill duplicates `audit.sh`, so it was left out rather than shipped with a critical finding.

Other checks before publishing:

- `gitleaks dir .` and `gitleaks git .` (full history): no leaks found (re-run 2026-11-04 after adding `skills/vision`).
- Manual grep for absolute home paths, email addresses, key prefixes and private product names in skills, agents and tools: none (only the scanner's own detection regexes and IP-family code identifiers).
- `claude plugin validate . --strict`: passed (re-run 2026-11-04 with Claude Code 2.1.310). `/vision status` and `/shipatmidnight-kit:vision status` both resolve when loaded with `--plugin-dir` in an empty folder and make no changes.

Scanners give a signal, not a guarantee. Scan again after any update, and read what you install.
