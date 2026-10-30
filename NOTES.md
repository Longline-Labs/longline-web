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

## Decision taken here, and the one to confirm

The brief for this package puts the accent on the primary button, the active nav item and link hover,
the favicon, the switcher tile and a stripe in the top bar, and says Coifish keeps its teal. So
`apps.json` records Coifish's accent as **`teal`** (Harbor's `sea`), which keeps coifish.com looking
exactly as it does today, and ReelMinder as `brass` and PacketSkipper as `kelp` (their buttons will
turn from teal to their own colour when their sites move onto this shell). Harbor's `koi` is kept in
`tokens/tokens.json` as a ready accent: if Brandon would rather Coifish's buttons go rust to match its
fish, change `"accent": "teal"` to `"koi"` for Coifish in `apps.json`, run `npm test`, and nothing else.

## Logos

No Longline Labs logo exists anywhere (the brand folder has only the three app marks and Coifish's
Stripe branding; `legal/` has the Articles of Amendment renaming COIFISH LLC to Longline Labs). The
`LonglineMark` here and `logos/longline-mark-placeholder*.svg` are Harbor's company ring-and-dot as a
stand-in. The three app marks are the approved Option 2 files, copied byte for byte into `logos/`.

## What converting the other two will take

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
