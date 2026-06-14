import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Фон — закатная фотография с тёмным градиентным оверлеем для читаемости UI
export function ScreenBackground({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground
      source={require('@/assets/bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Тёмный оверлей снизу — чтобы текст и карточки читались */}
      <LinearGradient
        colors={['rgba(8,18,48,0.10)', 'rgba(8,18,48,0.55)', 'rgba(8,18,48,0.82)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
});
