import { company } from "./apps";
import { LonglineMark } from "./marks";
import type { LinkComponent, ShellConfig } from "./types";

const A: LinkComponent = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>
    {children}
  </a>
);

/** The footer every site shares: the copyright line with the Longline Labs mark, the links, and a secondary button at the right. */
export function Footer({ config, year = new Date().getFullYear() }: { config: ShellConfig; year?: number }) {
  const Link = config.Link ?? A;
  const action = config.footerAction === undefined ? config.signIn : config.footerAction;
  return (
    <footer className="ll-footer">
      <div className="ll-container ll-footer-row">
        <span className="ll-footer-company">
          <LonglineMark size={18} />
          <span>
            © {year} {config.legalName ?? company.legalName}
          </span>
        </span>
        {(config.footerLinks ?? []).map((link) => (
          <Link key={link.href} href={link.href} className="ll-footer-link">
            {link.label}
          </Link>
        ))}
        {action && !config.closedNotice && (
          <Link href={action.href} className="ll-btn ll-btn-secondary ll-footer-action">
            {action.label}
          </Link>
        )}
      </div>
    </footer>
  );
}
