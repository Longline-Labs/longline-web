# Changelog

## 0.5.3 — 2026-11-07

Website copy review, November 7, 2026 (`research/copy-review-2026-11-07/REPORT.md`); Brandon took every suggestion
("take all suggestions"). Every site showing the family cards takes these when its pin moves.

- **Sentence case for common nouns** (J1): the family section's heading is "Apps for community association managers",
  and the cards say association, board, annual budget and governing documents in lowercase, as every app's own site
  does.
- **The family line no longer repeats the heading** (J2): `company.familyLine`, under the heading and in the header's
  switcher, is "Six small apps from Longline Labs, each built to work the same way."
- **Three cards say what the app does** (J3): ShipShape "Renames every file to your company's own naming convention,
  so documents are always easy to find." (it asks and never guesses, so not "Automatically"); AboveBoard "One public
  page for each association's governing documents, minutes, and records." (its site calls it a public page, and the
  manager posts); BallastBook "A simple annual budget builder for each of your associations."
- A serial comma in AboveBoard's card ("minutes, and records").

## 0.5.2 — 2026-11-06

- **apps.json, PacketSkipper's `description`** now reads "Builds Board meeting packets, records the meeting and its
  action items, and drafts the minutes." It used to promise that PacketSkipper "tracks action items until you check
  them off", which it doesn't: action items are recorded in meeting mode and listed in the minutes (and can be sent to
  ReelMinder). First-user review, PACKETSKIPPER-F04; Brandon chose the new wording on November 6, 2026. Every site
  showing the family cards takes it when its pin moves.

## 0.5.1 — 2026-11-06

- **apps.json, `appUrl`**: every app now has its signed-in address, for a person's own apps in the rail and the
  switcher: PacketSkipper's is packetskipper.com (its site and its app are one; app.packetskipper.com never existed),
  and BallastBook, ShipShape and AboveBoard went live on November 6 at app.ballastbook.com, app.shipshapefiles.com and
  app.aboveboarddocs.com. Nothing changes for a visitor who isn't signed in.
- **apps.json, `buttonAccent`**: an app's site may take another accent for its filled buttons. ReelMinder's is `teal`,
  the founder's sea blue of October 31, which reelminders.com used to set in its own `site.css` (and which
  `check:sites` refused). tokens.css now draws it as `.ll-shell[data-app="reelminder"]`, exactly the rule the site had,
  so reelminders.com looks the same and `npm test` passes. `check:contrast` checks that fill and its label too.

## 0.5.0 — 2026-11-03

- The rail and the switcher can show which apps the signed-in person uses (single sign-in plan, step 9). `AppRail`
  and `AppSwitcher` take `inUse`, the person's apps as keys (their grants at account.longlinelabs.com, which the app's
  own server reads from the account site's `/api/apps-in-use`); `ShellConfig.inUse` passes it through `Shell`. With at
  least one app besides the current one in the list, the person's own apps stay at full strength and lead to the
  signed-in app (`appUrl`) where it has one, else to its site; the others go quiet (`ll-rail-quiet`,
  `ll-switcher-quiet`: mark at 45% and greyscale, name muted) but stay links, so the whole family remains reachable.
  No label says which is which: the fade alone tells (Brandon, November 4, 2026; a first draft said "You use this"
  under the name). A used app's `<li>` carries `data-in-use`. Without the list, with a list that couldn't be read
  (null), or when the person uses only this app, nothing changes: the family shows exactly as before. `appsToMark` and
  `ownAppHref` are exported for a site drawing its own rail (Coifish's Dock).

## 0.4.12 — 2026-11-03

- AboveBoard is `live` in `apps.json`: its website is up (aboveboarddocs.com since November 3), so the rail, the
  switcher, the family cards and Coifish's Dock link to it (Brandon). All six apps are now live. The app itself is
  still closed to sign-ups; that is the site's own business.

## 0.4.11 — 2026-11-03

- BallastBook and ShipShape are `live` in `apps.json`: their websites are up (ballastbook.com since October 31,
  shipshapefiles.com since November 3), so the rail, the switcher, the family cards and Coifish's Dock link to them
  (Brandon). The apps themselves are still closed to sign-ups; that is each site's own business.

## 0.4.10 — 2026-10-30

- The sixth app's name is AboveBoard, capital B, in `apps.json` and everywhere a site shows it (Brandon). The key
  (`aboveboard`), the mark's export (`AboveboardMark`) and the domain (aboveboarddocs.com) are unchanged.

## 0.4.9 — 2026-10-30

- ReelMinder and PacketSkipper are `live` in `apps.json`: their websites are up (reelminders.com since October 25,
  packetskipper.com since October 25), so the rail, the switcher, the family cards and Coifish's Dock link to them
  (Brandon). The apps themselves are still closed to sign-ups; that is each site's own business.

## 0.4.8 — 2026-10-30

- The Linked LL leads to longlinelabs.com on every site (Brandon): the corner cell on desktop, and on phones the mark
  beside the wordmark, now its own link (`ll-brand-company`) inside a new `ll-brand-group` wrapper, with the app's
  mark and wordmark staying the link home. `company.url` in `apps.json` holds the address.

## 0.4.7 — 2026-10-30

- The header's corner cell is 56px including its border, the rail's width. It was 57px, so the vertical hairline
  jogged one pixel where the header met the rail (Brandon).

## 0.4.6 — 2026-10-30

- Family section: every card is the same height. The grid's rows were each sized to their own tallest card, so with
  the longer 0.4.5 descriptions the second row came out shorter than the first (Brandon). `grid-auto-rows: 1fr`.

## 0.4.5 — 2026-10-30

- The six app descriptions in `apps.json` rewritten as Brandon gave them on October 30, 2026: a sentence or two each on
  what the app does for a community manager. They show on longlinelabs.com's cards, in every family section and in
  the header switcher.

## 0.4.4 — 2026-10-30

- On desktop the Linked LL sits in its own 56px corner cell at the far left of the header, directly above the rail,
  and the app's lockup starts where the page column starts (Brandon). On phones it stays beside the wordmark.
- 0.4.3 was tagged with the header markup for this but without its styles; use 0.4.4.

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
