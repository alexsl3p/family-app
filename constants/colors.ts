// Stitch design system — dark purple-navy + violet + pink action
export const Colors = {
  // Backgrounds — dark with purple tint (exact Stitch)
  bg: '#09091C',
  bgGradientStart: '#09091C',
  bgGradientMid: '#0D0F28',
  bgGradientEnd: '#121530',

  orbBlue: 'rgba(0,0,0,0)',
  orbViolet: 'rgba(0,0,0,0)',
  orbCyan: 'rgba(0,0,0,0)',

  // Card surfaces — dark purple
  surface: '#111430',
  surface2: '#1A1D40',
  glassBackground: '#111430',
  glassBackgroundStrong: '#1A1D40',
  glassBorder: 'rgba(255,255,255,0.08)',
  glassHighlight: 'rgba(255,255,255,0.05)',
  glassShadow: 'rgba(0,0,0,0.60)',
  glassDivider: 'rgba(255,255,255,0.05)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.55)',
  textMuted: 'rgba(255,255,255,0.35)',
  textWhite: '#FFFFFF',

  // Primary — violet/purple (Stitch chrome: nav, FAB, links)
  accent: '#8B5CF6',
  accentBright: '#A78BFA',
  accentLight: 'rgba(139,92,246,0.18)',
  accentDark: '#7C3AED',
  accentGradient: ['#A78BFA', '#7C3AED'] as const,

  // Action pink — for priority badges, CTA buttons, due-date pills (Stitch pink)
  pink: '#EC4899',
  pinkBright: '#F472B6',
  pinkLight: 'rgba(236,72,153,0.18)',
  pinkGradient: ['#F472B6', '#DB2777'] as const,

  // Status
  success: '#34D399',
  successLight: 'rgba(52,211,153,0.14)',
  warning: '#FBBF24',
  warningLight: 'rgba(251,191,36,0.14)',
  error: '#F87171',
  errorLight: 'rgba(248,113,113,0.12)',

  // Tab bar
  tabBar: 'rgba(9,9,28,0.98)',
  tabBarBorder: 'rgba(255,255,255,0.07)',
  tabBarActive: '#8B5CF6',
  tabBarInactive: 'rgba(255,255,255,0.38)',

  // FAB — violet
  fabBackground: '#8B5CF6',
  fabShadow: 'rgba(139,92,246,0.55)',

  // Member palette
  memberColors: ['#8B5CF6', '#EC4899', '#34D399', '#A78BFA', '#60A5FA', '#FBBF24'],
};
