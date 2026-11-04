# @longline/web

The website shell shared by coifish.com, reelminders.com and packetskipper.com. One family: the same
header, footer, type and colours on every site, so moving between them feels like switching tabs.
Each site changes exactly three things: its wordmark, its copy, and one accent colour.

- `tokens/tokens.json` is the source of every colour, font, space and radius, for light and dark.
  `tokens.css` is generated from it: plain CSS custom properties any stack can use.
- `apps.json` is the one list of the family: name, domain, accent, whether the site is up.
- `shell.css` styles the shell's components. Every class starts with `ll-`.
- `src/` holds the React components: `Shell`, `Header`, `AppSwitcher`, `AppRail`, `FamilySection`, `Footer`,
  `ThemeToggle`, the marks, the illustration, and `themeScript()` for the root layout.
- `scripts/check-contrast.mjs` fails `npm test` if any accent, in either mode, falls below WCAG AA
  where the rule lets it appear.
- `scripts/check-sites.mjs` fails `npm test` if a consuming site (listed in `sites.json`) overrides the
  shell's type or layout: see "Type and layout parity" below.
- `NOTES.md` records what the three sites were built with before this package and what moving the
  other two takes.

The brand's source of truth is `brand/longline-labs-approved-brand-package` (the final package, October 30,
2026): the Linked LL for Longline Labs, the six app marks, `palette.json` and the supporting illustration. The
marks are inline SVG with the files' geometry exactly (`src/marks.tsx`); the files themselves are in `logos/`
(default, dark and mono) and are the base for favicons. The six-app longline (`illustration/`,
`LonglineIllustration`: a straight mainline, six equal drops, the actual app marks beneath) is a supporting
graphic used large: at 360px in `FamilySection`, the whole column on a phone, never in the header, never as a
favicon or compact icon; apps are not added to it automatically. The package's handoff writes the fifth app as
ShipShapeFiles; Brandon's decision is that the product is ShipShape and shipshapefiles.com is its domain,
which is what the shell shows.

## The family: six apps, all live

`apps.json` lists the apps in longline order: Coifish, ReelMinder, PacketSkipper, BallastBook, ShipShape
(its domain is shipshapefiles.com, so its key and mark files say `shipshapefiles`), AboveBoard. Each has:

- `status`: `"live"` or `"coming-soon"`. Every app is live (its website is up). A live app is linked from the switcher and
  the family section; a coming-soon app shows its mark and accent with a "Coming soon" label, is not a link,
  and announces itself as "Name, coming soon". **To launch an app, change that one word.**
- `switcher`: whether the header's switcher lists it (all six today).
- `domain` / `url`: coifish.com, reelminders.com, packetskipper.com, ballastbook.com, shipshapefiles.com,
  aboveboarddocs.com. A coming-soon app's domain is recorded but not linked until it goes live.
- `description`: the one line under the name in the switcher and the family section, as Brandon wrote them.

The two sites already built (reelminders.com, packetskipper.com) still render through the shell; the switcher
simply treats them as coming soon until their status flips.

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

`Shell` also draws the rail (`AppRail`): 56px of app marks down the left under the header on desktop, in
longline order, widening on hover to show the names; the current app is ringed in its accent, a live app links to
its site, the rest say "Coming soon". It is the family's standing advertisement on every page and is hidden on
phones, where the switcher does the job; where the rail shows, the header's switcher is hidden as redundant. Pass `rail: false` and `switcher: false` for a page that shouldn't
promote the other apps (an invitation a board member opens). `Header` and `Footer` can be used on their own. The copyright line
reads `company.legalName` from `apps.json` (LONGLINE LABS LLC) and no site can override it.

Where the site knows who is signed in, `inUse` in the config (or on `AppRail` and `AppSwitcher` directly) is the person's
apps as keys: the apps they have let sign them in with their Longline Labs account, which the app's own server reads from
the account site (`apps/longline-account`, `POST /api/apps-in-use`, signed with the key `setup:client` wrote into the
app's settings). With at least one app besides the current one in it, the person's own apps stay at full strength and
lead to the signed-in app (`appUrl` in `apps.json`) where it has one; the others go quiet (faded) but stay links, and
no label says which is which (Brandon, November 4, 2026). Leave it out, or pass null, when nobody is signed in or the list couldn't be read: the rail must never break a
page, so the whole family then shows as it always has. `appsToMark` and `ownAppHref` do the same sums for a site that
draws its own rail.

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
| The accent stroke inside the app's mark (`--ll-accent-<key>-mark`) and its dot in the longline (`-illustration`) | from the brand package's palette.json | reported, not failed: brand assets |

In dark mode the first three apps keep their day colour inside the mark and in the illustration (#d9643a,
#c6912c, #2e8a68); the three newer apps take their night value for both (#8aa0e0, #c993c2, #79b9d8), as the
final package's palette.json records. The UI roles (stripe, button, active link) are separate tokens and use
the lifted night values Harbor already called those apps' dark accents, so a palette change to the marks or the
illustration never repaints a button.

Nowhere else: not on headings, kickers, cards, backgrounds, borders or status badges. The variables are
namespaced (`--ll-accent`, `--ll-accent-text`, `--ll-accent-fill`, `--ll-on-accent`) so they never collide with a
site's own `--accent`, which on all three sites today is the family teal. The status
colours (`--status-ok`, `--status-warn`, `--status-danger`, `--status-info` and their tints) are the same
on every site and mean the same thing: current, expiring soon, expired, pending review.

Where a brand colour is too light for a role by day (ReelMinder's brass, Coifish's rust on a button, AboveBoard's azure as text), the role takes a deeper
value of the same colour; the hex pairs are in `tokens/tokens.json` under `accents`, and
`npm run check:contrast` prints every pairing with its ratio.

## Changing something

Everything the family says about itself lives here once: `apps.json` (each app's name, domain, accent, status and
one-line description, and the company's name and family line) and `tokens/tokens.json`. The sites and the apps
read the package; none keeps its own copy of the list. So a change here is made once, then rolled out.

### Releasing a change

1. Edit `tokens/tokens.json` or `apps.json`; run `npm run build:tokens`; run `npm test`.
2. Note it in `CHANGELOG.md`, bump `version` in `package.json`, commit, tag `vX.Y.Z`.
3. Push the branch and the tag: `git push origin main && git push origin vX.Y.Z`. Nothing below works until the tag
   is on GitHub, because Coifish installs the package from there.

### Rolling it out to every site

Each consumer takes the new version when its command below is run; a pinned version never changes under a site.
Brandon runs each production deploy himself in his terminal.

| Where it shows | Repo | Command |
| --- | --- | --- |
| longlinelabs.com (cards, longline) | `apps/longlinelabs` | `node scripts/sync.mjs`, then `npx wrangler deploy` |
| coifish.com (family section, header switcher, rail) and the Coifish app's Dock | `apps/Coifish` | Change `#vX.Y.Z` on `@longline/web` in `package.json`, `npm install`, commit, `git push` (the pre-push hook runs the safety net). Then check Vercel for the new production deployment; on October 30, 2026 the push alone did not start one, and `vercel deploy --prod` from a clean copy (PROGRESS.md there, October 21) did |
| reelminders.com (family section, switcher, rail) | `apps/ReelMinder` | `rm -rf node_modules/@longline/web && npm install && npm run site:deploy` |
| packetskipper.com (family section, switcher, rail) | `apps/PacketSkipper` (branch `longline-shell`) | `rm -rf node_modules/@longline/web && npm install && npm run build`, then `npx vercel deploy --prod` (Vercel project `packetskipper`, team `coif-ish`; `npx vercel link --yes --scope coif-ish --project packetskipper` first if the folder is not linked) |

ReelMinder and PacketSkipper depend on `file:../../packages/longline-web` copied into `node_modules` (their `.npmrc`
has `install-links=true`), and npm does not refresh that copy on its own, hence the `rm -rf` first. Coifish pins a tag
on GitHub so Vercel can fetch it. The Coifish app's in-app Dock reads the same `apps` list (`src/config/apps.ts`
there), so it moves with the website.

