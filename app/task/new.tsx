import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { AvatarBubble } from '@/components/ui/AvatarBubble';
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

const MOCK_MEMBERS = [
  { id: '1', name: 'Алексей', color: '#4A90D9' },
  { id: '2', name: 'Мария', color: '#FF6B9D' },
  { id: '3', name: 'Дима', color: '#4ECDC4' },
];

export default function NewTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repeat, setRepeat] = useState<RepeatType>('none');
  const [assignee, setAssignee] = useState<string | null>(null);

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Новое дело</Text>
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
            placeholder="Что нужно сделать?"
            placeholderTextColor={Colors.textMuted}
            autoFocus
          />

          <Text style={styles.fieldLabel}>ОПИСАНИЕ</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Подробности…"
            placeholderTextColor={Colors.textMuted}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.fieldLabel}>КОМУ НАЗНАЧИТЬ</Text>
          <View style={styles.assigneeRow}>
            <TouchableOpacity
              onPress={() => setAssignee(null)}
              activeOpacity={0.7}
              style={[styles.assigneeChip, assignee === null && styles.assigneeChipActive]}
            >
              <Ionicons
                name="people"
                size={16}
                color={assignee === null ? '#fff' : Colors.textSecondary}
              />
              <Text style={[styles.assigneeText, assignee === null && styles.assigneeTextActive]}>
                Общее
              </Text>
            </TouchableOpacity>
            {MOCK_MEMBERS.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => setAssignee(m.id)}
                activeOpacity={0.7}
                style={[styles.assigneeChip, assignee === m.id && styles.assigneeChipActive]}
              >
                <AvatarBubble name={m.name} color={m.color} size={20} />
                <Text style={[styles.assigneeText, assignee === m.id && styles.assigneeTextActive]}>
                  {m.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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
          title="Добавить дело"
          icon="add"
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
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  multiline: { height: 88, paddingTop: 14 },
  assigneeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  assigneeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  assigneeChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  assigneeText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  assigneeTextActive: { color: '#fff' },
  repeatRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  repeatChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  repeatChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  repeatText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  repeatTextActive: { color: '#fff' },
});
