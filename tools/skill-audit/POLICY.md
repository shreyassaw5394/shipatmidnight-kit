# Skills, agents and plugins: intake and anti-bloat policy

## Before anything is installed

1. Fetch it into a quarantine folder (a scratch directory), never straight into `~/.claude` or a project's `.claude/`.
2. Use the official source only. Check the owner, the licence, the stars and the history. Beware re-uploads and "installer" look-alike repos: they are a common malware lure.
3. Run both scanners: `tools/skill-audit/audit.sh <folder or agent.md>`
   (NVIDIA SkillSpector v2.13.3 + SkillEvaluator v0.7.1 Tier 1, static, no LLM key).
4. Read every CRITICAL and HIGH finding yourself. Security skills that *document* attacks trip the scanners on purpose; that is not the same as performing them. Anything that executes code, fetches from the network or touches credentials gets read line by line.
5. Pin the commit. Note the source, date and scores where you install it (a comment at the bottom of the file, or a `SOURCE` file beside it).

## Anti-bloat rules

- Cherry-pick, never "install everything". No full plugin profiles, no hook bundles.
- No new hooks unless there is one specific job for them: a hook runs on every matching event.
- Keep it small: roughly 25 skills and 25 agents at most. Before adding one, check for overlap; replace, don't stack. Adjust the cap to your machine and habits, but keep a cap.
- Agents carry a source prefix (`ecc-`, `gsd-`, …) and their descriptions don't say "PROACTIVELY" or "MUST BE USED", so they don't spawn themselves on every change.
- Descriptions stay one or two lines; long material goes in `references/` and loads on demand.
- Re-audit everything monthly and after any update; remove what wasn't used.

## Audit log

Keep your own dated log here (what was scanned, scores, what you read by hand, the decision). Keep scanner reports out of version control.
