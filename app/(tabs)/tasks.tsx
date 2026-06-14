import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { AvatarBubble } from '@/components/ui/AvatarBubble';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

type TaskFilter = 'Все' | 'Мои' | 'Выполненные';

const FILTERS: TaskFilter[] = ['Все', 'Мои', 'Выполненные'];

// Цвет для левой полоски карточки по тегу — как в Stitch
const TAG_COLORS: Record<string, string> = {
  'Покупки':   '#60A5FA',
  'Дети':      '#4ADE80',
  'Финансы':   '#FBBF24',
  'Дом':       '#C084FC',
  'Работа':    '#F87171',
  'Питомцы':   '#34D399',
};

const MOCK_TASKS = [
  { id: '1', title: 'Купить продукты',           due: 'Сегодня, 17:00', assignee: 'Мама',  isCompleted: false, tag: 'Покупки',  priority: true  },
  { id: '2', title: 'Забрать детей из школы',    due: 'Сегодня, 15:00', assignee: 'Папа',  isCompleted: false, tag: 'Дети',     priority: false },
  { id: '3', title: 'Оплатить коммунальные',     due: 'Завтра',         assignee: null,     isCompleted: false, tag: 'Финансы',  priority: false },
  { id: '4', title: 'Убраться в гараже',         due: 'Суббота',        assignee: null,     isCompleted: false, tag: 'Дом',      priority: false },
  { id: '5', title: 'Записать Машу к врачу',     due: '13 июня',        assignee: 'Мама',  isCompleted: true,  tag: 'Дети',     priority: false },
];

const ASSIGNEE_COLORS: Record<string, string> = {
  'Мама': '#4A90FF',
  'Папа': '#60A5FA',
};

export default function TasksScreen() {
  const [filter, setFilter] = useState<TaskFilter>('Все');

  const filtered = MOCK_TASKS.filter((t) => {
    if (filter === 'Мои') return t.assignee === 'Мама' && !t.isCompleted;
    if (filter === 'Выполненные') return t.isCompleted;
    return !t.isCompleted;
  });

  const activeCount = MOCK_TASKS.filter((t) => !t.isCompleted).length;

  return (
    <ScreenBackground>
      {/* Header — Stitch style */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Семейные дела</Text>
          <Text style={styles.subtitle}>{activeCount} на сегодня</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/task/new' as never)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter tabs — Stitch glass-tab style */}
      <View style={styles.filtersRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
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
          <View style={styles.taskList}>
            {filtered.map((task) => {
              const accentColor = TAG_COLORS[task.tag] ?? Colors.accent;
              return (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => router.push(`/task/${task.id}` as never)}
                  activeOpacity={0.75}
                >
                  <GlassCard padding={0} style={styles.taskCard}>
                    {/* Цветная левая полоска — фишка Stitch */}
                    <View style={[styles.taskAccent, { backgroundColor: accentColor }]} />
                    <View style={styles.taskInner}>
                      <View style={styles.taskRow}>
                        <View style={[styles.checkbox, task.isCompleted && { backgroundColor: accentColor, borderColor: accentColor }]}>
                          {task.isCompleted && <Ionicons name="checkmark" size={13} color="#fff" />}
                        </View>
                        <View style={styles.taskBody}>
                          <Text style={[styles.taskTitle, task.isCompleted && styles.taskDone]}>
                            {task.title}
                          </Text>
                          <View style={styles.taskMeta}>
                            <Ionicons name="calendar-outline" size={11} color={Colors.textMuted} />
                            <Text style={styles.taskMetaText}>{task.due}</Text>
                          </View>
                        </View>
                        {task.assignee && (
                          <AvatarBubble
                            name={task.assignee}
                            color={ASSIGNEE_COLORS[task.assignee] ?? Colors.accent}
                            size={32}
                          />
                        )}
                      </View>
                      <View style={styles.taskFooter}>
                        <View style={[styles.tag, { backgroundColor: `${accentColor}22`, borderColor: `${accentColor}55` }]}>
                          <Text style={[styles.tagText, { color: accentColor }]}>{task.tag}</Text>
                        </View>
                        {task.priority && (
                          <View style={styles.priorityPill}>
                            <Ionicons name="star" size={10} color={Colors.accent} />
                            <Text style={styles.priorityPillText}>Приоритет</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 12,
    paddingBottom: 14,
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.50, shadowRadius: 10, elevation: 6,
  },

  // Filter tabs — glass pill tabs (Stitch glass-tab)
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  filterTabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterText: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.55)' },
  filterTextActive: { color: '#fff', fontWeight: '600' },

  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.screenPadding, flexGrow: 1 },
  taskList: { gap: 10 },

  // Task card — Stitch style с цветной полоской слева
  taskCard: { overflow: 'hidden' },
  taskAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  taskInner: { paddingLeft: 16, paddingRight: 12, paddingTop: 12, paddingBottom: 10 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  taskDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  taskMetaText: { fontSize: 12, color: Colors.textMuted },
  taskFooter: { flexDirection: 'row', gap: 8, alignItems: 'center' },

  // Tag pill
  tag: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 99, borderWidth: 1,
  },
  tagText: { fontSize: 11, fontWeight: '600' },

  // Priority pill — pink like Stitch
  priorityPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.pinkLight,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1, borderColor: 'rgba(236,72,153,0.35)',
  },
  priorityPillText: { fontSize: 11, fontWeight: '600', color: Colors.pink },
});
