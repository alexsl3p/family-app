// Dark Neumorphism — глубокий тёмный фиолетово-чёрный + сереневый акцент
export const Colors = {
  // Фон — тёмный фиолетово-чёрный
  bgGradientStart: '#16122A',
  bgGradientMid: '#1B1632',
  bgGradientEnd: '#201B3C',

  // Мягкие глоу-пятна
  orbBlue: 'rgba(130, 110, 210, 0.10)',
  orbViolet: 'rgba(190, 130, 240, 0.07)',
  orbCyan: 'rgba(110, 90, 190, 0.09)',

  // Карточки — тёмные полупрозрачные панели
  glassBackground: 'rgba(255, 255, 255, 0.06)',
  glassBackgroundStrong: 'rgba(255, 255, 255, 0.10)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  glassHighlight: 'rgba(255, 255, 255, 0.18)',
  glassShadow: 'rgba(0, 0, 0, 0.55)',
  glassDivider: 'rgba(255, 255, 255, 0.07)',

  // Текст
  textPrimary: '#EDE8FF',     // почти белый, лёгкий лавандовый оттенок
  textSecondary: '#9490B8',   // средне-сереневый
  textMuted: '#5A5478',       // тёмный сереневый
  textWhite: '#FFFFFF',

  // Акцент — сереневый (серо-лавандовый)
  accent: '#9490B8',
  accentBright: '#B0ACCC',
  accentLight: 'rgba(148, 144, 184, 0.18)',
  accentDark: '#7470A0',
  accentGradient: ['#B4AEDD', '#8880BE'] as const,

  // Статусы (приглушённые под тёмный фон)
  success: '#4ADE80',
  successLight: 'rgba(74, 222, 128, 0.12)',
  warning: '#FBBF24',
  warningLight: 'rgba(251, 191, 36, 0.12)',
  error: '#F87171',
  errorLight: 'rgba(248, 113, 113, 0.10)',

  // Навигация
  tabBar: 'rgba(255, 255, 255, 0.07)',
  tabBarBorder: 'rgba(255, 255, 255, 0.11)',
  tabBarActive: '#B4AEDD',
  tabBarInactive: '#5A5478',

  // FAB
  fabBackground: '#9490B8',
  fabShadow: 'rgba(0, 0, 0, 0.60)',

  // Палитра участников
  memberColors: ['#EC4899', '#FBBF24', '#4ADE80', '#9490B8', '#A78BFA', '#22D3EE'],
};
