import type { ReactElement } from "react";
import type { AppKey } from "./apps";

/*
 * The approved marks (brand/approved-option-2-logos, "Option 2: open outline"), as inline SVG. The
 * geometry is the approved files' exactly; the only change is that the supporting strokes, which the
 * files draw in sea by day and cream by night, are `currentColor` here and take --mark-ink from
 * tokens.css, so one element follows light and dark with nothing to swap and no flicker. The accent
 * strokes keep their fixed brand colour, as in the files. The SVG files themselves are in logos/ for
 * sites that would rather use <img>.
 */

type Props = { size?: number; title?: string; className?: string };

const svgProps = (size: number, title: string | undefined, className: string | undefined) => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 48 48",
  width: size,
  height: size,
  className: className ? `ll-mark ${className}` : "ll-mark",
  role: title ? ("img" as const) : undefined,
  "aria-label": title,
  "aria-hidden": title ? undefined : true,
  focusable: "false" as const,
});

const stroke = { fill: "none", strokeWidth: 3.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function CoifishMark({ size = 28, title, className }: Props) {
  return (
    <svg {...svgProps(size, title, className)}>
      <path d="M15 24 Q27 8 40 24 Q27 40 15 24" stroke="#d9643a" {...stroke} />
      <path d="M15 24 L6 16 L6 32 Z" stroke="currentColor" {...stroke} />
      <circle cx="32" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function ReelMinderMark({ size = 28, title, className }: Props) {
  return (
    <svg {...svgProps(size, title, className)}>
      <circle cx="21" cy="27" r="12" fill="none" stroke="#c6912c" strokeWidth="3.4" />
      <circle cx="21" cy="27" r="3" fill="#c6912c" />
      <path d="M21 27 L36 17" stroke="currentColor" {...stroke} />
      <circle cx="37" cy="16" r="3" fill="currentColor" />
      <path d="M21 15 V9 M15 9 H27" stroke="currentColor" {...stroke} strokeWidth={3} />
    </svg>
  );
}

export function PacketSkipperMark({ size = 28, title, className }: Props) {
  return (
    <svg {...svgProps(size, title, className)}>
      <path d="M7 25 Q8 12 24 12 Q40 12 41 25 Z" stroke="#2e8a68" {...stroke} />
      <path d="M11 25 V30 Q24 40 37 30 V25 M11 26 H37" stroke="currentColor" {...stroke} />
      <circle cx="24" cy="19" r="2" fill="#2e8a68" />
    </svg>
  );
}

/**
 * DRAFT, awaiting Brandon's real asset (no Longline Labs logo exists in any repo or in brand/). Drawn from his
 * description: a double-L monogram over a longline, one main line with short branch lines hanging from it, each
 * ending in a dot in one app's accent (rust, brass, kelp; teal is the family's and is not used here). The ink parts
 * are `currentColor` (--mark-ink), the dots keep their brand colours. The same drawing is logos/longline-mark-draft*.svg.
 */
export function LonglineMark({ size = 28, title, className, mono = false }: Props & { mono?: boolean }) {
  const dot = (colour: string) => (mono ? "currentColor" : colour);
  return (
    <svg {...svgProps(size, title, className)} data-draft="longline-mark">
      <path d="M7 5v23h12" stroke="currentColor" {...stroke} />
      <path d="M23 5v23h12" stroke="currentColor" {...stroke} />
      <path d="M5 35h38" stroke="currentColor" fill="none" strokeWidth={2.4} strokeLinecap="round" />
      <path d="M13 35v5M24 35v5M35 35v5" stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="round" />
      <circle cx="13" cy="42.5" r="2.6" fill={dot("#d9643a")} />
      <circle cx="24" cy="42.5" r="2.6" fill={dot("#c6912c")} />
      <circle cx="35" cy="42.5" r="2.6" fill={dot("#2e8a68")} />
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

const BY_APP: Record<AppKey, (p: Props) => ReactElement> = {
  coifish: CoifishMark,
  reelminder: ReelMinderMark,
  packetskipper: PacketSkipperMark,
};

/** The mark of one of the three apps. Pass `title` when no text beside it names the app. */
export function Mark({ app, ...props }: Props & { app: AppKey }) {
  const Component = BY_APP[app];
  return <Component {...props} />;
}
