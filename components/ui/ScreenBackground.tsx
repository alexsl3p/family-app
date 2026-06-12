import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

export function ScreenBackground({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={[Colors.bgGradientStart, Colors.bgGradientMid, Colors.bgGradientEnd]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}
    >
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
  orbTopRight: {
    width: 300,
    height: 300,
    top: -80,
    right: -80,
    backgroundColor: Colors.orbBlue,
  },
  orbBottomLeft: {
    width: 260,
    height: 260,
    bottom: 60,
    left: -70,
    backgroundColor: Colors.orbViolet,
  },
});
