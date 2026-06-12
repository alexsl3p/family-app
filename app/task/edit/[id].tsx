import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/radius';
import type { RepeatType } from '@/features/tasks/types';

const REPEATS: { value: RepeatType; label: string }[] = [
  { value: 'none', label: 'Не повторять' },
  { value: 'daily', label: 'Ежедневно' },
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'monthly', label: 'Ежемесячно' },
];

export default function EditTaskScreen() {
  useLocalSearchParams<{ id: string }>();
  // Мок-значения до подключения Supabase
  const [title, setTitle] = useState('Купить продукты');
  const [description, setDescription] = useState('Молоко 2л, хлеб белый, яблоки 1кг, сыр твёрдый');
  const [repeat, setRepeat] = useState<RepeatType>('weekly');

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Изменить дело</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <GlassCard padding={20}>
          <Text style={styles.fieldLabel}>НАЗВАНИЕ</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.fieldLabel}>ОПИСАНИЕ</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.fieldLabel}>ПОВТОРЕНИЕ</Text>
          <View style={styles.repeatRow}>
            {REPEATS.map((r) => (
              <TouchableOpacity
                key={r.value}
                onPress={() => setRepeat(r.value)}
                activeOpacity={0.7}
                style={[styles.repeatChip, repeat === r.value && styles.repeatChipActive]}
              >
                <Text style={[styles.repeatText, repeat === r.value && styles.repeatTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        <GlassButton
          title="Сохранить"
          icon="checkmark"
          onPress={() => router.back()}
          disabled={!title.trim()}
        />
        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary },
  content: { padding: Spacing.screenPadding, paddingTop: 8, gap: 14 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 6,
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
    marginBottom: 12,
  },
  multiline: { height: 88, paddingTop: 14 },
  repeatRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  repeatChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1.5,
    borderColor: Colors.glassBorder,
  },
  repeatChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  repeatText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  repeatTextActive: { color: '#fff' },
});
