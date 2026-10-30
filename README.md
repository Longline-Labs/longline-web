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
- `NOTES.md` records what the three sites were built with before this package and what moving the
  other two takes.

> **Placeholder logo.** No Longline Labs logo exists yet. `LonglineMark` and
> `logos/longline-mark-placeholder*.svg` are a ring-and-dot stand-in. When the real mark arrives,
> replace the drawing in `src/marks.tsx` and the two SVG files, and nothing else changes.

## Consuming it

All three sites are Next.js (App Router) with React 19, so the components are React and the package
ships TypeScript source; Next compiles it with the site.

**Local checkout (Coifish, PacketSkipper: the repos sit beside `packages/`):**

```json
"dependencies": { "@longline/web": "file:../../packages/longline-web" }
```

**From GitHub (ReelMinder's site builds on Cloudflare, so a path won't do):** once this repo is pushed
to the Longline-Labs organisation, pin a commit or tag:

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

The components use no Tailwind classes, so a Tailwind site needs no `@source` for the package. The
fonts are found by name, or through next/font's variables `--font-fraunces`, `--font-instrument` and
`--font-plex-mono` when the site serves them itself.

Other stacks (Astro, static HTML): import the two CSS files and build the markup from `shell.css`'s
classes; the inline `themeScript()` text works in any `<script>`; the marks are in `logos/`.

## The accent rule

Every site shares the same base in both modes: paper and ink, the hairlines, the status colours, the
focus ring. **Backgrounds are never repainted per app.** Each app has one accent, named in `apps.json`,
and it appears in exactly these places:

| Allowed | Token | Must pass |
|---|---|---|
| The 3px stripe along the top of the header | `--accent` | 3:1 against paper and paper-raised |
| The ring on the app's tile in the switcher | `--accent` | 3:1 |
| The active nav item, and any link on hover | `--accent-text` | 4.5:1 against paper and paper-raised |
| The one primary button (header, hero, pricing) | `--accent-fill` with `--on-accent` text | 4.5:1 label on fill, 3:1 fill against paper |
| The favicon | the app's mark | (a logo; exempt) |

Nowhere else: not on headings, kickers, cards, backgrounds, borders or status badges. The status
colours (`--status-ok`, `--status-warn`, `--status-danger`, `--status-info` and their tints) are the same
on every site and mean the same thing: current, expiring soon, expired, pending review.

Where a brand colour is too light for a role by day (ReelMinder's brass), the role takes the deeper
value of the same colour; the hex pairs are in `tokens/tokens.json` under `accents`, and
`npm run check:contrast` prints every pairing with its ratio.

## Changing something

1. Edit `tokens/tokens.json` or `apps.json`; run `npm run build:tokens`; run `npm test`.
2. Note it in `CHANGELOG.md`, bump the version, tag.
3. Each site updates its dependency when it is ready. A pinned version never changes under a site.
