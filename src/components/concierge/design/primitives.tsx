"use client";

/**
 * Shared AI2UI primitives — ported verbatim from the prototype (blocks.jsx):
 * Icon (30-icon SVG set), Logo, Sparkline, Card, Pill, Say, Typing, ActionChip.
 * Block views import these; A2UI catalog wrappers import the views.
 */
import React from 'react';
import { T, type IconName } from './tokens';

export { usd } from './tokens';

export function Icon({
  name,
  size = 18,
  color = 'currentColor',
  sw = 1.8,
  style,
}: {
  name: IconName | string;
  size?: number;
  color?: string;
  sw?: number;
  style?: React.CSSProperties;
}) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style,
  };
  const G: Record<string, React.ReactNode> = {
    shield: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>,
    doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13h6M10 16h6" /></>,
    heart: <path d="M12 20s-7-4.3-9-9.2C1.5 6.6 4 4 6.8 4 9 4 12 6 12 6s3-2 5.2-2C20 4 22.5 6.6 21 10.8 19 15.7 12 20 12 20z" />,
    activity: <path d="M3 12h4l2-6 4 12 2-6h6" />,
    video: <><rect x="3" y="6" width="12" height="12" rx="2.5" /><path d="M15 10l6-3v10l-6-3z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
    dollar: <><path d="M12 3v18" /><path d="M16 7.5C16 5.6 14.2 4.5 12 4.5S8 5.6 8 7.5 9.8 10.5 12 11s4 1.5 4 3.5-1.8 3-4 3-4-1.1-4-3" /></>,
    check: <path d="M5 13l4 4L19 7" />,
    checkc: <><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></>,
    alert: <><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17.5v.5" /></>,
    chevron: <path d="M9 6l6 6-6 6" />,
    chevdown: <path d="M6 9l6 6 6-6" />,
    spark: <path d="M12 3l1.8 5.5L19 10l-5.2 1.5L12 17l-1.8-5.5L5 10l5.2-1.5z" />,
    pin: <><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
    star: <path d="M12 4l2.4 5 5.6.8-4 4 1 5.6L12 16.8 7 19.4l1-5.6-4-4 5.6-.8z" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    send: <path d="M5 12l15-7-6 15-2.5-6L5 12z" />,
    clip: <path d="M20 11l-8.5 8.5a4 4 0 01-6-6L13 5.5a2.6 2.6 0 014 3.5l-8 8a1.2 1.2 0 01-2-1.5l7.5-7.5" />,
    building: <><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>,
    pill: <><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-45 12 12)" /><path d="M9 9l6 6" /></>,
    scale: <path d="M12 4v16M5 8h14M5 8l-2 5h4zM19 8l-2 5h4z" />,
    book: <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM19 3v16" />,
    sliders: <><path d="M4 8h10M18 8h2M4 16h2M10 16h10" /><circle cx="16" cy="8" r="2.2" /><circle cx="8" cy="16" r="2.2" /></>,
    bolt: <path d="M13 3L5 13h5l-1 8 8-10h-5z" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" /></>,
  };
  return <svg {...p}>{G[name] || null}</svg>;
}

export function Logo({ size = 30, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: T.grad,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        boxShadow: glow ? '0 6px 16px rgba(80,72,229,.4)' : 'none',
      }}
    >
      <Icon name="shield" size={size * 0.56} color="#fff" sw={2} />
    </div>
  );
}

export function Sparkline() {
  return (
    <span style={{ display: 'inline-flex' }}>
      <Icon name="spark" size={13} color={T.purple} sw={1.6} />
    </span>
  );
}

export function Card({
  children,
  style,
  pad = 14,
  onClick,
  tappable,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  pad?: number;
  onClick?: () => void;
  tappable?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: T.surface,
        borderRadius: T.r,
        border: `1px solid ${T.line}`,
        padding: pad,
        boxShadow: T.shadowSm,
        cursor: tappable ? 'pointer' : 'default',
        transition: 'transform .12s ease, box-shadow .12s ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export type PillTone = 'good' | 'warn' | 'danger' | 'blue' | 'purple' | 'neutral';
export function Pill({
  children,
  tone = 'good',
  style,
}: {
  children: React.ReactNode;
  tone?: PillTone;
  style?: React.CSSProperties;
}) {
  const map: Record<PillTone, [string, string]> = {
    good: [T.tealSoft, T.goodDk],
    warn: [T.amberSoft, T.warn],
    danger: [T.redSoft, T.danger],
    blue: [T.blueSoft, T.blue],
    purple: [T.purpSoft, T.purple],
    neutral: [T.sunk, T.ink2],
  };
  const [bg, fg] = map[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: bg,
        color: fg,
        fontSize: 11,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 999,
        letterSpacing: 0.2,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Say({ text, big }: { text: string; big?: boolean }) {
  return (
    <div style={{ color: T.ink, fontSize: big ? 15.5 : 14.5, lineHeight: 1.5, fontWeight: 500, letterSpacing: -0.1 }}>
      {text}
    </div>
  );
}

export function Typing() {
  return (
    <div style={{ display: 'inline-flex', gap: 4, padding: '4px 2px' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 9,
            background: T.ink3,
            animation: `bsBlink 1s ${i * 0.15}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

export function ActionChip({
  label,
  icon,
  onClick,
  big,
  primary,
}: {
  label: string;
  icon?: string;
  onClick?: () => void;
  big?: boolean;
  primary?: boolean;
}) {
  const [hot, setHot] = React.useState(false);
  if (big) {
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
        style={{
          all: 'unset',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          padding: '13px 14px',
          borderRadius: 15,
          cursor: 'pointer',
          background: T.surface,
          border: `1px solid ${hot ? T.blue : T.line2}`,
          boxShadow: hot ? '0 6px 16px rgba(61,90,241,.14)' : T.shadowSm,
          transform: hot ? 'translateY(-1px)' : 'none',
          transition: 'all .14s ease',
        }}
      >
        <span style={{ width: 34, height: 34, borderRadius: 10, background: T.blueSoft, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon name={icon || 'spark'} size={18} color={T.blue} />
        </span>
        <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: T.ink, fontFamily: T.font }}>{label}</span>
        <Icon name="chevron" size={16} color={T.ink3} />
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{
        all: 'unset',
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 13px',
        borderRadius: 999,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        fontFamily: T.font,
        fontSize: 13.5,
        fontWeight: 600,
        color: primary ? '#fff' : hot ? T.blue : T.ink,
        background: primary ? T.grad : hot ? T.blueSoft : T.surface,
        border: primary ? 'none' : `1px solid ${hot ? 'transparent' : T.line2}`,
        boxShadow: primary ? '0 4px 12px rgba(80,72,229,.28)' : 'none',
        transition: 'all .14s ease',
      }}
    >
      {icon && <Icon name={icon} size={15} color={primary ? '#fff' : hot ? T.blue : T.ink2} />}
      {label}
    </button>
  );
}
