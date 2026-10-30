// Writes tokens.css from tokens/tokens.json and apps.json. Run with `npm run build:tokens`;
// `npm run check:tokens` fails if tokens.css is out of date. Plain CSS custom properties, so a
// site on any stack (Next, Astro, static HTML) can use them; the React components in src/ read
// the same names.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const tokens = JSON.parse(readFileSync(path.join(root, "tokens/tokens.json"), "utf8"));
const family = JSON.parse(readFileSync(path.join(root, "apps.json"), "utf8"));

const named = (obj) => Object.entries(obj).filter(([k]) => !k.startsWith("_") && k !== "phone");
const props = (obj, indent = "  ") => named(obj).map(([k, v]) => `${indent}--${k}: ${v};`).join("\n");

/** Every colour of one mode: the base, the fixed statuses, and each accent's four roles. */
function mode(name) {
  const accents = Object.fromEntries(
    named(tokens.accents).flatMap(([key, a]) => Object.entries(a[name]).map(([role, v]) => [`ll-accent-${key}${role === "accent" ? "" : `-${role}`}`, v])),
  );
  return [props(tokens.base[name]), props(tokens.status[name]), props(accents), `  color-scheme: ${name};`].join("\n");
}

const fonts = Object.entries(tokens.font)
  .map(([k, f]) => `  --font-${k}: var(${f.nextVariable}, "${f.family}"), ${f.fallback};`)
  .join("\n");
const scale = (name, obj) => named(obj).map(([k, v]) => `  --${name}-${k}: ${v};`).join("\n");

/** One type role as variables: size, line, weight, and tracking where it has one. */
const typeVars = (role, t, indent = "  ") =>
  [
    `${indent}--ll-${role}-size: ${t.size}px;`,
    `${indent}--ll-${role}-line: ${t.line}px;`,
    t.weight !== undefined ? `${indent}--ll-${role}-weight: ${t.weight};` : null,
    t.tracking !== undefined ? `${indent}--ll-${role}-tracking: ${t.tracking};` : null,
  ]
    .filter(Boolean)
    .join("\n");
const typeBlock = named(tokens.type).map(([role, t]) => typeVars(role, t)).join("\n");
const typePhone = named(tokens.type)
  .filter(([, t]) => t.phone)
  .map(([role, t]) => typeVars(role, { ...t.phone }, "    ").split("\n").filter((l) => !l.includes("-weight") && !l.includes("-tracking")).join("\n"))
  .join("\n");
const layoutPhone = Object.entries(tokens.layout.phone)
  .map(([k, v]) => `    --ll-${k}: ${v};`)
  .join("\n");

const appAccent = (app) =>
  `[data-app="${app.key}"] {
  --ll-accent: var(--ll-accent-${app.accent});
  --ll-accent-text: var(--ll-accent-${app.accent}-text);
  --ll-accent-fill: var(--ll-accent-${app.accent}-fill);
  --ll-on-accent: var(--ll-accent-${app.accent}-on-fill);
  --ll-mark-accent: var(--ll-accent-${app.accent}-mark);
}`;

export const css = `/* Longline Labs web tokens. Generated from tokens/tokens.json and apps.json by scripts/build-tokens.mjs;
   edit those, not this. The colour names are Harbor's (@longline/harbor); the accent roles, the type scale and the
   page frame are the shell's own (--ll-*). A site inherits every one of them and defines none (scripts/check-sites.mjs). */

/* Light: the default, and what the switch chooses with data-theme="light" on <html>. */
:root,
[data-theme="light"] {
${mode("light")}
}

/* Dark, chosen with the switch. */
[data-theme="dark"] {
${mode("dark")}
}

/* Dark, because the device is, where nobody has chosen with the switch. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${mode("dark").replace(/^/gm, "  ")}
  }
}

/* A printed page (or one saved as a PDF) uses the light colours whatever the screen shows. */
@media print {
  :root,
  :root:not([data-theme="light"]),
  :root[data-theme="dark"] {
${mode("light").replace(/^/gm, "  ")}
  }
}

:root {
  /* Fonts. A Next site serving them with next/font sets the variables; anywhere else they are found by name. */
${fonts}
${scale("space", tokens.space)}
${scale("radius", tokens.radius)}
  /* The type scale: one set of sizes for every site. */
${typeBlock}
  /* The page frame. */
${scale("ll", tokens.layout)}
  /* Harbor's focus ring and the default accent (the family teal) where no app is named. */
  --focus: var(--sea);
  --ll-accent: var(--ll-accent-teal);
  --ll-accent-text: var(--ll-accent-teal-text);
  --ll-accent-fill: var(--ll-accent-teal-fill);
  --ll-on-accent: var(--ll-accent-teal-on-fill);
}

/* On a phone the display sizes and the frame tighten; everything else holds. */
@media (max-width: 767px) {
  :root {
${typePhone}
${layoutPhone}
  }
}

/* Each app's accent, by data-app on the shell (or on <html>). Only --ll-accent* changes; nothing else is repainted. */
${family.apps.map(appAccent).join("\n")}
`;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = path.join(root, "tokens.css");
  if (process.argv.includes("--check")) {
    const current = readFileSync(out, "utf8");
    if (current !== css) {
      console.error("tokens.css is out of date: run `npm run build:tokens`.");
      process.exit(1);
    }
    console.log("tokens.css is up to date.");
  } else {
    writeFileSync(out, css);
    console.log(`Wrote ${path.relative(process.cwd(), out)}`);
  }
}
