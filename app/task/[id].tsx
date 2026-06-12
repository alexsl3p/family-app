import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Дело</Text>
        <TouchableOpacity
          onPress={() => router.push(`/task/edit/${id}` as never)}
          style={styles.headerBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={22} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GlassCard>
          <View style={styles.badgeRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Активное</Text>
            </View>
            <View style={styles.repeatBadge}>
              <Ionicons name="repeat" size={13} color={Colors.warning} />
              <Text style={styles.repeatText}>еженедельно</Text>
            </View>
          </View>
          <Text style={styles.title}>Купить продукты</Text>
          <Text style={styles.description}>
            Молоко 2л, хлеб белый, яблоки 1кг, сыр твёрдый
          </Text>
        </GlassCard>

        <GlassCard padding={0}>
          {[
            { icon: 'calendar-outline' as const, label: 'Срок', value: '12 июня 2026' },
            { icon: 'person-outline' as const, label: 'Назначено', value: 'Мама' },
            { icon: 'pencil-outline' as const, label: 'Создал', value: 'Папа' },
          ].map(({ icon, label, value }, idx, arr) => (
            <View key={label} style={[styles.metaRow, idx < arr.length - 1 && styles.metaBorder]}>
              <View style={styles.metaIcon}>
                <Ionicons name={icon} size={17} color={Colors.accent} />
              </View>
              <Text style={styles.metaLabel}>{label}</Text>
              <Text style={styles.metaValue}>{value}</Text>
            </View>
          ))}
        </GlassCard>

        <GlassButton title="Отметить выполненным" icon="checkmark" onPress={() => router.back()} />
        <GlassButton title="Удалить" icon="trash-outline" variant="danger" onPress={() => router.back()} />
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
  content: { padding: Spacing.screenPadding, paddingTop: 8, gap: 12 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statusBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontSize: 13, color: Colors.accent, fontWeight: '500' },
  repeatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  repeatText: { fontSize: 13, color: Colors.warning, fontWeight: '500' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  description: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  metaBorder: { borderBottomWidth: 1, borderBottomColor: Colors.glassDivider },
  metaIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary },
  metaValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
});
