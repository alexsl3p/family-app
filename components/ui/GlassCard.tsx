import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Radius } from '@/constants/radius';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
}

// Точный стиль из uiverse.io/narmesh_sah/purple-quail-14:
// background: rgba(255,255,255,0.15)  blur(8px)  border: rgba(255,255,255,0.18)
// box-shadow: 0 8px 32px 0 #0d2626
export function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.shadow, style]}>
        <BlurView intensity={28} tint="light" style={styles.blur}>
          <View style={styles.highlight} />
          <View style={{ padding }}>{children}</View>
        </BlurView>
      </View>
    );
  }

  return (
    <View style={[styles.shadow, style]}>
      <View style={[styles.card, { padding }]}>
        <View style={styles.highlight} />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: Radius.xxl,
    // box-shadow: 0 8px 32px 0 #0d2626  (из оригинала)
    shadowColor: '#0d2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 8,
  },
  blur: {
    borderRadius: Radius.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
  },
  // Android: rgba(255,255,255,0.15) как в оригинале
  card: {
    borderRadius: Radius.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
  },
  // Тонкий световой блик сверху — классика glassmorphism
  highlight: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  },
});
