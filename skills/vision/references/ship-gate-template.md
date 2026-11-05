# Ship gate: <product>  (<date>)

Path taken: <GSD | direct> because <one line>.
This gate was produced by a workflow, not a release authority. Nothing below has been published, deployed or pushed to a public remote.

## 1. Verified (command → result)
- build: `<cmd>` → <pass/fail>
- tests: `<cmd>` → <N passed, M failed; pre-existing failures listed separately>
- code review (ecc-code-reviewer): <N findings fixed, M listed below>
- security pass (security-hardening / abuse-prevention / gha-security-review; security-audit when a full audit ran): <what ran, what was fixed>
- secret scan: `gitleaks git .` / `gitleaks dir .` → <result, or "not run: gitleaks missing">
- legal pass (legal-compliance + legal-suite parts used): <licences in distributables, claims audit, as-is wording, consent, accessibility basics>
- name check (scripted search, <date>): <npm / PyPI / GitHub / web results>

## 2. Unverified (this flow cannot check these)
- Real users: nobody outside this session has used it.
- Production: no live headers, no deployed URL, no real-traffic behaviour.
- Trademark: the name search is not a clearance opinion.
- Legal sufficiency: the legal pass is a checklist, not advice; a lawyer review is still the answer for money or user data.
- Taste: the owner's eye has not seen the logo, intro image or product page.
- <anything else that needed an account, a key or a tool that was missing>

## 3. Owner decisions
- Name: <keep / alternatives>
- Public or private: <default private>
- Pricing: <none by default>
- Cut list: <features or sections the flow suggests dropping>
- Accepted by default, worth a look: <each item with the default picked and why>

## 4. Next taps (owner runs these; the flow does not)
- create or set repo visibility · push · publish · deploy · announce
