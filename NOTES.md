# What the three sites looked like before this package (October 30, 2026)

Read before changing the package: it records what each app's marketing site is built with, where its
shell lived, and what colour it called its own.

## The suite already has a design language: Harbor

`apps/harbor` is `@longline/harbor` (0.1.0 on its `main`; a 0.2.0 exists only as the GitHub commit
ReelMinder pins and on Coifish's branch `overnight/2026-10-25-harbor-0.2`). It holds the palette
(`tokens.css` / `tokens.json`), the approved marks, the list of apps, and the signed-in app's shared
pieces (Dock, StatusBadge, ThemeSwitch, FamilySection). All three apps depend on it. This package
builds on it rather than beside it: the token names and values here are Harbor's, with the per-app
accent roles and the web shell added. Harbor stays the source for the signed-in apps; `@longline/web`
is the source for the public sites.

## The stacks

| | Coifish | ReelMinder | PacketSkipper |
|---|---|---|---|
| Framework | Next.js 16.4 (App Router), React 19.3 | Next.js 16.4, React 19.3 | Next.js 16.4, React 19.3 |
| Styling | Tailwind 4 utilities over Harbor's CSS variables | Plain CSS (`site/app/site.css`) in cascade layers over Harbor's variables; no Tailwind on the site | Plain CSS classes in `src/app/globals.css` (Tailwind 4 is loaded, used lightly) over Harbor's variables |
| Where the site lives | Same Next app as the product. `src/app/landing/page.tsx`; `src/proxy.ts` rewrites `/` to `/landing` for coifish.com and sends every other path to app.coifish.com. Deployed on Vercel. | A second Next app in `site/` (`output: "export"`, static files), deployed to Cloudflare Pages as reelminders.com; the product is at app.reelminders.com. | Same Next app as the product, route group `src/app/(public)`. |
| Header / footer | Inline in `landing/page.tsx`, with `src/components/Dock.tsx` (DockCorner, Dock rail, DockButton) and `src/components/Brand.tsx` (the mark + name lockup as one SVG) | `site/components/shell.tsx` (SiteHeader, SiteRail, SiteFooter), using Harbor 0.2's DockCorner / Dock / DockButton / ThemeSwitch | `src/components/public/PublicShell.tsx` (PublicFrame, PublicHeader, PublicFooter) and `AppsMenu.tsx`, with Harbor's Mark and ThemeSwitch |
| Theme | `src/lib/theme.ts` + `src/components/ThemeSwitch.tsx`; the choice is kept under `localStorage["coifish-theme"]`; an inline script in `src/app/layout.tsx` applies it before paint; the device setting applies through CSS when nothing is stored | Harbor 0.2's `ThemeSwitch` and `themeChoiceScript()`; key `theme` | Harbor 0.1's `ThemeSwitch` and `themeBootScript`; key `theme`; the boot script also writes the device setting as `data-theme` |
| Fonts | Fraunces, Instrument Sans, IBM Plex Mono via next/font (self-hosted), exposed as `--font-fraunces`, `--font-instrument`, `--font-plex-mono` | Same | Same (plus Newsreader for the agenda preview) |
| Harbor dependency | `file:../harbor` (0.1.0) | `github:Longline-Labs/harbor#a103b82…` (0.2.0) | `file:../harbor` (0.1.0) |
| Pre-launch state | Open | `WEBSITE.appOpen` in `src/config.ts` swaps Help/Sign in for "Questions" and a launch-list form | `serverEnv.signupsOpen`; while closed, every Sign in / Start free trial becomes an "Opening soon" pill |

## Accent colours as each app recorded them

Harbor's rule was "the company owns the chrome, the app owns one colour": `sea` (#1d4b5a by day,
#7fb4c4 by night) is the shared teal on every primary button, link and focus ring, and each app's own
colour appears only in its mark, its tile in the Dock and the 2px underline of its signed-in app bar.

| App | Harbor's accent token | Light | Dark | Where it showed on the site |
|---|---|---|---|---|
| Coifish | `koi` (rust) | #d9643a (`koi-deep` #b24a24 for text) | #e8865c (#f0a07a) | Only inside the mark (the fish's body). Buttons, links and the kicker were `sea` teal. |
| ReelMinder | `brass` (gold) | #c6912c (`brass-deep` #8a5f10) | #d9a94a (#e4b85e) | The mark, and the hero kicker in `brass-deep`. Buttons `sea`. |
| PacketSkipper | `kelp` (green) | #2e8a68 (`kelp-deep` #1f6b50) | #4fb08a (#67c39d) | The mark, and the hero kicker in `kelp-deep`. Buttons `sea`. |

The fixed statuses (never repainted): ok / current #1e6f7a (#6dc4cf dark), warn / expiring soon
#8a5f10 (#e4b85e), danger / expired #a63a2e (#ef8b7d), each on its own tint; "Pending review" on
coifish.com is the family teal on `sea-tint`, kept here as `status-info`.

## The accent decision

The brief for this package puts the accent on the primary button, the active nav item and link hover,
the favicon, the switcher tile and a stripe in the top bar. Brandon decided (October 30, 2026) that
each app's accent is its Harbor brand colour and teal stays the family colour: so `apps.json` records
Coifish as **`koi`** (rust, as drawn in its fish), ReelMinder as `brass` and PacketSkipper as `kelp`.
On coifish.com that turns the header, hero and pricing buttons from teal to rust; links, the kicker,
focus rings and everything else stay the family teal. The `teal` accent is kept in
`tokens/tokens.json` for a site with no colour of its own. By day the rust button is `koi-deep`
(#b24a24), since the fish's #d9643a reads only 3.25:1 on paper: enough for the stripe and the tile,
not for a label on a fill.

## Logos

Until the afternoon of October 30, 2026 no Longline Labs logo existed anywhere in the suite, and the package
carried first a placeholder (Harbor's ring and dot), then a draft. That afternoon Brandon supplied
`brand/approved-five-app-brand-package`, then `brand/longline-labs-complete-brand-package`, then the final
`brand/longline-labs-approved-brand-package`, which supersedes both and is the source of truth; the package uses it: the Linked LL company mark, six app marks (the first
three byte-identical to the Option 2 files already in use), the six-colour longline and `palette.json`.
Naming: the package's handoff calls the fifth app ShipShapeFiles; Brandon confirmed the product name is
ShipShape and shipshapefiles.com is only its domain, so the display name is ShipShape and the key and files
stay `shipshapefiles`. No repo uses the name AboveboardDocs. Dark reconciliation: the complete
package's palette gave the first three a lifted night colour in the illustration (#e8865c, #d9a94a, #4fb08a),
exactly Harbor's dark accents; the final package's palette makes their illustration colour the day accent, the
same as inside the mark. The shell's UI roles (stripe, button, active link) are separate tokens and still use
Harbor's lifted night values, so nothing in the UI changed with either palette. The final illustration draws the
six actual marks under a straight mainline, replacing the dots.

## What each site dropped to reach parity (October 30, 2026)

- **coifish.com**: the landing page's Tailwind arbitrary sizes for the hero (`text-[2.1rem] md:text-[2.75rem]`,
  `text-[1.75rem]` section titles, `text-[1.1rem]` lede, `py-12 md:py-16` hero, `pb-10` sections,
  `max-w-[1100px] px-4 md:px-6` container, `md:grid-cols-2` pricing) for the shell's classes; its own
  Dock rail, header and footer; the device-dark and print colour repeats in globals.css; the
  `@theme inline` font stacks now pass through to the shell's. Kept: its `--radius-md/lg` Tailwind corner
  sizes (6/8px) for the signed-in app, and everything inside the sections.
- **reelminders.com**: `site.css` lost its font stacks and `--header` / `--content` / `--rail`, the
  `.site-header*`, `.wordmark`, `.site-nav*`, `.site-footer*`, `.container`, `.section*`, `.hero*` and
  `.kicker` rules and their phone variants, the `.pricing` grid, and `.skip-link`; `shell.tsx` is now the
  config plus `SiteShell`; the header's `TrialButton` moved into the config (`Tell me when it opens` → the
  launch list while the app is closed). Kept: the mockup, the Monday email, the glance figure, steps,
  checks, calculator, FAQ, the launch-list form (its button takes `--ll-accent-fill`).
- **packetskipper.com**: `globals.css` lost its font stacks (`--ui` now passes through to `--font-sans`),
  the `.site*` header, rail, apps-menu and footer rules, and `.hero*`, `.eyebrow`, `.home-*`,
  `.section-line`, `.price-grid`; `AppsMenu.tsx` is gone; `PublicShell.tsx` is the config plus
  `PublicFrame`, `PublicHeader` (the dev pages) and `AuthCard`. Kept: the packet strip, product preview,
  steps, checks, price card, calculator, FAQ, and the "Opening soon" pre-launch state (now the shell's
  `closedNotice`). Its root layout uses the shell's `themeScript()`; globals.css gained the device-dark
  follow for the agenda paper and Harbor's light/dark pieces, as Coifish has.

## What converting the other two took (done October 30; the plan as written beforehand)

**ReelMinder** (`apps/ReelMinder/site`): add `@longline/web` (a GitHub dependency, since the site builds
on Cloudflare), add it to `transpilePackages` in `site/next.config.ts`, import `tokens.css` and
`shell.css` in `site/app/site.css` (its `layers.css` can take `shell.css` into a layer), replace
`SiteHeader` / `SiteRail` / `SiteFooter` in `site/components/shell.tsx` with `Shell` and a
`ShellConfig` (nav from its `LINKS`, `closedNotice` or Sign in from `WEBSITE.appOpen`, key `theme`),
and swap `themeChoiceScript()` for `themeScript()` in `site/app/layout.tsx`. The page content and
its own CSS stay. Half a day.

**PacketSkipper** (`apps/PacketSkipper`): add `@longline/web` (`file:` or GitHub) and the
`transpilePackages` entry, import the two stylesheets in `src/app/globals.css`, replace `PublicFrame`
/ `PublicHeader` / `PublicFooter` in `src/components/public/PublicShell.tsx` with `Shell`
(`closedNotice: "Opening soon"` while `serverEnv.signupsOpen` is false; `AuthCard` keeps wrapping the
sign-in pages in the shell), and swap `themeBootScript` for `themeScript()` in `src/app/layout.tsx`.
Its `.site-*` CSS classes can then be deleted. Half a day.
