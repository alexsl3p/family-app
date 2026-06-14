// Sunset palette — тёплый закат над облаками
// Coral/orange accent, тёмно-синие полупрозрачные карточки
export const Colors = {
  // Фон — из картинки (в ScreenBackground), здесь fallback градиент
  bgGradientStart: '#0D1B3E',
  bgGradientMid: '#5C2A4E',
  bgGradientEnd: '#C4562A',

  // Orbs — не нужны с картинкой, оставляем заглушки
  orbBlue: 'rgba(255, 140, 90, 0.0)',
  orbViolet: 'rgba(255, 140, 90, 0.0)',
  orbCyan: 'rgba(255, 140, 90, 0.0)',

  // Карточки — тёмно-синие полупрозрачные (закат за стеклом)
  glassBackground: 'rgba(8, 18, 48, 0.70)',
  glassBackgroundStrong: 'rgba(8, 18, 48, 0.88)',
  glassBorder: 'rgba(255, 180, 140, 0.22)',
  glassHighlight: 'rgba(255, 200, 160, 0.30)',
  glassShadow: 'rgba(0, 0, 0, 0.55)',
  glassDivider: 'rgba(255, 160, 110, 0.15)',

  // Текст — тёплые белые тона
  textPrimary: '#FFF5EE',
  textSecondary: '#F0C8B0',
  textMuted: '#B8A098',
  textWhite: '#FFFFFF',

  // Акцент — тёплый coral-orange как закат
  accent: '#FF7849',
  accentBright: '#FFAA7A',
  accentLight: 'rgba(255, 120, 73, 0.20)',
  accentDark: '#E85D30',
  accentGradient: ['#FFAC7C', '#FF6535'] as const,

  // Статусы
  success: '#4ADE80',
  successLight: 'rgba(74, 222, 128, 0.14)',
  warning: '#FBBF24',
  warningLight: 'rgba(251, 191, 36, 0.14)',
  error: '#F87171',
  errorLight: 'rgba(248, 113, 113, 0.12)',

  // Таб-бар — тёмно-синий полупрозрачный
  tabBar: 'rgba(8, 18, 50, 0.80)',
  tabBarBorder: 'rgba(255, 180, 140, 0.22)',
  tabBarActive: '#FFAA7A',
  tabBarInactive: '#7890B8',

  // FAB
  fabBackground: '#FF7849',
  fabShadow: 'rgba(255, 100, 50, 0.55)',

  // Палитра участников
  memberColors: ['#FF7849', '#FBBF24', '#4ADE80', '#60A5FA', '#C084FC', '#22D3EE'],
};
