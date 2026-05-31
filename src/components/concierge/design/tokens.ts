/**
 * Brainsty AI2UI design tokens — ported verbatim from the prototype (blocks.jsx `T`).
 * Shared by every concierge block view and the A2UI catalog wrappers.
 */
export const T = {
  bg: '#F3F5FA',
  surface: '#FFFFFF',
  sunk: '#F7F8FC',
  ink: '#161B2B',
  ink2: '#5C6679',
  ink3: '#98A0B3',
  line: '#EBEEF4',
  line2: '#E1E5EE',
  blue: '#3D5AF1',
  purple: '#7C3AED',
  grad: 'linear-gradient(135deg,#3D5AF1 0%,#7C3AED 100%)',
  gradSoft: 'linear-gradient(135deg,#5A72F5 0%,#9156F0 100%)',
  blueSoft: '#EDF0FE',
  purpSoft: '#F4EEFE',
  tealSoft: '#E4F6EF',
  amberSoft: '#FDF1E3',
  redSoft: '#FDECEC',
  good: '#0BA678',
  goodDk: '#0A8C66',
  warn: '#E08600',
  danger: '#E0464B',
  font: "'Plus Jakarta Sans', -apple-system, system-ui, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
  r: 18,
  shadow: '0 1px 2px rgba(16,24,40,.04), 0 8px 22px rgba(16,24,40,.06)',
  shadowSm: '0 1px 2px rgba(16,24,40,.05), 0 3px 8px rgba(16,24,40,.05)',
} as const;

/** USD formatter used across the cost/compare/deductible blocks. */
export const usd = (n: number): string => '$' + Math.round(n).toLocaleString('en-US');

export type IconName =
  | 'shield' | 'search' | 'doc' | 'heart' | 'activity' | 'video' | 'calendar'
  | 'dollar' | 'check' | 'checkc' | 'alert' | 'chevron' | 'chevdown' | 'spark'
  | 'pin' | 'star' | 'arrow' | 'plus' | 'send' | 'clip' | 'building' | 'user'
  | 'pill' | 'scale' | 'book' | 'sliders' | 'bolt' | 'close' | 'mic';
