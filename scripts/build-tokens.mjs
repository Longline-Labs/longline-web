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

const props = (obj, indent = "  ") =>
  Object.entries(obj)
    .filter(([k]) => !k.startsWith("_"))
    .map(([k, v]) => `${indent}--${k}: ${v};`)
    .join("\n");

/** Every colour of one mode: the base, the fixed statuses, and each accent's four roles. */
function mode(name) {
  const accents = Object.fromEntries(
    Object.entries(tokens.accents)
      .filter(([k]) => !k.startsWith("_"))
      .flatMap(([key, a]) => Object.entries(a[name]).map(([role, v]) => [`accent-${key}${role === "accent" ? "" : `-${role}`}`, v])),
  );
  return [props(tokens.base[name]), props(tokens.status[name]), props(accents), `  color-scheme: ${name};`].join("\n");
}

const fonts = Object.entries(tokens.font)
  .map(([k, f]) => `  --font-${k}: var(${f.nextVariable}, "${f.family}"), ${f.fallback};`)
  .join("\n");
const scale = (name, obj) => Object.entries(obj).map(([k, v]) => `  --${name}-${k}: ${v};`).join("\n");

const appAccent = (app) =>
  `[data-app="${app.key}"] {
  --accent: var(--accent-${app.accent});
  --accent-text: var(--accent-${app.accent}-text);
  --accent-fill: var(--accent-${app.accent}-fill);
  --on-accent: var(--accent-${app.accent}-on-fill);
}`;

export const css = `/* Longline Labs web tokens. Generated from tokens/tokens.json and apps.json by scripts/build-tokens.mjs;
   edit those, not this. The names are Harbor's (@longline/harbor), with the per-app accent roles added. */

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
${scale("ll", tokens.layout)}
  /* Harbor's focus ring and the default accent (the family teal) where no app is named. */
  --focus: var(--sea);
  --accent: var(--accent-teal);
  --accent-text: var(--accent-teal-text);
  --accent-fill: var(--accent-teal-fill);
  --on-accent: var(--accent-teal-on-fill);
}

/* Each app's accent, by data-app on the shell (or on <html>). Only --accent* changes; nothing else is repainted. */
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
