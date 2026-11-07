import { apps, company, isLive, type AppKey } from "./apps";
import { LonglineIllustration, Mark } from "./marks";

/**
 * "Apps for community association managers": the six-colour longline beside the heading, then one card per app in
 * apps.json order with its mark, name and line. The current app's card says "You are here"; a live app's links to
 * its site; the rest say "Coming soon" and are not links. This is where the supporting illustration lives; it is
 * never the header's mark.
 */
export function FamilySection({ current, title = "Apps for community association managers", line = company.familyLine }: { current: AppKey; title?: string; line?: string }) {
  return (
    <section className="ll-container ll-section ll-section-rule ll-family" aria-labelledby="ll-family-title">
      <div className="ll-family-head">
        <div>
          <h2 id="ll-family-title" className="ll-h2">
            {title}
          </h2>
          <p className="ll-section-line">{line}</p>
        </div>
        <LonglineIllustration className="ll-family-illustration" />
      </div>
      <ul className="ll-family-cards">
        {apps.map((app) => {
          const here = app.key === current;
          const live = isLive(app);
          return (
            <li key={app.key} data-app={app.key} className="ll-family-card">
              <div className="ll-family-name">
                <Mark app={app.key} size={32} />
                <span>{app.name}</span>
              </div>
              {app.description && <p className="ll-family-desc">{app.description}</p>}
              <p className="ll-label ll-family-status">
                {here ? "You are here" : live && app.url ? <a href={app.url}>Visit {app.domain}</a> : "Coming soon"}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
