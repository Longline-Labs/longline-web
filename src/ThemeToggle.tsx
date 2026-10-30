"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME_KEY, readTheme, THEME_CHANGED_EVENT, themeInUse, type Theme } from "./theme";

function subscribe(onChange: () => void) {
  const device = window.matchMedia("(prefers-color-scheme: dark)");
  device.addEventListener("change", onChange);
  window.addEventListener(THEME_CHANGED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    device.removeEventListener("change", onChange);
    window.removeEventListener(THEME_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const inUse = (): Theme => themeInUse(document.documentElement.getAttribute("data-theme"), window.matchMedia("(prefers-color-scheme: dark)").matches);

/**
 * The light/dark switch. The site follows the device until this is used; after that, this browser
 * remembers the choice under `storageKey`. Announced to screen readers as a switch named "Dark mode".
 */
export function ThemeToggle({ storageKey = DEFAULT_THEME_KEY, className = "" }: { storageKey?: string; className?: string }) {
  // Unknown while the page is built on the server; the switch appears once the browser has it.
  const theme = useSyncExternalStore<Theme | null>(subscribe, inUse, () => null);
  const dark = theme === "dark";

  function choose(next: Theme) {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // A browser that won't remember still switches for this visit.
    }
    window.dispatchEvent(new Event(THEME_CHANGED_EVENT));
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => choose(readTheme(theme) === "dark" ? "light" : "dark")}
      className={`ll-theme${theme ? "" : " ll-theme-unknown"}${className ? ` ${className}` : ""}`}
    >
      <span className="ll-theme-track">
        <span className="ll-theme-knob">
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            {dark ? (
              <path d="M13 9.6A5.6 5.6 0 0 1 6.4 3a5.6 5.6 0 1 0 6.6 6.6Z" fill="currentColor" stroke="none" />
            ) : (
              <>
                <circle cx="8" cy="8" r="2.8" fill="currentColor" stroke="none" />
                <path d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M3.2 12.8l1.1-1.1M11.7 4.3l1.1-1.1" />
              </>
            )}
          </svg>
        </span>
      </span>
    </button>
  );
}
