// Fails if a consuming site overrides the shell's type or layout: a declaration of --font-display,
// --font-sans, --font-mono, any --space-* or any --ll-* variable (a pass-through such as
// `--font-sans: var(--font-sans)`, which Tailwind's @theme needs, is allowed); a rule whose subject is an
// .ll- class (styling your own element inside one, such as .ll-hero .notify, is fine); or a font-family written by hand instead of through the font variables. The sites are
// listed in sites.json. Run with `npm run check:sites` (part of `npm test`).
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const { sites } = JSON.parse(readFileSync(path.join(root, "sites.json"), "utf8"));

const PROTECTED = /^--(font-(display|sans|mono)|space-[0-9]+|ll-[a-z0-9-]+)$/;

/** Strips comments, then yields each declaration with the selector (or at-rule) it sits in. */
function* declarations(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const stack = [];
  let buf = "";
  for (const ch of clean) {
    if (ch === "{") {
      stack.push(buf.trim());
      buf = "";
    } else if (ch === "}") {
      stack.pop();
      buf = "";
    } else if (ch === ";") {
      const decl = buf.trim();
      buf = "";
      const colon = decl.indexOf(":");
      if (colon > 0) yield { prop: decl.slice(0, colon).trim(), value: decl.slice(colon + 1).trim(), where: stack.join(" > ") };
    } else buf += ch;
  }
}

/** Selectors (not at-rules) whose subject, the last compound, is an ll- class: a site restyling the shell. */
function llSelectors(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const found = [];
  for (const m of clean.matchAll(/([^{};]+)\{/g)) {
    const sel = m[1].trim();
    if (sel.startsWith("@")) continue;
    for (const one of sel.split(",")) {
      const subject = one.trim().split(/\s*[\s>+~]\s*/).pop() ?? "";
      if (/\.ll-[a-z0-9-]+/.test(subject)) found.push(one.trim());
    }
  }
  return found;
}

let problems = 0;
let checked = 0;
for (const site of sites) {
  for (const rel of site.css) {
    const file = path.resolve(root, rel);
    if (!existsSync(file)) {
      console.log(`skip  ${site.name}: ${rel} is not on this machine`);
      continue;
    }
    checked++;
    const css = readFileSync(file, "utf8");
    const found = [];
    for (const d of declarations(css)) {
      if (PROTECTED.test(d.prop) && d.value !== `var(${d.prop})`) found.push(`${d.where || ":root"} { ${d.prop}: ${d.value} }  (the shell owns this variable)`);
      if (d.prop === "font-family" && !/^var\(--/.test(d.value) && d.value !== "inherit") found.push(`${d.where} { font-family: ${d.value} }  (name fonts only through the font variables)`);
    }
    for (const sel of llSelectors(css)) found.push(`${sel} { … }  (styles a shell class)`);
    if (found.length) {
      problems += found.length;
      console.log(`FAIL  ${site.name}: ${rel}`);
      for (const f of found) console.log(`        ${f}`);
    } else console.log(`ok    ${site.name}: ${rel}`);
  }
}
console.log(`\n${checked} stylesheet(s) checked, ${problems} override(s).`);
if (problems) process.exit(1);
