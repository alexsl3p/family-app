import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/radius';
import type { RepeatType } from '@/features/tasks/types';

const FILTERS = ['Все', 'Мои', 'Общие', 'Выполненные'] as const;

const REPEAT_LABELS: Record<string, string> = {
  daily: 'ежедневно',
  weekly: 'еженедельно',
  monthly: 'ежемесячно',
};

// Мок-данные до подключения Supabase
const MOCK_TASKS: {
  id: string;
  title: string;
  dueDate: string;
  assignee: string | null;
  isCompleted: boolean;
  repeatType: RepeatType;
}[] = [
  { id: '1', title: 'Купить продукты', dueDate: 'Сегодня', assignee: 'Мама', isCompleted: false, repeatType: 'weekly' },
  { id: '2', title: 'Забрать детей из школы', dueDate: 'Сегодня', assignee: 'Папа', isCompleted: false, repeatType: 'daily' },
  { id: '3', title: 'Оплатить коммуналку', dueDate: '15 июня', assignee: null, isCompleted: false, repeatType: 'monthly' },
  { id: '4', title: 'Записать Машу к врачу', dueDate: '13 июня', assignee: 'Мама', isCompleted: true, repeatType: 'none' },
];

export default function TasksScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Все');

  const filtered = MOCK_TASKS.filter((t) => {
    if (filter === 'Мои') return t.assignee === 'Мама' && !t.isCompleted;
    if (filter === 'Общие') return !t.assignee && !t.isCompleted;
    if (filter === 'Выполненные') return t.isCompleted;
    return true;
  });

  const activeCount = MOCK_TASKS.filter((t) => !t.isCompleted).length;

  return (
    <ScreenBackground>
      <ScreenHeader title="Дела" subtitle={`${activeCount} активных`} />

      <View style={styles.filtersWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon="checkmark-done-outline"
            title="Нет дел"
            description="Нажмите + чтобы добавить первое дело"
          />
        ) : (
          <GlassCard padding={0}>
            {filtered.map((task, idx) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => router.push(`/task/${task.id}` as never)}
                activeOpacity={0.7}
              >
                <View style={[styles.taskItem, idx < filtered.length - 1 && styles.taskItemBorder]}>
                  <View style={[styles.checkbox, task.isCompleted && styles.checkboxDone]}>
                    {task.isCompleted && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <View style={styles.taskBody}>
                    <Text style={[styles.taskTitle, task.isCompleted && styles.taskTitleDone]}>
                      {task.title}
                    </Text>
                    <View style={styles.taskMeta}>
                      <Ionicons name="calendar-outline" size={12} color={Colors.textSecondary} />
                      <Text style={styles.taskMetaText}>{task.dueDate}</Text>
                      {task.assignee && <Text style={styles.taskMetaText}>· {task.assignee}</Text>}
                      {task.repeatType !== 'none' && (
                        <View style={styles.repeatBadge}>
                          <Ionicons name="repeat" size={11} color={Colors.accent} />
                          <Text style={styles.repeatText}>{REPEAT_LABELS[task.repeatType]}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </GlassCard>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  filtersWrap: { marginBottom: 10 },
  filters: { paddingHorizontal: Spacing.screenPadding, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1.5,
    borderColor: Colors.glassBorder,
  },
  filterChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  content: { padding: Spacing.screenPadding, paddingTop: 4, flexGrow: 1 },
  taskItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  taskItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.glassDivider },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  taskTitleDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  taskMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  taskMetaText: { fontSize: 12, color: Colors.textSecondary },
  repeatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 2,
  },
  repeatText: { fontSize: 11, color: Colors.accent },
});
