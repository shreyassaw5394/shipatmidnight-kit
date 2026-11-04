---
name: security-hardening
description: Use when securing or reviewing your own repos, sites, APIs, local servers, CLIs or extensions — "make it secure", "harden", "security review", "protect main", "secret scanning", "dependency vulnerabilities", "Dependabot", "headers", "CORS", "DNS rebinding", "localhost server", or before a public launch. Covers repo hygiene, dependencies, HTTP headers, CORS/CSRF, authorization, error leakage, debug endpoints and local-only servers. Pair with abuse-prevention for rate limits and SSRF.
---

# Security hardening pass

For the products your studio ships. Fix what you find, test it, and keep commit messages and PR text generic ("Server request handling updates") — public repos make details an attack guide. Explain specifics to the owner in chat only.

## Repo and supply chain

- Main protected: PR required, CI required, no force-push, linear history (approvals 0 is fine for a solo maintainer). Never bypass protection with `--admin` unless the owner says to merge.
- Secret scanning + push protection on; Dependabot alerts and grouped updates on. Scan history for tokens before making a repo public.
- Tokens only in CI secrets. Never echo them; never pass them on a command line.
- `SECURITY.md` with a private contact; `CODEOWNERS`.
- Dependencies: fix highs/criticals in **production** code. Prefer updates within the existing range (`pnpm update -r <pkgs>`), then scoped same-major overrides (`"pkg@^2": "^2.0.8"`) — never force a new major. Distinguish the monorepo lockfile (what *you* deploy) from what users get from a fresh `npm install` of the published package; audit both.

## HTTP surface

- Headers on every response: HSTS (`max-age=63072000; includeSubDomains`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (SAMEORIGIN if the site frames itself), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/mic/geolocation/payment/usb/interest-cohort, a CSP where the app allows it (`default-src 'self'` for static sites, `default-src 'none'` for JSON APIs).
- **Verify headers on the live URL with `curl -sI`.** Vercel's Build Output API ignores a `headers` block in `config.json`; headers must be a route with `"continue": true`. A `vercel.json` headers block only applies when Vercel builds the project itself.
- CORS: explicit allowlist, never reflect arbitrary origins with credentials. CSRF: reject state-changing browser requests whose Origin isn't allowed.
- Body size limits on every server; timeouts on every outbound call.

## Authorization

- Every route that takes an ID checks the caller owns it (or the ID is an unguessable share token). Every admin route calls the admin guard first. Grep the route list and check each one; don't trust one example.
- Mass assignment: whitelist writable fields.
- Supabase: RLS enabled with policies on every table (check the live DB as an anonymous client with the public anon key: no rows with emails/IPs/tokens should come back), service-role key server-only, edge functions verify JWT unless they are OAuth callbacks, and never take `userId` from the request body.

## Leakage

- No stack traces or internal error text in production responses (`/health` included). Debug endpoints (`/debug`, test-only model endpoints, swagger) only when `NODE_ENV !== "production"`.
- No PII in browser console logs (strip `console.log` of emails/responses from auth flows).
- Analytics identify by account id only, never email/name.

## Local servers (CLIs, dev tools, extensions)

Bind `127.0.0.1` only, and still assume every website the user's browser visits can reach it:
- **Host check** on every request (only `127.0.0.1`, `localhost`, `::1`) — defeats DNS rebinding.
- **WebSocket upgrades** check Host and Origin (WebSockets skip CORS).
- **Write endpoints** fed by local processes reject any request carrying `Origin` or a non-`none` `Sec-Fetch-Site` (browsers always send these cross-site; Node's fetch never does).
- Reference implementation: `reference/localOnly.ts`. Test with a real hook/client plus forged requests (`curl -H 'Origin: https://evil.example'`, `-H 'Host: evil.example'`) and a WebSocket from a foreign origin.

## Publishing and CI (supply chain)

- **No long-lived publish tokens.** npm: trusted publishing (OIDC from GitHub Actions; provenance is automatic), then in npm package settings require 2FA and *disallow tokens*. Classic npm tokens were revoked Dec 2025; granular write tokens max 90 days. PyPI: Trusted Publisher + `pypa/gh-action-pypi-publish` (no `PYPI_TOKEN`/twine password). VS Code Marketplace: `vsce` PAT scoped to *Marketplace → Manage* only, short expiry, CI secret only. Delete the old secrets after switching.
- **Workflow hardening:** top-level `permissions: {}` (or `contents: read`) and grant per job; `actions/checkout` with `persist-credentials: false` unless a later step pushes; pin **third-party** actions (anything not `actions/*`/`github/*`) to a full commit SHA with a `# vX.Y` comment, at least in jobs that hold secrets, OIDC or publish rights; Dependabot `github-actions` ecosystem to keep pins fresh. Lint with `zizmor .github/workflows` and `actionlint`.
- **Never** combine `pull_request_target` (or `workflow_run`) with checking out the PR head. Never put `${{ github.event.* }}` text fields (titles, bodies, branch names, comment bodies) directly in `run:`. Pass them via `env:` and quote them.
- **AI agents in CI** (claude-code-action etc.): only on events from users with write access (don't set `allowed_non_write_users`), never on fork code with secrets. Remember that a PR can rewrite `CLAUDE.md`/`AGENTS.md`/Makefile, which the agent then trusts. Give the job minimal permissions and no publish secrets.
- **Dependency intake:** Dependabot/Renovate with a ~7-day cooldown (new versions age before adoption; most hijacked releases are caught within days). CI installs with the lockfile (`pnpm install --frozen-lockfile` / `npm ci`); allow install scripts only for an explicit list (`pnpm.onlyBuiltDependencies`, or `--ignore-scripts` where the build allows). New dependency in a PR = check its maintainer count, age, and install scripts.
- **Before a repo goes public:** scan full history with `gitleaks git .` or `trufflehog git file://.`. If a real secret was *ever* committed, rotate it **and** publish from a fresh repo (history rewrites don't reach forks, caches, Actions logs/artifacts). Check old Actions logs, releases, issues and wiki too.
_Sources: Trail of Bits `open-sourcing` + `supply-chain-risk-auditor` (CC-BY-SA-4.0, paraphrased); Sentry `gha-security-review` (Apache-2.0); Trail of Bits `agentic-actions-auditor`; GitHub npm changelog 2025-11-05 / 2025-12-09._

## Frontend (React/Vite/static)

- Anything starting `VITE_`/`NEXT_PUBLIC_` is public. Grep the built `dist/` for your providers' key prefixes (e.g. OpenAI-style `sk` keys, JWT-looking `eyJ` strings, `service_role`) before deploy.
- No `dangerouslySetInnerHTML`/`innerHTML`/`v-html` with anything from users, the web or an LLM. Markdown from model or web content renders with raw HTML **off** (`react-markdown` without `rehype-raw`, or sanitize with DOMPurify).
- **Every URL from data is validated before it becomes `href`/`src`/`window.open`/redirect:** allow `https:` (and `http:` if needed) only; reject `javascript:`, `data:`, `vbscript:`, `file:`. External links get `rel="noopener noreferrer"`. This matters most for citation/source links, which come from the open web.
- No open redirects (`?next=`/`returnTo` only to same-origin relative paths).
- `postMessage` listeners check `event.origin` against an allowlist and treat `event.data` as untrusted.
- Auth tokens: prefer the provider's httpOnly-cookie session. If a token must live in JS (Supabase default), the CSP is the real defence, so keep `script-src 'self'` strict with no third-party scripts.
- Public resource IDs (share links, sessions, evidence ids) are random (≥128-bit) and never sequential.
_Source: OpenAI `security-best-practices` React/frontend references (Apache-2.0); Sentry `security-review`._

## MCP servers

- **Transport:** local tools use stdio. A local HTTP transport needs a random per-launch token plus the local-only rules above. Node `listen(port)` with no host binds 0.0.0.0, so always pass `127.0.0.1`.
- **Remote (hosted) MCP:** authenticate every request (not only at session start); **never pass the client's token through** to downstream APIs (the server uses its own credentials); accept only tokens issued for this server. State/session handles are random, bound server-side to the verified user (`<userId>:<handle>`), and never count as auth.
- **Tool input:** every tool has a strict schema (types, enums, max lengths/array sizes, `additionalProperties: false`), validated server-side before any work. Invalid input fails closed.
- **Tool output is untrusted data for the model.** Web pages, files and logs returned to the agent are labelled as quoted data, truncated, and stripped of hidden text. Tool names/descriptions are static strings in our code, never built from fetched content (prevents tool poisoning). Return the minimum fields; no other users' data.
- **RCE vectors in tool handlers:** no `exec`/`shell: true` with tool args (use `execFile` + arg arrays + allowlist); no `eval`/`new Function`; paths are canonicalised and confined to an allowed root (`../`, symlinks, absolute paths rejected); no user input as a template; URL args go through `safeFetch`.
- **URLs the client opens** (OAuth, "open in browser"): `https:` only (http for loopback in dev), opened with a non-shell API.
- **Rate limits inside the server** (not just the gateway): per identity, tighter for costly tools, also on `tools/list`; 429 + `Retry-After` *before* executing.
- **Distribution:** README install snippets pin a version (`npx -y your-mcp-server@1.4.0`), and the package publishes with provenance (§Publishing).
- **Logging:** each tool call logs caller id, tool name, timestamp and outcome. Never the token or full arguments that may contain secrets.
_Sources: modelcontextprotocol.io Security Best Practices (spec); github/awesome-copilot `mcp-implementation-security-review` (MIT, OWASP MCP Top 10)._

## VS Code extensions

- Declare `capabilities.untrustedWorkspaces` (`false` or `"limited"` with the risky settings listed). Nothing reads workspace config, runs tasks or spawns processes until the workspace is trusted.
- Webviews: `enableScripts` only if needed; CSP `default-src 'none'; script-src 'nonce-…' ${webview.cspSource}; style-src ${webview.cspSource}`; `localResourceRoots` limited to the extension's `media/`; every `onDidReceiveMessage` validates the message type/shape (the webview is untrusted). Render user/agent text as text, never HTML.
- Never build shell commands from workspace strings, file names or settings. Use `execFile` with arg arrays.
- Publish from CI with a scoped, expiring Marketplace PAT. `vsce ls` before publishing to confirm no `.env`, maps or test fixtures ship.
_Sources: VS Code docs (Workspace Trust, Webview API); Trail of Bits blog "Escaping misconfigured VSCode extensions" (2023)._

## Supabase (additions)

- **Supabase traps** (check each when touching auth, RLS, views, functions, storage):
  - RLS on every table in exposed schemas; `TO authenticated` alone is *not* authorization. Pair it with `using ((select auth.uid()) = user_id)`.
  - UPDATE policies need both `USING` and `WITH CHECK` (otherwise users can reassign `user_id`); UPDATE also needs a SELECT policy.
  - Never authorize on `user_metadata` / `raw_user_meta_data` (user-editable). Use `app_metadata`.
  - Don't use `auth.role() = 'authenticated'`. It's deprecated, and anonymous sign-ins pass it. Use the `TO` clause.
  - Views bypass RLS: `create view … with (security_invoker = true)` or keep them out of exposed schemas.
  - `SECURITY DEFINER` functions bypass RLS, and in `public` anyone (anon included) can call them. Keep them in a private schema, check `auth.uid()` inside, `revoke execute … from public, anon`.
  - Deleting a user doesn't kill existing JWTs. Revoke sessions first; keep JWT expiry short.
  - Storage upsert needs INSERT + SELECT + UPDATE policies.
  - Run `supabase db advisors` (security + performance lints) after every migration; zero security warnings before merge.
  - Supabase MCP/CLI/CI use a **scoped** personal access token, never a full-account one.
  _Source: supabase/agent-skills `supabase` (MIT)._

## Verify and report

Run the project's full check (typecheck, lint, tests, build) and compare failures with `main` — report pre-existing failures as such. Exercise the real app (in-process `app.inject` or a local server) for each fix, deploy, and re-check production. Report per product: what was found, what changed, what's live, and anything only the owner can do.
- Keep a one-page `THREAT_MODEL.md` per product (in a private repo if the public one would help attackers): components, trust boundaries, assets (keys, user data, paid-API budget), entry points, the top 5 abuse paths and what stops each. Update it when a new entry point ships.
- Before a public launch, run the `claude-security` plugin scan on the repo; keep `security-guidance` installed for everyday diff review. Vet any new third-party skill/plugin with both scanners (`tools/skill-audit/audit.sh` in this kit) before installing.
_Sources: OpenAI `security-threat-model` (Apache-2.0); Anthropic plugins; Sentry `skill-scanner`._
- **Incidents:** if a secret could have been exposed (even briefly), rotate it at the provider and check its usage logs for the exposure window; don't assume it wasn't used.
