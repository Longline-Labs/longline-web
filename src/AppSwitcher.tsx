"use client";

import { useEffect, useRef } from "react";
import { appsToMark, company, isLive, ownAppHref, switcherApps, type AppKey, type AppsInUse } from "./apps";
import { LonglineWordmark, Mark } from "./marks";

/**
 * The app switcher: a button in the header that opens the family, one row per app (apps.json order) with its mark
 * on a tile ringed in the app's accent, its name and its line. A live app links to its domain; an app that isn't
 * live yet is a plain entry labelled "Coming soon", with that in its accessible name, and is not interactive. The
 * app whose site this is says "You are here". A <details>, so it works before any script runs; the script only
 * closes it on Escape or a click elsewhere.
 *
 * Given `inUse` (the signed-in person's apps) with at least one app besides this one, the person's own apps say
 * "You use this" and lead to the signed-in app where it has an address; the others go quiet but stay links.
 */
export function AppSwitcher({ current, inUse, label = "Apps" }: { current: AppKey; inUse?: AppsInUse | null; label?: string }) {
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
  const marked = appsToMark(inUse, current);
  return (
    <details ref={ref} className="ll-switcher">
      <summary className="ll-switcher-button" aria-label={`${company.name} apps`} title={`${company.name} apps`}>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="currentColor">
          {[4, 10, 16].flatMap((y) => [4, 10, 16].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" />))}
        </svg>
        <span className="ll-switcher-label">{label}</span>
      </summary>
      <div className="ll-switcher-panel">
        <p className="ll-switcher-title">
          <LonglineWordmark size={22} name={company.name} />
        </p>
        <p className="ll-switcher-line">{company.familyLine}</p>
        <ul className="ll-switcher-list">
          {switcherApps.map((app) => {
            const here = app.key === current;
            const live = isLive(app);
            const mine = !!marked?.has(app.key);
            const quiet = !!marked && !mine && !here;
            const href = mine && !here ? ownAppHref(app) : app.url;
            const body = (
              <>
                <span className="ll-switcher-tile" aria-hidden="true">
                  <Mark app={app.key} size={26} />
                </span>
                <span className="ll-switcher-text">
                  <span className="ll-switcher-name">
                    {app.name}
                    {here ? <span className="ll-switcher-here">You are here</span> : !live ? <span className="ll-switcher-here">Coming soon</span> : mine && <span className="ll-switcher-here">You use this</span>}
                  </span>
                  {app.description && <span className="ll-switcher-desc">{app.description}</span>}
                  {live && app.domain && <span className="ll-switcher-domain">{app.domain}</span>}
                </span>
              </>
            );
            return (
              <li key={app.key} data-app={app.key} data-in-use={mine && !here ? "" : undefined}>
                {live && href ? (
                  <a href={href} className={quiet ? "ll-switcher-app ll-switcher-quiet" : "ll-switcher-app"} aria-current={here ? "page" : undefined}>
                    {body}
                  </a>
                ) : (
                  <span className="ll-switcher-app ll-switcher-off" aria-label={here ? `${app.name}, you are here` : `${app.name}, coming soon`} aria-current={here ? "page" : undefined}>
                    {body}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
