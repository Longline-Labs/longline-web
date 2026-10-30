import { apps, company, isLive, type AppKey } from "./apps";
import { Mark } from "./marks";

/**
 * The rail: a narrow column at the left of every page, under the header, with one tile per app in longline order,
 * each showing its mark. It is the family's standing advertisement: whichever site you are on, the other apps are
 * in view. Resting, it shows marks only; hovering widens it to show the names. The current app's tile is ringed in
 * its accent; a live app links to its site; an app that isn't live yet shows its mark at full strength with
 * "Coming soon" beneath and is not interactive. Hidden on phones, where the header's switcher does this job.
 */
export function AppRail({ current }: { current: AppKey }) {
  return (
    <aside className="ll-rail" aria-label={`${company.name} apps`}>
      <ul className="ll-rail-list">
        {apps.map((app) => {
          const here = app.key === current;
          const live = isLive(app);
          const body = (
            <>
              <span className="ll-rail-tile" aria-hidden="true">
                <Mark app={app.key} size={26} />
              </span>
              <span className="ll-rail-text">
                <span className="ll-rail-name">{app.name}</span>
                {here ? <span className="ll-rail-soon">You are here</span> : !live && <span className="ll-rail-soon">Coming soon</span>}
              </span>
            </>
          );
          return (
            <li key={app.key} data-app={app.key}>
              {live && app.url && !here ? (
                <a href={app.url} className="ll-rail-app" title={app.name}>
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
