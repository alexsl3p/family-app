import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { AvatarBubble } from '@/components/ui/AvatarBubble';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useWeather } from '@/features/weather/hooks';

const MOCK_PRIORITY_TASK = {
  id: '0',
  title: 'Купить продукты на ужин',
  description: 'Молоко, яйца, хлеб и овощи для супа.',
  due: '18:00',
  assignee: 'Мама',
};

const MOCK_TASKS = [
  { id: '1', title: 'Купить продукты', due: 'Сегодня', assignee: 'Мама', tag: 'Покупки' },
  { id: '2', title: 'Забрать детей из школы', due: 'Сегодня', assignee: 'Папа', tag: 'Дети' },
  { id: '3', title: 'Оплатить счета', due: 'Завтра', assignee: null, tag: 'Финансы' },
];

const MOCK_SHOPPING = ['Молоко 2л', 'Хлеб', 'Яблоки 1кг', 'Сыр'];

const MOCK_MEMBERS = [
  { name: 'Мама', color: '#FF7849', status: 'На работе' },
  { name: 'Папа', color: '#60A5FA', status: 'В дороге' },
  { name: 'Лёня', color: '#4ADE80', status: 'В школе' },
];

export default function HomeScreen() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Доброе утро' : hour < 17 ? 'Добрый день' : 'Добрый вечер';
  const { weather } = useWeather();

  return (
    <ScreenBackground>
      {/* Header */}
      <View style={styles.header}>
        <AvatarBubble name="Family OS" color={Colors.accent} size={40} />
        <Text style={styles.appName}>Family OS</Text>
        <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>{greeting}, семья!</Text>
        <Text style={styles.subtitle}>Вот что происходит сегодня.</Text>

        {/* PRIORITY TASK CARD — Stitch style */}
        <GlassCard style={styles.priorityCard} padding={0}>
          <View style={styles.priorityAccent} />
          <View style={styles.priorityInner}>
            <View style={styles.priorityHeader}>
              <View style={styles.priorityBadge}>
                <Ionicons name="star" size={13} color={Colors.accent} />
                <Text style={styles.priorityLabel}>ПРИОРИТЕТ</Text>
              </View>
              <View style={styles.dueBadge}>
                <Text style={styles.dueText}>До {MOCK_PRIORITY_TASK.due}</Text>
              </View>
            </View>
            <Text style={styles.priorityTitle}>{MOCK_PRIORITY_TASK.title}</Text>
            <Text style={styles.priorityDesc}>{MOCK_PRIORITY_TASK.description}</Text>
            <TouchableOpacity
              style={styles.completeBtn}
              activeOpacity={0.8}
              onPress={() => router.push(`/task/${MOCK_PRIORITY_TASK.id}` as never)}
            >
              <Text style={styles.completeBtnText}>Выполнено</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* WEATHER CARD — только °C как просил */}
        <GlassCard style={styles.weatherCard} padding={20}>
          <View style={styles.weatherMain}>
            <View>
              <Text style={styles.weatherTemp}>
                {weather ? `${weather.temp}°C` : '--°C'}
              </Text>
              <Text style={styles.weatherCondition}>
                {weather ? `${weather.conditionIcon} ${weather.condition}` : 'Загрузка...'}
              </Text>
              <Text style={styles.weatherCity}>{weather?.city ?? ''}</Text>
            </View>
            <View style={styles.weatherStats}>
              <View style={styles.weatherStat}>
                <Text style={styles.weatherStatNum}>{MOCK_TASKS.length}</Text>
                <Text style={styles.weatherStatLabel}>Дел</Text>
              </View>
              <View style={styles.weatherStatDivider} />
              <View style={styles.weatherStat}>
                <Text style={styles.weatherStatNum}>1</Text>
                <Text style={styles.weatherStatLabel}>Событие</Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* SHOPPING LIST */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Список покупок</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shopping' as never)} activeOpacity={0.7}>
            <Ionicons name="add" size={22} color={Colors.accent} />
          </TouchableOpacity>
        </View>
        <GlassCard padding={8} style={styles.listCard}>
          {MOCK_SHOPPING.map((item) => (
            <View key={item} style={styles.listItem}>
              <View style={styles.checkbox} />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => router.push('/(tabs)/shopping' as never)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>Показать все</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.accent} />
          </TouchableOpacity>
        </GlassCard>

        {/* FAMILY */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Семья</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/family' as never)} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <GlassCard padding={12}>
          <View style={styles.membersRow}>
            {MOCK_MEMBERS.map((m) => (
              <View key={m.name} style={styles.memberItem}>
                <AvatarBubble name={m.name} color={m.color} size={44} />
                <Text style={styles.memberName}>{m.name}</Text>
                <Text style={styles.memberStatus}>{m.status}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 12,
    gap: 10,
  },
  appName: { flex: 1, fontSize: 20, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.5 },
  bellBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.screenPadding, paddingTop: 4 },
  greeting: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.6 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 2, marginBottom: 16 },

  // Priority card — Stitch style
  priorityCard: { marginBottom: 12, overflow: 'hidden' },
  priorityAccent: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
    backgroundColor: Colors.accent,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  priorityInner: { paddingLeft: 18, paddingRight: 16, paddingVertical: 16 },
  priorityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  priorityBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,120,73,0.15)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1, borderColor: 'rgba(255,120,73,0.30)',
  },
  priorityLabel: { fontSize: 11, fontWeight: '700', color: Colors.accent, letterSpacing: 0.8 },
  dueBadge: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  dueText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  priorityTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  priorityDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 14 },
  completeBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    paddingHorizontal: 20, paddingVertical: 9,
    borderRadius: 99,
  },
  completeBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },

  // Weather card — Stitch style
  weatherCard: { marginBottom: 20 },
  weatherMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weatherTemp: { fontSize: 42, fontWeight: '700', color: Colors.textPrimary, lineHeight: 46 },
  weatherCondition: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  weatherCity: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  weatherStats: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  weatherStat: { alignItems: 'center' },
  weatherStatNum: { fontSize: 22, fontWeight: '700', color: Colors.accent },
  weatherStatLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  weatherStatDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)' },

  // Section
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.3 },

  // Shopping list
  listCard: { marginBottom: 20 },
  listItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, paddingHorizontal: 8,
    borderRadius: 10,
  },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)' },
  listItemText: { fontSize: 14, color: Colors.textPrimary },
  viewAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginTop: 6, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
  },
  viewAllText: { fontSize: 13, color: Colors.accent, fontWeight: '500' },

  // Family
  membersRow: { flexDirection: 'row', gap: 16 },
  memberItem: { flex: 1, alignItems: 'center', gap: 4 },
  memberName: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  memberStatus: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
});
