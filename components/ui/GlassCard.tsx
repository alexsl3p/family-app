import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Radius } from '@/constants/radius';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
}

// Soft UI card: white panel with purple-tinted soft shadow and white border highlight.
// No blur — clean neumorphic lift against the lavender background.
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
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#6040B8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 6,
    overflow: 'hidden',
  },
  // Top inner highlight — simulates neumorphic top-light
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    opacity: 0.85,
  },
});
