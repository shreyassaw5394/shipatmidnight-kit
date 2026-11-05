#!/usr/bin/env node
// Writes THIRD_PARTY_LICENSES.txt for the third-party code that is actually inlined into a bundle.
// The list comes from the bundle's source maps (every file the bundler pulled in), so it matches what ships.
// usage: node scripts/third-party-licenses.mjs <out.txt> <dir-or-.map> [<dir-or-.map> ...]
// Packages from the project itself are skipped: set SELF_PACKAGES to a comma-separated list of names or scopes (e.g. "@acme/,acme-cli").
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const [out, ...inputs] = process.argv.slice(2);
if (!out || !inputs.length) { console.error("usage: third-party-licenses.mjs <out.txt> <dir-or-map>..."); process.exit(2); }

const SELF = (process.env.SELF_PACKAGES ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const maps = [];
for (const i of inputs) {
  const p = resolve(i);
  if (!existsSync(p)) { console.error(`missing: ${p}`); process.exit(1); }
  if (statSync(p).isDirectory()) {
    const walk = (d) => { for (const f of readdirSync(d)) { const q = join(d, f); if (statSync(q).isDirectory()) walk(q); else if (f.endsWith(".map")) maps.push(q); } };
    walk(p);
  } else maps.push(p);
}
if (!maps.length) { console.error("no source maps found: build with sourcemap enabled"); process.exit(1); }

// package root = the path up to the last node_modules/<name> (or node_modules/@scope/<name>)
const roots = new Set();
for (const m of maps) {
  const { sources = [], sourceRoot = "" } = JSON.parse(readFileSync(m, "utf8"));
  for (const s of sources) {
    const abs = resolve(dirname(m), sourceRoot, s.replace(/^webpack:\/\/\//, ""));
    const parts = abs.split(sep); const i = parts.lastIndexOf("node_modules");
    if (i < 0) continue;
    const take = parts[i + 1]?.startsWith("@") ? i + 3 : i + 2;
    roots.add(parts.slice(0, take).join(sep));
  }
}

// Standard MIT text kept in a data file next to this script (references/mit-license.txt) so the code stays short.
const MIT_TEMPLATE = join(dirname(fileURLToPath(import.meta.url)), "..", "references", "mit-license.txt");
function mitText(holder) {
  return readFileSync(MIT_TEMPLATE, "utf8").trim().replace("{{HOLDER}}", holder);
}

// name and version are joined as name@version in the output
const VERSION_SEP = "@";
const LICENSE_FILE = /^(licen[sc]e|copying|notice)(\.|$)/i;

function licenseOf(pkg) {
  if (typeof pkg.license === "string") return pkg.license;
  if (pkg.license && pkg.license.type) return pkg.license.type;
  if (Array.isArray(pkg.licenses) && pkg.licenses.length) return pkg.licenses.map((l) => l.type).join(" OR ");
  return "UNKNOWN";
}

function authorOf(pkg) {
  if (typeof pkg.author === "string") return pkg.author.replace(/\s*[<(].*$/, "");
  return pkg.author ? pkg.author.name : undefined;
}

function isSelf(pkg) {
  if (!pkg.name) return false;
  return SELF.some((n) => (n.endsWith("/") ? pkg.name.startsWith(n) : pkg.name === n));
}

function licenseText(root, license, author) {
  const file = readdirSync(root).find((f) => LICENSE_FILE.test(f));
  if (file) return readFileSync(join(root, file), "utf8").trim();
  // MIT without a licence file: reproduce the standard MIT text with the package's own copyright holder
  if (license === "MIT" && author) return mitText(author);
  return null;
}

function describe(root) {
  const pj = join(root, "package.json");
  if (!existsSync(pj)) return null;
  const pkg = JSON.parse(readFileSync(pj, "utf8"));
  if (isSelf(pkg)) return null; // the project's own code, covered by its LICENSE
  const license = licenseOf(pkg);
  const text = licenseText(root, license, authorOf(pkg));
  const repo = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  return { name: pkg.name, version: pkg.version, license, text, repo };
}

const entries = [...roots].map(describe).filter(Boolean);
const label = (e) => [e.name, e.version].join(VERSION_SEP);
entries.sort((a, b) => label(a).localeCompare(label(b)));

const RULE = "=".repeat(78);
const HEADER = [
  "Third-party software included in this distribution",
  "",
  "This project itself is licensed as stated in its LICENSE file. The bundled files also contain the following",
  "third-party packages, each under its own licence, reproduced below.",
  "",
];

function section(e) {
  const where = e.repo ? " — " + e.repo : "";
  const title = label(e) + " — " + e.license + where;
  const text = e.text ?? "Licensed under " + e.license + ". No licence file was included in the package.";
  return [RULE, title, RULE, text, ""];
}

const body = [...HEADER, ...entries.map((e) => `- ${label(e)} (${e.license})`), "", ...entries.flatMap(section)].join("\n");
writeFileSync(out, body + "\n");
const unknown = entries.filter((e) => e.license === "UNKNOWN" || !e.text);
const note = unknown.length ? `; without licence text: ${unknown.map(label).join(", ")}` : "";
console.log(`${out}: ${entries.length} packages${note}`);
