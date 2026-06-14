import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useUIStore } from '@/store/uiStore';

const FEATURES = [
  { icon: 'checkmark-circle' as const, title: 'Общие дела', desc: 'Ставьте задачи и назначайте исполнителей' },
  { icon: 'cart' as const, title: 'Списки покупок', desc: 'Никогда не забудете нужное в магазине' },
  { icon: 'people' as const, title: 'Вся семья вместе', desc: 'Прогресс и активность в реальном времени' },
];

export default function WelcomeScreen() {
  const completeOnboarding = useUIStore((s) => s.completeOnboarding);

  const handleDemo = () => {
    completeOnboarding();
    router.replace('/');
  };

  return (
    <ImageBackground source={require('@/assets/bg.jpg')} style={styles.container} resizeMode="cover">
      <LinearGradient
        colors={['rgba(8,18,48,0.10)', 'rgba(8,18,48,0.60)', 'rgba(8,18,48,0.88)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="people" size={48} color={Colors.accentBright} />
            </View>
            <Text style={styles.appName}>Family OS</Text>
            <Text style={styles.tagline}>Всё нужное для вашей семьи{'\n'}в одном месте</Text>
          </View>

          <GlassCard style={styles.featuresCard} padding={20}>
            {FEATURES.map(({ icon, title, desc }) => (
              <View key={title} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={icon} size={22} color={Colors.accentBright} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{title}</Text>
                  <Text style={styles.featureDesc}>{desc}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          <View style={styles.actions}>
            <GlassButton
              title="Войти через Google"
              icon="logo-google"
              onPress={() => router.push('/(auth)/onboarding-family' as never)}
            />
            <TouchableOpacity onPress={handleDemo} style={styles.secondaryBtn} activeOpacity={0.7}>
              <Text style={styles.secondaryBtnText}>Посмотреть демо</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { flex: 1, padding: Spacing.screenPadding, justifyContent: 'space-between', paddingVertical: 40 },
  logoSection: { alignItems: 'center', marginTop: 20 },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.40,
    shadowRadius: 20,
    elevation: 6,
  },
  appName: { fontSize: 36, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -1 },
  tagline: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginTop: 8 },
  featuresCard: {},
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  featureIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  featureDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  actions: { gap: 4 },
  secondaryBtn: { alignItems: 'center', paddingVertical: 14 },
  secondaryBtnText: { fontSize: 15, color: Colors.accentBright, fontWeight: '500' },
});
