// Exact Stitch dark mode design tokens — extracted from stitch_glass_family_hub ZIP
export const Colors = {
  // ── Backgrounds (Stitch surface scale) ─────────────────────────
  bg: '#0b1326',                         // background / surface / surface-dim
  surface: '#131b2e',                    // surface-container-low  (cards)
  surface2: '#1d2538',                   // surface-container       (elevated cards, FAB menu)
  surfaceHigh: '#272f43',                // surface-container-high
  surfaceHighest: '#333b4f',             // surface-container-highest

  glassBackground: 'rgba(11,19,38,0.55)',
  glassBackgroundStrong: 'rgba(11,19,38,0.75)',
  glassBorder: 'rgba(255,255,255,0.10)',
  glassBorderStrong: 'rgba(255,255,255,0.15)',
  glassHighlight: 'rgba(255,255,255,0.05)',
  glassShadow: 'rgba(0,0,0,0.50)',
  glassDivider: 'rgba(255,255,255,0.08)',

  // ── Text (Stitch on-surface scale) ─────────────────────────────
  textPrimary: '#e2e2e9',                // on-surface
  textSecondary: '#cbc4d5',             // on-surface-variant
  textMuted: '#958e9f',                  // outline
  textWhite: '#FFFFFF',

  // ── Primary — lavender (Stitch primary dark-mode) ──────────────
  // Stitch:  primary = #d2bbff (for icons, text, active indicators)
  //          primary-container = #4a00a2  (for filled buttons / active nav bg)
  //          on-primary-container = #eaddff  (text ON filled container)
  accent: '#d2bbff',                     // primary  — icons, text, active labels
  accentContainer: '#4a00a2',           // primary-container — filled buttons, active nav bg
  accentOnContainer: '#eaddff',         // on-primary-container — text on filled purple
  accentBright: '#d2bbff',
  accentLight: 'rgba(210,187,255,0.20)', // primary / 20%
  accentDark: '#630ed4',                 // inverse-primary
  accentGradient: ['#d2bbff', '#ffafd3'] as const, // from-primary to-secondary (Stitch CTA)

  // ── Secondary — rose pink (Stitch secondary dark-mode) ─────────
  // secondary = #ffafd3  (priority badges, due-date pills, label accents)
  // secondary-container = #85145a
  pink: '#ffafd3',                       // secondary
  pinkBright: '#ffafd3',
  pinkContainer: '#85145a',             // secondary-container
  pinkLight: 'rgba(255,175,211,0.20)',  // secondary / 20%
  pinkGradient: ['#ffafd3', '#d2bbff'] as const,

  // ── Tertiary — sky blue (Stitch tertiary dark-mode) ────────────
  // tertiary = #7bd0ff  ("At Work" status, secondary data)
  info: '#7bd0ff',                       // tertiary
  infoLight: 'rgba(123,208,255,0.20)',

  // ── Status ─────────────────────────────────────────────────────
  success: '#34D399',
  successLight: 'rgba(52,211,153,0.14)',
  warning: '#FBBF24',
  warningLight: 'rgba(251,191,36,0.14)',
  error: '#ffb4ab',                      // Stitch error dark
  errorLight: 'rgba(255,180,171,0.12)',

  // ── Tab bar (Stitch: bg-[#0b1326]/80 backdrop-blur rounded-t-xl border-t border-white/10) ──
  tabBar: 'rgba(11,19,38,0.92)',
  tabBarBorder: 'rgba(255,255,255,0.10)',
  tabBarActive: '#eaddff',              // on-primary-container (text/icon on active pill)
  tabBarActiveContainer: '#4a00a2',    // primary-container (active pill bg)
  tabBarInactive: '#cbc4d5',           // on-surface-variant

  // ── FAB — deep purple gradient (custom, not in Stitch HTML) ────
  fabBackground: '#4a00a2',
  fabShadow: 'rgba(74,0,162,0.55)',
  fabGradient: ['#7C3AED', '#4a00a2'] as const,

  // ── Member avatar palette ───────────────────────────────────────
  memberColors: ['#d2bbff', '#ffafd3', '#7bd0ff', '#a78bfa', '#60a5fa', '#fbbf24'],
};
