import type { ReactNode } from "react";
import { appByKey, company } from "./apps";
import { AppSwitcher } from "./AppSwitcher";
import { LonglineMark, Mark } from "./marks";
import { ThemeToggle } from "./ThemeToggle";
import type { LinkComponent, ShellConfig, ShellLink } from "./types";

const A: LinkComponent = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>
    {children}
  </a>
);

function NavLink({ link, Link, className }: { link: ShellLink; Link: LinkComponent; className: string }) {
  return (
    <Link href={link.href} className={className} aria-current={link.current ? "page" : undefined}>
      {link.label}
    </Link>
  );
}

/**
 * The header every site shares. Left: the Longline Labs mark beside this app's mark and wordmark, as one
 * link home. Middle: the nav links. Right: the light/dark switch, Sign in, the one primary button, and
 * the app switcher. A 3px stripe in the app's accent runs along the top; the accent appears nowhere
 * else in the bar except the active nav item and link hover. Where the rail is showing (desktop), the switcher is
 * hidden as redundant (Brandon, October 30); on phones, where the rail is hidden, it stays.
 */
export function Header({ config, children }: { config: ShellConfig; children?: ReactNode }) {
  const app = appByKey(config.app);
  const name = config.name ?? app.name;
  const Link = config.Link ?? A;
  const actions = config.closedNotice ? (
    <span className="ll-closed">{config.closedNotice}</span>
  ) : (
    <>
      {config.signIn && <NavLink link={config.signIn} Link={Link} className="ll-link ll-signin" />}
      {config.cta && <NavLink link={config.cta} Link={Link} className="ll-btn ll-btn-primary ll-cta" />}
    </>
  );
  return (
    <header className={config.rail !== false ? "ll-header ll-header-with-rail" : "ll-header"}>
      <div className="ll-container ll-header-row">
        <Link href={config.homeHref ?? "/"} className="ll-brand" title={`${name} home`}>
          <LonglineMark size={26} className="ll-brand-company" />
          <span className="ll-brand-divider" aria-hidden="true" />
          <Mark app={app.key} size={28} className="ll-brand-mark" />
          <span className="ll-wordmark">{name}</span>
          <span className="ll-sr">, by {company.name}</span>
        </Link>
        <nav className="ll-nav" aria-label="Main">
          {config.nav.map((link) => (
            <NavLink key={link.href} link={link} Link={Link} className="ll-link ll-nav-link" />
          ))}
        </nav>
        <div className="ll-actions">
          {children}
          <ThemeToggle storageKey={config.themeStorageKey} />
          {actions}
          {config.switcher !== false && <AppSwitcher current={app.key} />}
          {config.nav.length > 0 && (
            <details className="ll-menu">
              <summary className="ll-menu-button" aria-label="Menu">
                <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                  <path d="M3 5h14M3 10h14M3 15h14" />
                </svg>
              </summary>
              <nav className="ll-menu-panel" aria-label="Main">
                {config.nav.map((link) => (
                  <NavLink key={link.href} link={link} Link={Link} className="ll-menu-link" />
                ))}
                {!config.closedNotice && config.signIn && <NavLink link={config.signIn} Link={Link} className="ll-menu-link" />}
                {!config.closedNotice && config.cta && <NavLink link={config.cta} Link={Link} className="ll-btn ll-btn-primary ll-menu-cta" />}
              </nav>
            </details>
          )}
        </div>
      </div>
    </header>
  );
}
