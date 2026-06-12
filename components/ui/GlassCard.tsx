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

// На iOS — настоящий blur, на Android blur тормозит,
// поэтому полупрозрачный белый фон даёт тот же эффект.
export function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.shadowWrap, style]}>
        <BlurView intensity={40} tint="extraLight" style={[styles.blur, { padding }]}>
          {children}
        </BlurView>
      </View>
    );
  }
  return <View style={[styles.shadowWrap, styles.androidCard, { padding }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.glassBorder,
    shadowColor: Colors.glassShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  blur: {
    borderRadius: Radius.xl,
  },
  androidCard: {
    backgroundColor: Colors.glassBackground,
  },
});
