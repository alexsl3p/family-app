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

// iOS: настоящий BlurView (frosted glass) поверх закатной фотографии
// Android: gradient-border техника — LinearGradient в 1px выглядит как переливающийся ободок,
//          тёмное тёплое стекло внутри. Без elevation (на Android transparent + elevation = белые артефакты).
export function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.iosShadow, style]}>
        <BlurView intensity={38} tint="light" style={styles.blur}>
          <View style={styles.warmTint} />
          <View style={styles.highlight} />
          <View style={{ padding }}>{children}</View>
        </BlurView>
      </View>
    );
  }

  // Android: gradient border = LinearGradient с padding 1.5px создаёт ободок-радугу
  return (
    <View style={[styles.androidOuter, style]}>
      <LinearGradient
        colors={[
          'rgba(255, 160, 80, 0.60)',
          'rgba(255, 240, 210, 0.22)',
          'rgba(200, 70, 20, 0.55)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={[styles.androidInner, { padding }]}>
          <View style={styles.warmTint} />
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // iOS shadow wrapper — overflow:hidden здесь обрезает blur, не shadow
  iosShadow: {
    borderRadius: Radius.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  blur: {
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    overflow: 'hidden',
  },
  // Тёплый тинт — закат слегка просвечивает сквозь стекло
  warmTint: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 110, 40, 0.06)',
  },
  // Световой блик — только iOS (с blur выглядит как преломление)
  highlight: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.60)',
    borderRadius: 1,
  },
  // Android: обёртка без elevation (избегаем белых артефактов Android)
  androidOuter: {
    borderRadius: Radius.xxl,
  },
  // LinearGradient служит "рамкой" толщиной 1.5px с градиентом заката
  gradientBorder: {
    borderRadius: Radius.xxl,
    padding: 1.5,
  },
  // Тёмное тёплое стекло внутри — прозрачнее, чтобы фон просвечивал
  androidInner: {
    borderRadius: Radius.xxl - 1,
    backgroundColor: 'rgba(20, 10, 6, 0.42)',
    overflow: 'hidden',
  },
});
