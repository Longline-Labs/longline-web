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
  /** Where the signed-in app lives, where there is one. */
  appUrl: string | null;
  accent: AccentKey;
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
}

export const company: Company = { name: family.company.name, legalName: family.company.legalName, familyLine: family.company.familyLine };
/** The six apps, in the fixed order of the longline. */
export const apps: readonly FamilyApp[] = family.apps as FamilyApp[];
/** The apps the header's switcher lists. */
export const switcherApps: readonly FamilyApp[] = apps.filter((a) => a.switcher);

export const isLive = (app: FamilyApp): boolean => app.status === "live";

export function appByKey(key: AppKey): FamilyApp {
  const app = apps.find((a) => a.key === key);
  if (!app) throw new Error(`@longline/web: no app named "${key}" in apps.json`);
  return app;
}
