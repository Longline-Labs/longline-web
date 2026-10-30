# Changelog

## 0.4.2 — 2026-10-30

- The Linked LL in the header is drawn in the mark ink (teal by day, cream by night) at 28px, the same as the app
  mark beside it; it had been muted grey and 26px, which read as off (Brandon).

## 0.4.1 — 2026-10-30

- The header's Apps switcher is hidden where the rail is showing (900px and up), since the rail lists the same apps;
  it stays on phones, where the rail is hidden.

## 0.4.0 — 2026-10-30

- **The rail is back** (`AppRail`, on by default in `Shell`): the apps' marks down the left of every page under
  the header, as coifish.com had before the shell, now with all six in longline order; hover shows the names.
  Brandon: "good advertising for the other apps". `rail: false` leaves it out; hidden on phones.

## 0.3.3 — 2026-10-30

- Descriptions for BallastBook, ShipShape and Aboveboard, as Brandon wrote them. No placeholders remain.

## 0.3.2 — 2026-10-30

- **The final approved package** (`brand/longline-labs-approved-brand-package`) is the source of truth. Marks are
  unchanged (byte-identical). The supporting illustration is its new design: a straight mainline, six equal drops
  and the six actual app marks beneath, drawn in `LonglineIllustration` from the same marks the header uses, at
  360px in `FamilySection` (the whole column on a phone). The first three apps' `illustration` colours are their
  day accents now, as palette.json has them; stripes and buttons are untouched.

## 0.3.1 — 2026-10-30

- Domains for BallastBook (ballastbook.com) and Aboveboard (aboveboarddocs.com), recorded for when they go live; still
  unlinked while coming soon. Only the three new apps' descriptions remain open.

## 0.3.0 — 2026-10-30

- **The approved brand package** (`brand/longline-labs-complete-brand-package`): the Linked LL is the company
  mark in the header, the switcher's title and the footer; the draft and placeholder marks are gone. The six
  app marks are the package's SVGs exactly, with the accent stroke following palette.json's dark-mark colour.
- **Six apps** in `apps.json`, in longline order: BallastBook (cobalt), ShipShape (plum; key and files
  `shipshapefiles`) and Aboveboard (azure) join. Each has a `status` (only Coifish is `live`; the rest are
  `coming-soon`, shown unlinked with the label) and a `switcher` flag. Domains for BallastBook and Aboveboard
  and the three new descriptions are placeholders (null).
- **Accents** carry `mark` and `illustration` colours per mode besides the UI roles; the contrast check covers
  all six in both modes (142 pairings) and reports the brand assets' ratios without failing on them. Azure's
  text and button by day are #2d6e93, a deeper step not in the package.
- **`FamilySection`**: the six-colour longline (`LonglineIllustration`) beside the heading, then a card per app.
  Replaces each site's own family section.

## 0.2.0 — 2026-10-30

- **Type and layout parity.** The type scale (`type` in tokens.json: display-xl, display-md, title,
  heading, body-lg, body, body-sm, label, numeral) and the page frame (`layout`: content width, gutter,
  header height, section rhythm, hero and pricing grids) are tokens, out as `--ll-*` variables with phone
  values under 768px, and as classes in shell.css (`ll-h1`, `ll-h2`, `ll-hero`, `ll-section`,
  `ll-pricing-grid` and the rest). Sites inherit them and define none of their own.
- `scripts/check-sites.mjs` (`npm run check:sites`, in `npm test`): fails if a site listed in
  `sites.json` overrides a shell type or layout variable, restyles an `ll-` class or names a font by hand.
- **The Longline Labs mark is a draft** from Brandon's description (double L over a longline with rust, brass
  and kelp dots), in the header, the switcher's title and the footer; `LonglineWordmark` is the lockup.
  `logos/longline-mark-draft*.svg` replace the placeholder files.
- **The entity is LONGLINE LABS LLC** (`company.legalName`); `ShellConfig.legalName` is gone, so no site
  can say otherwise. `ShellConfig.switcher: false` hides the app switcher on a page.
- reelminders.com and packetskipper.com consume the shell (their `longline-shell` branches).

## 0.1.0 — 2026-10-30

- First version. Tokens (Harbor's palette, with per-app accent roles and `status-info`), generated
  `tokens.css` with light, dark, device-dark and print; `shell.css`; `Shell`, `Header`, `AppSwitcher`,
  `Footer`, `ThemeToggle`, the marks and `themeScript()`; the contrast check; `NOTES.md` on the three
  sites as found.
- Accents, as Brandon decided on October 30: Coifish `koi` (rust), ReelMinder `brass`, PacketSkipper `kelp`;
  teal stays the family colour and is kept as an accent for a site with none of its own.
- The accent variables are `--ll-accent*`: the sites' own `--accent` (the family teal) is untouched inside the shell.
- The Longline Labs mark is a placeholder (Harbor's ring and dot) until the real one exists.
