#!/usr/bin/env node
// Loads a page the way a real visitor would and reports every request to another host and every cookie,
// before any choice, after "Reject", after "Accept", and with Global Privacy Control on.
// usage: node privacy-probe.mjs <url> [bannerSelector] [rejectText] [acceptText]
// needs: playwright (npx playwright install chromium, or run from a project that has it)
import { chromium } from "playwright";
const [url, banner = '[aria-label="Privacy choices"], [role="dialog"]', rejectText = "Reject", acceptText = "Accept"] = process.argv.slice(2);
if (!url) { console.error("usage: privacy-probe.mjs <url> [bannerSelector] [rejectText] [acceptText]"); process.exit(2); }
const origin = new URL(url).origin;
const b = await chromium.launch({ headless: true });
for (const mode of ["fresh", "reject", "accept", "gpc"]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  if (mode === "gpc") await ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, "globalPrivacyControl", { get: () => true }));
  const p = await ctx.newPage(); const hosts = []; const errs = [];
  p.on("request", (r) => { const u = new URL(r.url()); if (u.origin !== origin && !u.protocol.startsWith("data")) hosts.push(u.host); });
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  await p.goto(url, { waitUntil: "networkidle" }).catch(() => {}); await p.waitForTimeout(1200);
  const shown = await p.locator(banner).count(); const before = [...new Set(hosts)];
  const click = async (t) => { const btn = p.getByRole("button", { name: new RegExp(`^${t}`, "i") }).first(); if (await btn.count()) await btn.click(); };
  if (mode === "reject") await click(rejectText);
  if (mode === "accept") await click(acceptText);
  await p.waitForTimeout(2500);
  const after = [...new Set(hosts)].filter((h) => !before.includes(h));
  console.log(mode.padEnd(7), JSON.stringify({ banner: shown, hostsBeforeChoice: before, newHostsAfter: after, cookies: (await ctx.cookies()).map((c) => c.name), errors: errs }));
  await ctx.close();
}
await b.close();
