import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Radius } from '@/constants/radius';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
}

// Dark neumorphic panel: тёмное полупрозрачное стекло на тёмном фоне.
// Тень снизу + белый хайлайт сверху создают neumorphic «выдавленный» эффект.
export function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.topHighlight} />
      <View style={{ padding }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 1,
  },
});
