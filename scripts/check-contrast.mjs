// Checks every colour pairing the shell draws against WCAG 2.1 AA, in both modes, and exits 1 if
// one falls short. Run with `npm run check:contrast` (part of `npm test`).
//
// Thresholds (WCAG 1.4.3 and 1.4.11):
//   4.5:1  text at body size: the accent as link / active nav text on paper and paper-raised; a
//          button's label on its fill; body and muted text on paper; a status word on its tint.
//   3:1    graphics and component boundaries: the top-bar stripe and the app's switcher tile
//          against paper and paper-raised; the hairline-strong border; a status colour as an icon.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const tokens = JSON.parse(readFileSync(path.join(root, "tokens/tokens.json"), "utf8"));
const family = JSON.parse(readFileSync(path.join(root, "apps.json"), "utf8"));

const channel = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
export function luminance(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Not a 6-digit hex colour: ${hex}`);
  const n = parseInt(m[1], 16);
  return 0.2126 * channel(n >> 16) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}
export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const checks = [];
const check = (group, what, fg, bg, min) => checks.push({ group, what, fg, bg, min, ratio: contrast(fg, bg) });

for (const mode of tokens.modes) {
  const base = tokens.base[mode];
  const status = tokens.status[mode];
  const grounds = { paper: base.paper, "paper-raised": base["paper-raised"] };

  // The shared base, so a change to paper or ink can't quietly break the family.
  for (const [g, bg] of Object.entries(grounds)) {
    check(`${mode} base`, `ink on ${g}`, base.ink, bg, 4.5);
    check(`${mode} base`, `ink-muted on ${g}`, base["ink-muted"], bg, 4.5);
    check(`${mode} base`, `hairline-strong border on ${g}`, base["hairline-strong"], bg, 3);
    check(`${mode} base`, `sea as link text on ${g}`, base.sea, bg, 4.5);
  }
  check(`${mode} base`, "on-sea label on a sea button", base["on-sea"], base.sea, 4.5);

  // The fixed statuses: the word on its tint, and the colour alone as an icon on paper.
  for (const tone of ["ok", "warn", "danger", "info"]) {
    check(`${mode} status`, `${tone} word on its tint`, status[`status-${tone}`], status[`status-${tone}-tint`], 4.5);
    check(`${mode} status`, `${tone} icon on paper`, status[`status-${tone}`], base.paper, 3);
  }

  // Each app's accent, in every place the rule lets it appear.
  for (const app of family.apps) {
    const a = tokens.accents[app.accent]?.[mode];
    if (!a) throw new Error(`${app.name}: no accent named ${app.accent}`);
    const group = `${mode} ${app.name} (${app.accent})`;
    for (const [g, bg] of Object.entries(grounds)) {
      check(group, `stripe / switcher tile on ${g}`, a.accent, bg, 3);
      check(group, `active nav and link hover text on ${g}`, a.text, bg, 4.5);
      check(group, `primary button fill against ${g}`, a.fill, bg, 3);
    }
    check(group, "primary button label on its fill", a["on-fill"], a.fill, 4.5);
    // A site that takes another accent for its buttons (apps.json `buttonAccent`): that fill and label too.
    if (app.buttonAccent && app.buttonAccent !== app.accent) {
      const b = tokens.accents[app.buttonAccent]?.[mode];
      if (!b) throw new Error(`${app.name}: no accent named ${app.buttonAccent} (buttonAccent)`);
      for (const [g, bg] of Object.entries(grounds)) check(group, `site button fill (${app.buttonAccent}) against ${g}`, b.fill, bg, 3);
      check(group, `site button label on its fill (${app.buttonAccent})`, b["on-fill"], b.fill, 4.5);
    }
    // The brand assets as approved: reported for the record (a logo and a decorative graphic are exempt from the
    // AA rules), never failed, never recoloured here.
    check(group, "accent stroke of the mark on paper (brand asset, reported only)", a.mark, base.paper, 0);
    check(group, "accent in the longline illustration on paper (brand asset, reported only)", a.illustration, base.paper, 0);
  }
}

const failed = checks.filter((c) => c.ratio < c.min);
const width = Math.max(...checks.map((c) => `${c.group}: ${c.what}`.length));
let lastGroup = "";
for (const c of checks) {
  if (c.group !== lastGroup) {
    console.log(`\n${c.group}`);
    lastGroup = c.group;
  }
  const mark = c.min === 0 ? "note" : c.ratio >= c.min ? "ok  " : "FAIL";
  console.log(`  ${mark} ${c.what.padEnd(width - c.group.length)} ${c.fg} on ${c.bg}  ${c.ratio.toFixed(2)}:1${c.min ? ` (min ${c.min}:1)` : ""}`);
}
console.log(`\n${checks.length} pairings checked, ${failed.length} below AA.`);
if (failed.length) process.exit(1);
