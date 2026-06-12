import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/radius';

type Mode = 'choose' | 'create' | 'join';

export default function OnboardingFamilyScreen() {
  const [mode, setMode] = useState<Mode>('choose');
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const isCreate = mode === 'create';

  return (
    <LinearGradient
      colors={[Colors.bgGradientStart, Colors.bgGradientMid, Colors.bgGradientEnd]}
      style={styles.container}
    >
      <View style={[styles.orb, styles.orb1]} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {mode === 'choose' ? (
            <>
              <View style={styles.iconCircle}>
                <Ionicons name="home" size={36} color={Colors.accent} />
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
                <Ionicons name={isCreate ? 'home' : 'link'} size={36} color={Colors.accent} />
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
                  onPress={() => router.replace('/(tabs)' as never)}
                  disabled={isCreate ? !familyName.trim() : inviteCode.trim().length !== 8}
                  style={{ marginTop: 8 }}
                />
                <GlassButton
                  title="Назад"
                  variant="ghost"
                  onPress={() => setMode('choose')}
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
  orb1: { width: 350, height: 350, top: -100, left: -100, backgroundColor: 'rgba(74, 144, 217, 0.16)' },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    padding: Spacing.screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  optionsCard: { width: '100%' },
  formCard: { width: '100%' },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.glassBorder,
    padding: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  codeInput: { letterSpacing: 4, fontWeight: '700', textAlign: 'center', fontSize: 20 },
});
