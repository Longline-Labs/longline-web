# Changelog

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
