# @longline/web

The website shell shared by coifish.com, reelminders.com and packetskipper.com. One family: the same
header, footer, type and colours on every site, so moving between them feels like switching tabs.
Each site changes exactly three things: its wordmark, its copy, and one accent colour.

- `tokens/tokens.json` is the source of every colour, font, space and radius, for light and dark.
  `tokens.css` is generated from it: plain CSS custom properties any stack can use.
- `apps.json` is the one list of the family: name, domain, accent, whether the site is up.
- `shell.css` styles the shell's components. Every class starts with `ll-`.
- `src/` holds the React components: `Shell`, `Header`, `AppSwitcher`, `Footer`, `ThemeToggle`, the
  marks, and `themeScript()` for the root layout.
- `scripts/check-contrast.mjs` fails `npm test` if any accent, in either mode, falls below WCAG AA
  where the rule lets it appear.
- `scripts/check-sites.mjs` fails `npm test` if a consuming site (listed in `sites.json`) overrides the
  shell's type or layout: see "Type and layout parity" below.
- `NOTES.md` records what the three sites were built with before this package and what moving the
  other two takes.

> **Draft logo, awaiting Brandon's real asset.** No Longline Labs logo exists in any repo or in the
> brand folder (searched October 30, 2026). `LonglineMark` and `logos/longline-mark-draft*.svg` are a
> draft drawn from his description: a double-L monogram over a longline, one main line with three short
> branch lines, each ending in a dot in one app's accent (rust, brass, kelp). It is in the header, the
> switcher's title and the footer on every site, so he can judge it in place. When the real mark
> arrives, replace the drawing in `src/marks.tsx` and the three SVG files, and nothing else changes.
> The SVG files are also the base for a Longline Labs favicon; each app's own favicon stays its own mark.

## Consuming it

All three sites are Next.js (App Router) with React 19, so the components are React and the package
ships TypeScript source; Next compiles it with the site.

**Local checkout (all three repos sit beside `packages/`; this is what they use today):**

```json
"dependencies": { "@longline/web": "file:../../packages/longline-web" }
```

Each app's `.npmrc` has `install-links=true`, so npm copies the package into `node_modules` instead of
linking it (the components then find the app's own React). After a change here, run
`rm -rf node_modules/@longline/web && npm install` in the app.

**From GitHub (ReelMinder's site builds on Cloudflare Pages, where the path above won't exist):** before
its next deploy, push this repo to the Longline-Labs organisation and pin a tag instead:

```json
"dependencies": { "@longline/web": "github:Longline-Labs/longline-web#v0.1.0" }
```

Then, in `next.config.ts`:

```ts
transpilePackages: ["@longline/web"],
```

In the root stylesheet, before the site's own rules:

```css
@import "@longline/web/tokens.css";
@import "@longline/web/shell.css";
```

(A site with its own cascade layers can take `shell.css` into one: `@import "@longline/web/shell.css" layer(shell);`.)

In the root layout, so a remembered light/dark choice applies before the first paint:

```tsx
import { themeScript } from "@longline/web";
<head><script dangerouslySetInnerHTML={{ __html: themeScript() }} /></head>
```

Describe the site once:

```ts
import Link from "next/link";
import type { ShellConfig } from "@longline/web";

export const SHELL: ShellConfig = {
  app: "coifish",                                    // picks the wordmark and the accent from apps.json
  nav: [{ label: "How it works", href: "#how" }, { label: "Pricing", href: "#pricing" }, { label: "Help", href: "https://app.coifish.com/help" }],
  signIn: { label: "Sign in", href: "https://app.coifish.com/sign-in" },
  cta: { label: "Start free trial", href: "https://app.coifish.com/sign-up" },
  footerLinks: [ /* Help, Terms of Service, Privacy Policy */ ],
  themeStorageKey: "coifish-theme",                  // only if the site already remembers under another name
  Link,
};
```

And wrap each public page:

```tsx
import { Shell } from "@longline/web";
<Shell config={SHELL}>…the page's sections…</Shell>
```

`Shell` renders `<main id="ll-main">` around its children; pass `main={false}` to keep a page's own
`<main>` (give it `id="ll-main"` so the skip link still works). Before an app opens, pass
`closedNotice: "Opening soon"` and the Sign in link and button are replaced by that text.

`Shell` also takes `switcher: false` in the config for a page that shouldn't promote the other apps (an
invitation a board member opens). `Header` and `Footer` can be used on their own. The copyright line
reads `company.legalName` from `apps.json` (LONGLINE LABS LLC) and no site can override it.

The components use no Tailwind classes, so a Tailwind site needs no `@source` for the package. The
fonts are found by name, or through next/font's variables `--font-fraunces`, `--font-instrument` and
`--font-plex-mono` when the site serves them itself.

Other stacks (Astro, static HTML): import the two CSS files and build the markup from `shell.css`'s
classes; the inline `themeScript()` text works in any `<script>`; the marks are in `logos/`.

## Type and layout parity

Every site uses one type scale and one page frame, so moving between them feels like switching tabs.
Both live in `tokens/tokens.json` (`type` and `layout`) and come out of `tokens.css` as `--ll-*`
variables, with the classes in `shell.css` that apply them:

| Role | Class | Desktop | Phone (< 768px) |
|---|---|---|---|
| Page title / hero headline | `ll-h1`, `ll-display-xl` | Fraunces 500, 44/50, −0.01em | 32/38 |
| Section title | `ll-h2`, `ll-display-md` | Fraunces 500, 28/34 | 24/30 |
| Card title | `ll-title` | Instrument Sans 600, 20/28 | |
| Heading | `ll-heading` | 600, 16/24 | |
| Lede, section line, kicker | `ll-lede`, `ll-section-line`, `ll-kicker`, `ll-body-lg` | 17/26 (kicker 600, in the family teal) | |
| Body | `ll-body` (the shell's default) | 15/22 | |
| Small | `ll-body-sm` | 13/18 | |
| Label | `ll-label` | 600, 12/16, 0.04em, uppercase | |
| Figures | `ll-numeral` | IBM Plex Mono 500, 15/22, tabular | |

| Frame | Class / variable | Desktop | Phone |
|---|---|---|---|
| Content width and gutter | `ll-container` | 1100px, 24px | 16px |
| Header | `ll-header` | 64px tall, 3px accent stripe | |
| Hero | `ll-hero` | two columns 1fr / 1.15fr, 48px apart, 48px above and 64px below | one column, 32 / 40 |
| Section rhythm | `ll-section`, `ll-section-rule` | 40px below each section; a hairline above with 40px | 32px |
| Pricing | `ll-pricing-grid` | two equal columns, 16px apart | one column |
| Sub page | `ll-page-top` | the hero's top padding | |

A site writes its hero as `ll-container ll-hero` with `ll-kicker`, `ll-h1`, `ll-lede` and
`ll-cta-row`; each section as `ll-container ll-section` (plus `ll-section-rule` for a hairline) with
`ll-h2` and, where it has one, `ll-section-line`; the pricing block as `ll-pricing-grid`. Everything
inside those (mockups, steps, tables, forms) is the site's own.

**The rule, and the check.** A site defines none of `--font-display`, `--font-sans`, `--font-mono`,
`--space-*` or any `--ll-*` variable (a pass-through such as `--font-sans: var(--font-sans)`, which
Tailwind's `@theme inline` needs, is allowed), restyles no `ll-` class (styling its own element inside
one, such as `.ll-hero .notify`, is fine), and names no font by hand. `npm run check:sites` reads the
stylesheets listed in `sites.json` and fails on any of those; a path that isn't on the machine is
skipped, so the check also runs where only the package is checked out.

## The accent rule

Every site shares the same base in both modes: paper and ink, the hairlines, the status colours, the
focus ring. **Backgrounds are never repainted per app.** Each app has one accent, named in `apps.json`,
and it appears in exactly these places:

| Allowed | Token | Must pass |
|---|---|---|
| The 3px stripe along the top of the header | `--ll-accent` | 3:1 against paper and paper-raised |
| The ring on the app's tile in the switcher | `--ll-accent` | 3:1 |
| The active nav item, and any link on hover | `--ll-accent-text` | 4.5:1 against paper and paper-raised |
| The one primary button (header, hero, pricing) | `--ll-accent-fill` with `--ll-on-accent` text | 4.5:1 label on fill, 3:1 fill against paper |
| The favicon | the app's mark | (a logo; exempt) |

Nowhere else: not on headings, kickers, cards, backgrounds, borders or status badges. The variables are
namespaced (`--ll-accent`, `--ll-accent-text`, `--ll-accent-fill`, `--ll-on-accent`) so they never collide with a
site's own `--accent`, which on all three sites today is the family teal. The status
colours (`--status-ok`, `--status-warn`, `--status-danger`, `--status-info` and their tints) are the same
on every site and mean the same thing: current, expiring soon, expired, pending review.

Where a brand colour is too light for a role by day (ReelMinder's brass, Coifish's rust on a button), the role takes the deeper
value of the same colour; the hex pairs are in `tokens/tokens.json` under `accents`, and
`npm run check:contrast` prints every pairing with its ratio.

## Changing something

1. Edit `tokens/tokens.json` or `apps.json`; run `npm run build:tokens`; run `npm test`.
2. Note it in `CHANGELOG.md`, bump the version, tag.
3. Each site updates its dependency when it is ready. A pinned version never changes under a site.
