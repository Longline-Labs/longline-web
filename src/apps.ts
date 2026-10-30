import family from "../apps.json";

export type AppKey = "coifish" | "reelminder" | "packetskipper";
export type AccentKey = "teal" | "koi" | "brass" | "kelp";

export interface FamilyApp {
  key: AppKey;
  name: string;
  /** The marketing site's host, as people type it: "coifish.com". */
  domain: string;
  url: string;
  /** Where the signed-in app lives. */
  appUrl: string;
  accent: AccentKey;
  /** Whether the site is up. An app that isn't shows in the switcher without a link. */
  live: boolean;
  description: string;
}

export interface Company {
  /** The brand beside every wordmark. */
  name: string;
  /** What the copyright line says. */
  legalName: string;
  familyLine: string;
}

export const company: Company = { name: family.company.name, legalName: family.company.legalName, familyLine: family.company.familyLine };
/** The three apps, in the fixed order the switcher shows them. */
export const apps: readonly FamilyApp[] = family.apps as FamilyApp[];

export function appByKey(key: AppKey): FamilyApp {
  const app = apps.find((a) => a.key === key);
  if (!app) throw new Error(`@longline/web: no app named "${key}" in apps.json`);
  return app;
}
