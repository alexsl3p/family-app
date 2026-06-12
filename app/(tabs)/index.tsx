import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { AvatarBubble } from '@/components/ui/AvatarBubble';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

// Мок-данные до подключения Supabase (промпт 3-4 заменит на хуки фич)
const MOCK_TASKS = [
  { id: '1', title: 'Купить продукты', due: 'Сегодня', assignee: 'Мама' },
  { id: '2', title: 'Забрать детей из школы', due: 'Сегодня', assignee: 'Папа' },
  { id: '3', title: 'Оплатить счета', due: 'Завтра', assignee: null },
];

const MOCK_SHOPPING_PREVIEW = ['Молоко 2л', 'Хлеб', 'Яблоки 1кг', 'Сыр'];

export default function HomeScreen() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Доброе утро' : hour < 17 ? 'Добрый день' : 'Добрый вечер';

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}, семья! 👋</Text>
            <Text style={styles.subtitle}>Всё нужное в одном месте</Text>
          </View>
          <AvatarBubble name="Family OS" color={Colors.accent} size={48} />
        </View>

        <View style={styles.statsRow}>
          {[
            { icon: 'checkmark-circle' as const, num: '3', label: 'Дел сегодня', route: '/(tabs)/tasks' },
            { icon: 'cart' as const, num: '8', label: 'Купить', route: '/(tabs)/shopping' },
            { icon: 'people' as const, num: '4', label: 'Участника', route: '/(tabs)/family' },
          ].map((stat) => (
            <TouchableOpacity
              key={stat.label}
              style={styles.statCard}
              onPress={() => router.push(stat.route as never)}
              activeOpacity={0.7}
            >
              <GlassCard style={styles.statCardInner} padding={14}>
                <View style={styles.statIcon}>
                  <Ionicons name={stat.icon} size={20} color={Colors.accent} />
                </View>
                <Text style={styles.statNum}>{stat.num}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Сегодня</Text>
        <GlassCard padding={0} style={styles.taskList}>
          {MOCK_TASKS.map((task, idx) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => router.push(`/task/${task.id}` as never)}
              activeOpacity={0.7}
            >
              <View style={[styles.taskItem, idx < MOCK_TASKS.length - 1 && styles.taskItemBorder]}>
                <View style={styles.taskCheckbox} />
                <View style={styles.taskBody}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskMeta}>
                    {task.due}
                    {task.assignee ? ` · ${task.assignee}` : ' · Общее'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </GlassCard>

        <Text style={styles.sectionTitle}>Список покупок</Text>
        <GlassCard padding={16}>
          <View style={styles.shoppingHeader}>
            <View style={styles.shoppingTitleRow}>
              <Ionicons name="cart" size={18} color={Colors.accent} />
              <Text style={styles.shoppingTitle}>Продукты</Text>
            </View>
            <View style={styles.shoppingBadge}>
              <Text style={styles.shoppingBadgeText}>8 товаров</Text>
            </View>
          </View>
          <View style={styles.shoppingItems}>
            {MOCK_SHOPPING_PREVIEW.map((item) => (
              <View key={item} style={styles.shoppingItem}>
                <View style={styles.shoppingDot} />
                <Text style={styles.shoppingItemText}>{item}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/shopping' as never)}
            style={styles.shoppingMoreRow}
            activeOpacity={0.7}
          >
            <Text style={styles.shoppingMore}>Показать все</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.accent} />
          </TouchableOpacity>
        </GlassCard>

        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: Spacing.screenPadding, paddingTop: Spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greeting: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  statCard: { flex: 1 },
  statCardInner: { alignItems: 'center' },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNum: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  taskList: { marginBottom: Spacing.md },
  taskItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  taskItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.glassDivider },
  taskCheckbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.accent },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  taskMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  shoppingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  shoppingTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shoppingTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  shoppingBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  shoppingBadgeText: { fontSize: 13, color: Colors.accent, fontWeight: '500' },
  shoppingItems: { gap: 8 },
  shoppingItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  shoppingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent },
  shoppingItemText: { fontSize: 14, color: Colors.textSecondary },
  shoppingMoreRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  shoppingMore: { color: Colors.accent, fontSize: 14, fontWeight: '500' },
});
