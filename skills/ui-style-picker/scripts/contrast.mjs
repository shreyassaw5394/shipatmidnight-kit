#!/usr/bin/env node
// WCAG 2.x contrast checker. Usage: node contrast.mjs <fg> <bg> [<fg> <bg> ...]
// Colours: #rgb, #rrggbb, #rrggbbaa, rgb()/rgba(). A translucent foreground or background is composited
// over the next opaque colour (a translucent background is composited over white unless you pass
// "over:<colour>" as a third token, e.g. `rgba(255,255,255,.15) #0b0c0e over:#0b0c0e`).
// Exit code 1 if any pair is under 4.5:1 (body text). Large text / UI parts need 3:1.

const parse = (s) => {
  s = s.trim().toLowerCase();
  let m;
  if ((m = s.match(/^#([0-9a-f]{3,8})$/))) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  if ((m = s.match(/^rgba?\(([^)]+)\)$/))) {
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  throw new Error(`Unrecognised colour: ${s}`);
};
const over = (top, under) => ({
  r: top.r * top.a + under.r * (1 - top.a),
  g: top.g * top.a + under.g * (1 - top.a),
  b: top.b * top.a + under.b * (1 - top.a),
  a: 1,
});
const lum = ({ r, g, b }) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const args = process.argv.slice(2);
if (args.length < 2) { console.error("usage: contrast.mjs <fg> <bg> [over:<colour>] [<fg> <bg> ...]"); process.exit(2); }
let fail = false;
for (let i = 0; i < args.length; ) {
  const fgS = args[i], bgS = args[i + 1];
  let base = { r: 255, g: 255, b: 255, a: 1 };
  i += 2;
  if (args[i]?.startsWith("over:")) { base = parse(args[i].slice(5)); i++; }
  const bg = over(parse(bgS), base);
  const fg = over(parse(fgS), bg);
  const r = ratio(fg, bg);
  const body = r >= 4.5, large = r >= 3;
  if (!body) fail = true;
  console.log(`${fgS} on ${bgS}: ${r.toFixed(2)}:1  body ${body ? "PASS" : "FAIL"}  large/UI ${large ? "PASS" : "FAIL"}`);
}
process.exit(fail ? 1 : 0);
