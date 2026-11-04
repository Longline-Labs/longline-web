import type { ReactNode } from "react";
import { AppRail } from "./AppRail";
import { Footer } from "./Footer";
import { Header } from "./Header";
import type { ShellConfig } from "./types";

/**
 * The page layout: the header, then the rail of all the apps down the left with the page's own content and the
 * footer beside it (the rail is hidden on phones, and left out with `rail: false`). `data-app` on the wrapper gives
 * everything inside the app's accent (tokens.css); a site may also put data-app on <html> so pages outside the
 * shell share it. Pages put their own <main> inside, or pass `main` to get one.
 */
export function Shell({ config, children, main = true, headerExtra }: { config: ShellConfig; children: ReactNode; /** Wrap children in <main id="ll-main">. Default true. */ main?: boolean; headerExtra?: ReactNode }) {
  return (
    <div className="ll-shell" data-app={config.app}>
      <a href="#ll-main" className="ll-skip">
        Skip to the page
      </a>
      <Header config={config}>{headerExtra}</Header>
      <div className="ll-body">
        {config.rail !== false && <AppRail current={config.app} inUse={config.inUse} />}
        <div className="ll-column">
          {main ? (
            <main id="ll-main" className="ll-main" tabIndex={-1}>
              {children}
            </main>
          ) : (
            children
          )}
          <Footer config={config} />
        </div>
      </div>
    </div>
  );
}
