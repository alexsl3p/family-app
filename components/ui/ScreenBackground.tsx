import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

// Градиентный фон с «парящими» цветовыми пятнами — основа glassmorphism-сцены.
export function ScreenBackground({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={[Colors.bgGradientStart, Colors.bgGradientMid, Colors.bgGradientEnd]}
      style={styles.container}
    >
      <View style={[styles.orb, styles.orbTopLeft]} />
      <View style={[styles.orb, styles.orbTopRight]} />
      <View style={[styles.orb, styles.orbBottomLeft]} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  orb: { position: 'absolute', borderRadius: 9999 },
  orbTopLeft: {
    width: 300,
    height: 300,
    top: -80,
    left: -80,
    backgroundColor: 'rgba(74, 144, 217, 0.14)',
  },
  orbTopRight: {
    width: 200,
    height: 200,
    top: 60,
    right: -50,
    backgroundColor: 'rgba(150, 110, 220, 0.08)',
  },
  orbBottomLeft: {
    width: 250,
    height: 250,
    bottom: 100,
    left: -60,
    backgroundColor: 'rgba(120, 200, 245, 0.12)',
  },
});
