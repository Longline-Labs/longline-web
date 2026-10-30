import type { ComponentType, ReactNode } from "react";
import type { AppKey } from "./apps";

export interface ShellLink {
  label: string;
  href: string;
  /** Marks the nav item for the page the visitor is on (drawn in the accent). */
  current?: boolean;
}

/**
 * The component used for links inside the site, so a Next site can pass next/link. Defaults to <a>.
 * Links to another app's domain are always plain <a>.
 */
export type LinkComponent = ComponentType<{ href: string; className?: string; children: ReactNode; "aria-current"?: "page"; title?: string }>;

export interface ShellConfig {
  /** Which app this site is. Picks the wordmark, the accent and the "You are here" in the switcher from apps.json. */
  app: AppKey;
  /** Overrides apps.json's name, for a working name. */
  name?: string;
  /** Where the brand lockup leads. Default "/". */
  homeHref?: string;
  /** The header's links, left to right. On phones they move into the menu. */
  nav: ShellLink[];
  /** The quiet "Sign in" link. Omit (or null) before an app opens. */
  signIn?: ShellLink | null;
  /** The one primary button in the header. Omit (or null) before an app opens. */
  cta?: ShellLink | null;
  /** Something to show in place of Sign in and the button before an app opens, such as "Opening soon". */
  closedNotice?: ReactNode;
  /** The footer's links after the copyright line: Help, Terms of Service, Privacy Policy. */
  footerLinks?: ShellLink[];
  /** The footer's right-hand secondary button; defaults to `signIn`. Pass null for none. */
  footerAction?: ShellLink | null;
  /** Show the app switcher in the header. Default true; false for a page a board member or vendor lands on. */
  switcher?: boolean;
  /** Where the browser remembers the light/dark choice. Default "theme". Coifish keeps its old "coifish-theme". */
  themeStorageKey?: string;
  Link?: LinkComponent;
}
