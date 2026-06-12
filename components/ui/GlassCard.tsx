import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/radius';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
}

// Liquid glass карточка: blur на iOS / rgba на Android + световая
// кромка сверху (имитация преломления света на стекле) и двухслойная тень.
export function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  const inner =
    Platform.OS === 'ios' ? (
      <BlurView intensity={45} tint="extraLight" style={[styles.inner, { padding }]}>
        <View style={styles.topHighlight} />
        {children}
      </BlurView>
    ) : (
      <View style={[styles.inner, styles.androidInner, { padding }]}>
        <View style={styles.topHighlight} />
        {children}
      </View>
    );

  return <View style={[styles.shadowWrap, style]}>{inner}</View>;
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    // мягкая глубокая тень (ключевая)
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 5,
  },
  inner: {
    borderRadius: Radius.xxl,
  },
  androidInner: {
    backgroundColor: Colors.glassBackground,
  },
  // световая кромка сверху — главный признак «дорогого» стекла
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: Colors.glassHighlight,
    opacity: 0.9,
  },
});
