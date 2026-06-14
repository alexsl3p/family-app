import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Radius } from '@/constants/radius';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
}

// Premium glassmorphism card поверх закатного фото:
// iOS — настоящий BlurView intensity 52 (frosted glass, sunset просвечивает)
// Android — тёплый rgba с белой border.
// Skill-рекомендации: border rgba(255,255,255,0.35), highlight 0.65, shadow 0.40.
export function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.shadow, style]}>
        <BlurView intensity={52} tint="light" style={styles.blur}>
          {/* Тёплый тинт поверх blur — слабый, чтобы не перекрывать стекло */}
          <View style={styles.warmTint} />
          {/* Световой блик на верхнем крае — refraction line */}
          <View style={styles.highlight} />
          <View style={{ padding }}>{children}</View>
        </BlurView>
      </View>
    );
  }

  return (
    <View style={[styles.shadow, style]}>
      <View style={[styles.androidCard, { padding }]}>
        <View style={styles.warmTint} />
        <View style={styles.highlight} />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: Radius.xxl,
    // Тёмная тень снизу — даёт z-глубину над фоном
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.40,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  blur: {
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    overflow: 'hidden',
  },
  androidCard: {
    borderRadius: Radius.xxl,
    // rgba тёплое стекло на Android
    backgroundColor: 'rgba(255, 230, 200, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    overflow: 'hidden',
  },
  // Тёплый тинт — чтобы cold blur не "обесцвечивал" закат
  warmTint: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 180, 100, 0.07)',
  },
  // Световой блик — имитация преломления света на стекле
  highlight: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 1,
  },
});
