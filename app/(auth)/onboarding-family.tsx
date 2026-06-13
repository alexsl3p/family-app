import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/radius';
import { useUIStore } from '@/store/uiStore';

type Mode = 'choose' | 'create' | 'join';

export default function OnboardingFamilyScreen() {
  const [mode, setMode] = useState<Mode>('choose');
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const completeOnboarding = useUIStore((s) => s.completeOnboarding);

  const isCreate = mode === 'create';

  const handleConfirm = () => {
    completeOnboarding();
    router.replace('/');
  };

  return (
    <LinearGradient
      colors={[Colors.bgGradientStart, Colors.bgGradientMid, Colors.bgGradientEnd]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      <View style={[styles.orb, styles.orbTop]} />
      <SafeAreaView style={styles.safeArea}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => (mode === 'choose' ? router.back() : setMode('choose'))}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {mode === 'choose' ? (
            <>
              <View style={styles.iconCircle}>
                <Ionicons name="home" size={36} color={Colors.accentBright} />
              </View>
              <Text style={styles.title}>Добро пожаловать!</Text>
              <Text style={styles.subtitle}>
                Создайте семью или вступите{'\n'}в уже существующую
              </Text>
              <GlassCard padding={16} style={styles.optionsCard}>
                <GlassButton title="Создать семью" icon="home-outline" onPress={() => setMode('create')} />
                <View style={{ height: 10 }} />
                <GlassButton
                  title="Вступить по коду"
                  icon="link-outline"
                  variant="ghost"
                  onPress={() => setMode('join')}
                />
              </GlassCard>
            </>
          ) : (
            <>
              <View style={styles.iconCircle}>
                <Ionicons name={isCreate ? 'home' : 'link'} size={36} color={Colors.accentBright} />
              </View>
              <Text style={styles.title}>{isCreate ? 'Создать семью' : 'Вступить в семью'}</Text>
              <GlassCard padding={20} style={styles.formCard}>
                <Text style={styles.fieldLabel}>
                  {isCreate ? 'НАЗВАНИЕ СЕМЬИ' : 'КОД ПРИГЛАШЕНИЯ'}
                </Text>
                <TextInput
                  style={[styles.input, !isCreate && styles.codeInput]}
                  value={isCreate ? familyName : inviteCode}
                  onChangeText={isCreate ? setFamilyName : setInviteCode}
                  placeholder={isCreate ? 'Например: Семья Ивановых' : 'A7K9Q2PM'}
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize={isCreate ? 'words' : 'characters'}
                  maxLength={isCreate ? 50 : 8}
                  autoFocus
                />
                <GlassButton
                  title={isCreate ? 'Создать' : 'Вступить'}
                  onPress={handleConfirm}
                  disabled={isCreate ? !familyName.trim() : inviteCode.trim().length !== 8}
                  style={{ marginTop: 8 }}
                />
              </GlassCard>
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  orb: { position: 'absolute', borderRadius: 9999 },
  orbTop: { width: 350, height: 350, top: -100, left: -100, backgroundColor: Colors.orbBlue },
  safeArea: { flex: 1 },
  backBtn: {
    width: 44,
    height: 44,
    margin: Spacing.md,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, padding: Spacing.screenPadding, justifyContent: 'center', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  optionsCard: { width: '100%' },
  formCard: { width: '100%' },
  fieldLabel: {
    fontSize: 11, fontWeight: '600', color: Colors.textSecondary,
    marginBottom: 8, letterSpacing: 0.8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  codeInput: { letterSpacing: 4, fontWeight: '700', textAlign: 'center', fontSize: 20 },
});
