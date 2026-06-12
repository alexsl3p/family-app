import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

// Liquid glass сцена: воздушный градиент + иридисцентные пятна
// (синее/фиолетовое/циановое) — даёт стеклу глубину и перелив.
export function ScreenBackground({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={[Colors.bgGradientStart, Colors.bgGradientMid, Colors.bgGradientEnd]}
      style={styles.container}
    >
      <View style={[styles.orb, styles.orbTopLeft]} />
      <View style={[styles.orb, styles.orbTopRight]} />
      <View style={[styles.orb, styles.orbMidRight]} />
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
    width: 320,
    height: 320,
    top: -100,
    left: -90,
    backgroundColor: Colors.orbBlue,
  },
  orbTopRight: {
    width: 220,
    height: 220,
    top: 40,
    right: -70,
    backgroundColor: Colors.orbViolet,
  },
  orbMidRight: {
    width: 180,
    height: 180,
    top: 360,
    right: -40,
    backgroundColor: Colors.orbCyan,
  },
  orbBottomLeft: {
    width: 280,
    height: 280,
    bottom: 80,
    left: -80,
    backgroundColor: Colors.orbViolet,
  },
});
