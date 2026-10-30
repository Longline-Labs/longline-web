import type { ReactElement } from "react";
import type { AccentKey, AppKey } from "./apps";

/*
 * The approved marks (brand/longline-labs-approved-brand-package, the final package of October 30, 2026), as inline SVG with the files'
 * geometry exactly. Two colours vary by theme and come from tokens.css: the supporting strokes are `currentColor`
 * (--mark-ink: teal by day, cream by night, as the -dark files have them) and the accent strokes are the app's
 * --ll-accent-<key>-mark (its palette.json dark_mark_accent at night: the first three keep their day colour, the
 * newer three take the night value). So one element follows light and dark with nothing to swap. The SVG files
 * themselves are in logos/ for sites that would rather use <img>, and are the base for favicons.
 */

type Props = { size?: number; title?: string; className?: string; /** Position inside a parent SVG (the illustration). */ x?: number; y?: number };

const svgProps = (size: number, title: string | undefined, className: string | undefined, x?: number, y?: number) => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 48 48",
  width: size,
  height: size,
  x,
  y,
  className: className ? `ll-mark ${className}` : "ll-mark",
  role: title ? ("img" as const) : undefined,
  "aria-label": title,
  "aria-hidden": title ? undefined : true,
  focusable: "false" as const,
});

const stroke = { fill: "none", strokeWidth: 3.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const accentOf = (key: AccentKey) => `var(--ll-accent-${key}-mark)`;

export function CoifishMark({ size = 28, title, className, x, y }: Props) {
  const a = accentOf("koi");
  return (
    <svg {...svgProps(size, title, className, x, y)}>
      <path d="M15 24 Q27 8 40 24 Q27 40 15 24" stroke={a} {...stroke} />
      <path d="M15 24 L6 16 L6 32 Z" stroke="currentColor" {...stroke} />
      <circle cx="32" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function ReelMinderMark({ size = 28, title, className, x, y }: Props) {
  const a = accentOf("brass");
  return (
    <svg {...svgProps(size, title, className, x, y)}>
      <circle cx="21" cy="27" r="12" fill="none" stroke={a} strokeWidth="3.4" />
      <circle cx="21" cy="27" r="3" fill={a} />
      <path d="M21 27 L36 17" stroke="currentColor" {...stroke} />
      <circle cx="37" cy="16" r="3" fill="currentColor" />
      <path d="M21 15 V9 M15 9 H27" stroke="currentColor" {...stroke} strokeWidth={3} />
    </svg>
  );
}

export function PacketSkipperMark({ size = 28, title, className, x, y }: Props) {
  const a = accentOf("kelp");
  return (
    <svg {...svgProps(size, title, className, x, y)}>
      <path d="M7 25 Q8 12 24 12 Q40 12 41 25 Z" stroke={a} {...stroke} />
      <path d="M11 25 V30 Q24 40 37 30 V25 M11 26 H37" stroke="currentColor" {...stroke} />
      <circle cx="24" cy="19" r="2" fill={a} />
    </svg>
  );
}

/** BallastBook: a book and a keel. */
export function BallastBookMark({ size = 28, title, className, x, y }: Props) {
  return (
    <svg {...svgProps(size, title, className, x, y)}>
      <path d="M24 13 Q16 8 6 11 V33 Q16 30 24 35 Q32 30 42 33 V11 Q32 8 24 13" stroke={accentOf("cobalt")} {...stroke} />
      <path d="M24 13 V40 M20 40 H28" stroke="currentColor" {...stroke} />
    </svg>
  );
}

/** ShipShape: a name tag. */
export function ShipShapeMark({ size = 28, title, className, x, y }: Props) {
  const a = accentOf("plum");
  return (
    <svg {...svgProps(size, title, className, x, y)}>
      <path d="M12 19 L24 9 L36 19 V39 H12 Z" stroke={a} {...stroke} />
      <path d="M19 26 H29 M19 32 H26" stroke={a} {...stroke} />
      <path d="M24 17 Q24 6 37 6" stroke="currentColor" {...stroke} />
      <circle cx="24" cy="17" r="1.7" fill="currentColor" />
    </svg>
  );
}

/** Aboveboard: a document above a horizontal board. (The approved design; never a mast or a hull.) */
export function AboveboardMark({ size = 28, title, className, x, y }: Props) {
  return (
    <svg {...svgProps(size, title, className, x, y)}>
      <path d="M13 31 V8 H27 L35 16 V31 Z M27 8 V16 H35 M19 23 H28" stroke={accentOf("azure")} {...stroke} />
      <path d="M7 39 H41" stroke="currentColor" {...stroke} />
    </svg>
  );
}

/** The Longline Labs company mark: Option A, the Linked LL, approved October 30, 2026. One ink. */
export function LonglineMark({ size = 28, title, className, x, y }: Props) {
  return (
    <svg {...svgProps(size, title, className, x, y)}>
      <path d="M8 9 V37 H34 Q40 37 40 31 V29 M23 9 V37" stroke="currentColor" {...stroke} />
    </svg>
  );
}

/** The Longline Labs lockup: the mark with the name beside it, for the switcher's title and the footer. */
export function LonglineWordmark({ size = 22, name = "Longline Labs", href, className }: { size?: number; name?: string; href?: string; className?: string }) {
  const inner = (
    <>
      <LonglineMark size={size} />
      <span className="ll-lockup-name">{name}</span>
    </>
  );
  const cls = className ? `ll-lockup ${className}` : "ll-lockup";
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <span className={cls}>{inner}</span>
  );
}

/**
 * The six-app longline (the final approved package's supporting-illustration/six-color-longline-*.svg, October 30,
 * 2026): a straight mainline, six equal drops, and under each, with a small gap, the app's actual mark at nine
 * tenths, left to right in apps.json order. Drawn here from the same marks the header uses, so the ink follows the
 * theme (--mark-ink) and each accent follows palette.json's mark colour; the geometry is the file's (each
 * translate(x 84) scale(.9) is a nested 43.2px SVG). A supporting graphic for the family section and company pages,
 * used large: never the header, a favicon or a compact icon. It supersedes every earlier dot or staggered-drop
 * version. Apps are not added to it automatically.
 */
export function LonglineIllustration({ className, title = "The Longline Labs apps" }: { className?: string; title?: string }) {
  const marks: AppKey[] = ["coifish", "reelminder", "packetskipper", "ballastbook", "shipshapefiles", "aboveboard"];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 156" className={className ? `ll-illustration ${className}` : "ll-illustration"} role="img" aria-label={title} focusable="false">
      <path d="M20 30 H340 M40 30 V77 M96 30 V77 M152 30 V77 M208 30 V77 M264 30 V77 M320 30 V77" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {marks.map((key, i) => (
        <Mark key={key} app={key} size={43.2} x={18.4 + 56 * i} y={84} />
      ))}
    </svg>
  );
}

const BY_APP: Record<AppKey, (p: Props) => ReactElement> = {
  coifish: CoifishMark,
  reelminder: ReelMinderMark,
  packetskipper: PacketSkipperMark,
  ballastbook: BallastBookMark,
  shipshapefiles: ShipShapeMark,
  aboveboard: AboveboardMark,
};

/** The mark of one of the apps. Pass `title` when no text beside it names the app. */
export function Mark({ app, ...props }: Props & { app: AppKey }) {
  const Component = BY_APP[app];
  return <Component {...props} />;
}
