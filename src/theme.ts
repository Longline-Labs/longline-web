/** Where a page remembers the light/dark choice unless the app names its own place. */
export const DEFAULT_THEME_KEY = "theme";

/** The custom event every ThemeToggle on the page listens for. */
export const THEME_CHANGED_EVENT = "ll-theme-changed";

export type Theme = "light" | "dark";

/** A stored choice, if it is one we understand. */
export const readTheme = (value: unknown): Theme | null => (value === "light" || value === "dark" ? value : null);

/** The mode in use: the person's own choice if they made one, otherwise the device's. */
export const themeInUse = (chosen: unknown, deviceIsDark: boolean): Theme => readTheme(chosen) ?? (deviceIsDark ? "dark" : "light");

/**
 * The inline <script> for the root layout's <head>. It applies a remembered choice as data-theme on
 * <html> before the first paint, and nothing else: with no choice stored it leaves the device's
 * setting to tokens.css. Render with dangerouslySetInnerHTML, or write it into a <script> tag by hand.
 */
export function themeScript(storageKey = DEFAULT_THEME_KEY): string {
  return `try{var t=localStorage.getItem(${JSON.stringify(storageKey)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
}
