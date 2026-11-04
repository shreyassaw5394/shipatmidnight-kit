---
name: abuse-prevention
description: Use when protecting your own APIs, AI features, sign-up flows or URL-fetching code from abuse — "anti-hack", "rate limiting", "prevent abuse", "bots", "someone could run up our bill", "denial of wallet", "SSRF", "spam", "free tier abuse", or when adding any endpoint that costs money (LLM, search, image generation, email) or fetches a user-supplied URL. Pair with security-hardening.
---

# Abuse prevention pass

Goal: nobody can run up the bill, knock the service over, use it to attack other systems, or use it to spam people. Based on OWASP API Top 10 (2023) API4/API6/API7 and OWASP LLM10 (unbounded consumption). Keep commit and PR text generic; explain to the owner in chat.

## 1. Find what costs money or touches the outside

List every route and mark: calls a paid API (LLM, search, embeddings, image gen), sends email/SMS, fetches a user-supplied URL, accepts uploads, creates accounts or keys, writes public content. Those are the ones that need limits.

## 2. Rate limits — layered

- **Per-IP safety net** on every route (e.g. 300/min), health checks excluded, `429` with `Retry-After`.
- **Per-account burst limit** for signed-in/keyed users on expensive routes (e.g. 60/min).
- **Anonymous/demo**: per-IP hard cap (e.g. 5/hour) *in addition to* any per-visitor fingerprint, plus a global hourly circuit breaker on shared paid keys.
- **Key the bucket on something the attacker can't rotate**: verified user id, or the client IP the platform reports (Fly: `Fly-Client-IP`; Vercel/Fastify with `trustProxy`). Never on a raw `Authorization` header, user agent, or any client-supplied value before it's verified.
- **Shared store** (Redis/Upstash) when there can be more than one instance; in-memory maps reset on every serverless cold start and protect nothing. Single-machine servers may stay in-memory.
- Fail open if the limiter's store is down (don't take the API down with it).
- Reference: `reference/rateLimit.ts` — a framework-neutral fixed-window limiter (`checkLimit`, `rateLimitHeaders`, `LIMITS`) with a pluggable counter store (in-memory for one machine, Redis/Upstash `INCR`+`EXPIRE` for many). Tests: `reference/rateLimit.test.ts`.

## 3. Cost caps (denial of wallet)

Request counts aren't enough: cap per-account daily usage of paid features, cap input size (query length, document size, messages per turn), cap fan-out (pages fetched, retries, agent steps), and make expensive modes count more. Fresh accounts are the usual bypass: limit key creation (e.g. 5/hour, 10 active) and require something per account (own provider key, verified email, OAuth).

## 4. Outbound fetches of user-supplied URLs (SSRF)

Use `reference/safeFetch.ts` (needs `undici`). It:
- allows only http/https on standard ports, no credentials in URLs, refuses `localhost`, `*.local`, `*.internal`, numeric/octal/hex IP spellings;
- checks the **resolved** address at connect time with a pinned DNS lookup (private, loopback, link-local/metadata `169.254.0.0/16`, CGNAT, multicast, IPv6 ULA/link-local/mapped all refused) — so a hostname pointing at `127.0.0.1` fails;
- follows redirects manually and validates every hop before requesting it;
- caps body size and time; throws `BlockedUrlError` (status 400, never retried).
Route every untrusted fetch through it (page readers, link checkers, "import from URL", enterprise/custom endpoints with `httpsOnly`). Tests: `reference/safeFetch.test.ts`; live check with a public redirector that sends you to `http://localtest.me/` (resolves to loopback) — it must be refused at the hop.

## 5. Spam and abuse of side effects

- Anything that sends email on a user's behalf (shares, invites, access requests): per-sender hourly limit on the POST only (don't throttle the GET that lists collaborators).
- Uploads: size limit, type sniffing from bytes (not the declared MIME), per-account rate.
- Feedback/votes/learning signals: per-IP limits and check the target exists, so ranking or calibration can't be poisoned cheaply.
- Public pages created by users: rate-limit creation and keep a report path.

## 6. AI-specific abuse (OWASP LLM Top 10, 2025)

- **Output caps, not just input caps:** `max_tokens` on every LLM call, per-call timeout, cap on concurrent streams per account/IP, and abort upstream when the client disconnects.
- **No secrets or internal logic in system prompts.** Assume they leak (LLM07). Authorization never depends on the prompt.
- **Indirect prompt injection** via fetched pages: content is data, delimited and labelled; the model has no tools that act on the user's behalf in the same turn as reading untrusted content (excessive agency, LLM06).
- **LLM output is untrusted downstream** (LLM05): never into SQL, shell, HTML or redirects without the same validation as user input.
- **Feedback/calibration poisoning:** signals that train or calibrate scores (feedback, votes, training logs) are rate-limited per account and IP, deduplicated, and outlier-checked before they move the model (LLM04).
_Source: Semgrep `llm-security` (ideas only; restrictive licence), OWASP Top 10 for LLM Applications 2025._

## 7. Account-flow abuse

- Sign-in, magic-link, password-reset and data-export endpoints: per-IP *and* per-target-email limits; identical responses whether or not the account exists (no enumeration).
- MCP endpoints: limit `tools/list` too, and cost-weight tool calls (deep/thorough modes count more), returning 429 before the tool runs.
- If a CAPTCHA/bot check is ever added (e.g. Turnstile), it's a third-party request. Load it only on the form that needs it, and list it in the Privacy Policy.
_Sources: github/awesome-copilot `gdpr-compliant` + `mcp-implementation-security-review` (MIT)._

## 8. Verify

Exercise the real app: N+1 requests hit 429 at exactly the limit; rotating user agents or fake auth headers doesn't reset the bucket; a metadata URL returns 400; normal pages and normal users still work. Deploy, then repeat the key checks against production. Report each limit with its number so the owner can tune them.
