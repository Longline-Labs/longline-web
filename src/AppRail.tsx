import { apps, appsToMark, company, isLive, ownAppHref, type AppKey, type AppsInUse } from "./apps";
import { Mark } from "./marks";

/**
 * The rail: a narrow column at the left of every page, under the header, with one tile per app in longline order,
 * each showing its mark. It is the family's standing advertisement: whichever site you are on, the other apps are
 * in view. Resting, it shows marks only; hovering widens it to show the names. The current app's tile is ringed in
 * its accent; a live app links to its site; an app that isn't live yet shows its mark at full strength with
 * "Coming soon" beneath and is not interactive. Hidden on phones, where the header's switcher does this job.
 *
 * Given `inUse` (the signed-in person's apps, their grants at account.longlinelabs.com) with at least one app besides
 * this one, the person's own apps stay at full strength, say "You use this" and lead to the signed-in app where it has
 * an address; the others go quiet (mark faded, name muted) but remain links to their sites, so the whole family stays
 * reachable. Without it, or when it names only this app, the rail is exactly as above.
 */
export function AppRail({ current, inUse }: { current: AppKey; inUse?: AppsInUse | null }) {
  const marked = appsToMark(inUse, current);
  return (
    <aside className="ll-rail" aria-label={`${company.name} apps`}>
      <ul className="ll-rail-list">
        {apps.map((app) => {
          const here = app.key === current;
          const live = isLive(app);
          const mine = !!marked?.has(app.key);
          const quiet = !!marked && !mine && !here;
          const href = mine && !here ? ownAppHref(app) : app.url;
          const body = (
            <>
              <span className="ll-rail-tile" aria-hidden="true">
                <Mark app={app.key} size={26} />
              </span>
              <span className="ll-rail-text">
                <span className="ll-rail-name">{app.name}</span>
                {here ? <span className="ll-rail-soon">You are here</span> : !live ? <span className="ll-rail-soon">Coming soon</span> : mine && <span className="ll-rail-soon">You use this</span>}
              </span>
            </>
          );
          return (
            <li key={app.key} data-app={app.key} data-in-use={mine && !here ? "" : undefined}>
              {live && href && !here ? (
                <a href={href} className={quiet ? "ll-rail-app ll-rail-quiet" : "ll-rail-app"} title={mine ? `${app.name}: you use this` : app.name}>
                  {body}
                </a>
              ) : (
                <span className="ll-rail-app ll-rail-off" aria-current={here ? "page" : undefined} aria-label={here ? `${app.name}, you are here` : `${app.name}, coming soon`} title={here ? app.name : `${app.name}: coming soon`}>
                  {body}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
