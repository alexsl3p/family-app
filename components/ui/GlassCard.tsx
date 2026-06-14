import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Radius } from '@/constants/radius';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
}

// Нейтральное матовое стекло (canonical glassmorphism):
// iOS — BlurView tint light, фон просвечивает
// Android — серый полупрозрачный фон + светлая gradient-рамка (без elevation, чтобы не было артефактов)
export function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.iosShadow, style]}>
        <BlurView intensity={34} tint="light" style={styles.blur}>
          <View style={styles.highlight} />
          <View style={{ padding }}>{children}</View>
        </BlurView>
      </View>
    );
  }

  // Android: светло-серая gradient-рамка (1.5px) + прозрачное серое стекло внутри
  return (
    <View style={[styles.androidOuter, style]}>
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.28)',
          'rgba(255, 255, 255, 0.08)',
          'rgba(255, 255, 255, 0.16)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={[styles.androidInner, { padding }]}>
          <View style={styles.highlight} />
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  iosShadow: {
    borderRadius: Radius.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  blur: {
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    overflow: 'hidden',
  },
  // Световой блик на верхнем крае — преломление света на стекле
  highlight: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 1,
  },
  androidOuter: {
    borderRadius: Radius.xxl,
  },
  gradientBorder: {
    borderRadius: Radius.xxl,
    padding: 1.5,
  },
  // Серое прозрачное стекло — фон просвечивает сильнее
  androidInner: {
    borderRadius: Radius.xxl - 1,
    backgroundColor: 'rgba(60, 60, 68, 0.28)',
    overflow: 'hidden',
  },
});
