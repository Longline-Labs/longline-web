import family from "../apps.json";

export type AppKey = "coifish" | "reelminder" | "packetskipper" | "ballastbook" | "shipshapefiles" | "aboveboard";
export type AccentKey = "teal" | "koi" | "brass" | "kelp" | "cobalt" | "plum" | "azure";
/** "live": the site is up and is linked. "coming-soon": shown with its mark and accent, labelled, not linked. */
export type AppStatus = "live" | "coming-soon";

export interface FamilyApp {
  key: AppKey;
  /** The product name as spelled in prose (ShipShape; shipshapefiles.com is only its domain). */
  name: string;
  /** The marketing site's host, or null where none has been decided yet. */
  domain: string | null;
  url: string | null;
  /** Where the signed-in app lives, where there is one (packetskipper.com is both its site and its app). */
  appUrl: string | null;
  accent: AccentKey;
  /** The filled buttons on the app's own site only, where they differ from `accent` (reelminders.com: teal). */
  buttonAccent?: AccentKey;
  status: AppStatus;
  /** Whether the header's switcher lists the app. */
  switcher: boolean;
  /** One line under the name, or null until written. */
  description: string | null;
}

export interface Company {
  name: string;
  legalName: string;
  familyLine: string;
  /** The company site, https://longlinelabs.com/: where the Linked LL in every header leads. */
  url: string;
}

export const company: Company = { name: family.company.name, legalName: family.company.legalName, familyLine: family.company.familyLine, url: family.company.url };
/** The six apps, in the fixed order of the longline. */
export const apps: readonly FamilyApp[] = family.apps as FamilyApp[];
/** The apps the header's switcher lists. */
export const switcherApps: readonly FamilyApp[] = apps.filter((a) => a.switcher);

export const isLive = (app: FamilyApp): boolean => app.status === "live";

/** The apps a signed-in person uses, as keys: their grants at account.longlinelabs.com, read by the app's own server. */
export type AppsInUse = readonly AppKey[];

/**
 * The person's apps when the list has something to show: at least one app besides the one they are in. A person who
 * uses only this app, nobody signed in, or a list that couldn't be read (null or undefined): null, and the rail and the
 * switcher show the whole family exactly as they always have.
 */
export function appsToMark(inUse: AppsInUse | null | undefined, current: AppKey): ReadonlySet<AppKey> | null {
  if (!inUse) return null;
  const known = new Set(inUse.filter((k) => apps.some((a) => a.key === k)));
  return [...known].some((k) => k !== current) ? known : null;
}

/** Where one of the person's own apps leads: the signed-in app where it has an address, else its site. */
export const ownAppHref = (app: FamilyApp): string | null => app.appUrl ?? app.url;

export function appByKey(key: AppKey): FamilyApp {
  const app = apps.find((a) => a.key === key);
  if (!app) throw new Error(`@longline/web: no app named "${key}" in apps.json`);
  return app;
}
