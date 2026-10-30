"use client";

import { useEffect, useRef } from "react";
import { apps, company, type AppKey } from "./apps";
import { LonglineWordmark, Mark } from "./marks";

/**
 * The app switcher: a button in the header that opens the whole family, one row per app with its mark
 * on a tile in the app's accent, its name, its one-line description and a link to its domain. The app
 * whose site this is says "You are here". A <details>, so it works before any script runs; the script
 * only closes it on Escape or a click elsewhere.
 */
export function AppSwitcher({ current, label = "Apps" }: { current: AppKey; label?: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const close = () => el.removeAttribute("open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && el.open && close();
    const onClick = (e: MouseEvent) => el.open && !el.contains(e.target as Node) && close();
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return (
    <details ref={ref} className="ll-switcher">
      <summary className="ll-switcher-button" aria-label={`${company.name} apps`} title={`${company.name} apps`}>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="currentColor">
          <circle cx="4" cy="4" r="2" />
          <circle cx="10" cy="4" r="2" />
          <circle cx="16" cy="4" r="2" />
          <circle cx="4" cy="10" r="2" />
          <circle cx="10" cy="10" r="2" />
          <circle cx="16" cy="10" r="2" />
          <circle cx="4" cy="16" r="2" />
          <circle cx="10" cy="16" r="2" />
          <circle cx="16" cy="16" r="2" />
        </svg>
        <span className="ll-switcher-label">{label}</span>
      </summary>
      <div className="ll-switcher-panel">
        <p className="ll-switcher-title">
          <LonglineWordmark size={22} name={company.name} />
        </p>
        <p className="ll-switcher-line">{company.familyLine}</p>
        <ul className="ll-switcher-list">
          {apps.map((app) => {
            const here = app.key === current;
            const body = (
              <>
                <span className="ll-switcher-tile" aria-hidden="true">
                  <Mark app={app.key} size={26} />
                </span>
                <span className="ll-switcher-text">
                  <span className="ll-switcher-name">
                    {app.name}
                    {here && <span className="ll-switcher-here">You are here</span>}
                    {!app.live && !here && <span className="ll-switcher-here">Coming soon</span>}
                  </span>
                  <span className="ll-switcher-desc">{app.description}</span>
                  <span className="ll-switcher-domain">{app.domain}</span>
                </span>
              </>
            );
            return (
              <li key={app.key} data-app={app.key}>
                {app.live ? (
                  <a href={app.url} className="ll-switcher-app" aria-current={here ? "page" : undefined}>
                    {body}
                  </a>
                ) : (
                  <span className="ll-switcher-app ll-switcher-off">{body}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
