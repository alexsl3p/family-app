import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { AvatarBubble } from '@/components/ui/AvatarBubble';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

const MOCK_MEMBERS: Record<string, { id: string; name: string; email: string; color: string; isCreator: boolean; tasks: number; done: number }> = {
  '1': { id: '1', name: 'Алексей', email: 'alex@example.com', color: '#9490B8', isCreator: true, tasks: 5, done: 3 },
  '2': { id: '2', name: 'Мария', email: 'maria@example.com', color: '#EC4899', isCreator: false, tasks: 4, done: 4 },
  '3': { id: '3', name: 'Дима', email: 'dima@example.com', color: '#4ADE80', isCreator: false, tasks: 2, done: 1 },
  '4': { id: '4', name: 'Катя', email: 'katya@example.com', color: '#FBBF24', isCreator: false, tasks: 3, done: 2 },
};

export default function MemberProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const member = MOCK_MEMBERS[id ?? '1'];

  if (!member) {
    return (
      <ScreenBackground>
        <View style={styles.center}>
          <Text style={styles.notFound}>Участник не найден</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Назад</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  const progress = member.tasks > 0 ? member.done / member.tasks : 0;

  return (
    <ScreenBackground>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Профиль</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar & Name */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <AvatarBubble name={member.name} color={member.color} size={88} />
            {member.isCreator && (
              <View style={styles.crownBadge}>
                <Ionicons name="star" size={13} color={Colors.warning} />
              </View>
            )}
          </View>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberEmail}>{member.email}</Text>
          {member.isCreator && (
            <View style={styles.rolePill}>
              <Text style={styles.roleText}>Создатель семьи</Text>
            </View>
          )}
        </GlassCard>

        {/* Stats */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard} padding={16}>
            <Text style={styles.statNum}>{member.tasks}</Text>
            <Text style={styles.statLabel}>Всего дел</Text>
          </GlassCard>
          <GlassCard style={styles.statCard} padding={16}>
            <Text style={[styles.statNum, { color: Colors.success }]}>{member.done}</Text>
            <Text style={styles.statLabel}>Выполнено</Text>
          </GlassCard>
          <GlassCard style={styles.statCard} padding={16}>
            <Text style={[styles.statNum, { color: Colors.accentBright }]}>
              {Math.round(progress * 100)}%
            </Text>
            <Text style={styles.statLabel}>Прогресс</Text>
          </GlassCard>
        </View>

        {/* Progress bar */}
        <GlassCard>
          <Text style={styles.progressLabel}>Выполнение задач</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as any }]} />
          </View>
          <Text style={styles.progressHint}>
            {member.done} из {member.tasks} задач завершено
          </Text>
        </GlassCard>

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
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  backIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  content: { padding: Spacing.screenPadding, paddingTop: 4, gap: 12 },
  profileCard: { alignItems: 'center', paddingVertical: 28 },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  crownBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.warningLight,
    borderWidth: 2,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  memberEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  rolePill: {
    marginTop: 10,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: { fontSize: 13, color: Colors.accentBright, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1 },
  statNum: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.accentBright,
  },
  progressHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { color: Colors.textSecondary, fontSize: 16 },
  backBtn: { marginTop: 16, padding: 12 },
  backBtnText: { color: Colors.accentBright, fontSize: 15 },
});
