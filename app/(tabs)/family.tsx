import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { AvatarBubble } from '@/components/ui/AvatarBubble';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/radius';

// Мок-данные до подключения Supabase
const MOCK_MEMBERS = [
  { id: '1', name: 'Алексей', email: 'alex@example.com', color: '#4A90D9', isCreator: true },
  { id: '2', name: 'Мария', email: 'maria@example.com', color: '#FF6B9D', isCreator: false },
  { id: '3', name: 'Дима', email: 'dima@example.com', color: '#4ECDC4', isCreator: false },
  { id: '4', name: 'Катя', email: 'katya@example.com', color: '#FF9F40', isCreator: false },
];

const INVITE_CODE = 'A7K9Q2PM';

export default function FamilyScreen() {
  return (
    <ScreenBackground>
      <ScreenHeader title="Семья" subtitle="Ваша Family OS" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={styles.familyCard}>
          <View style={styles.familyAvatars}>
            {MOCK_MEMBERS.slice(0, 4).map((m, i) => (
              <View key={m.id} style={[styles.familyAvatar, { marginLeft: i === 0 ? 0 : -12 }]}>
                <AvatarBubble name={m.name} color={m.color} size={48} />
              </View>
            ))}
          </View>
          <Text style={styles.familyName}>Наша семья</Text>
          <Text style={styles.familySubtitle}>{MOCK_MEMBERS.length} участника</Text>
        </GlassCard>

        <GlassCard padding={16}>
          <Text style={styles.inviteLabel}>КОД ПРИГЛАШЕНИЯ</Text>
          <View style={styles.inviteRow}>
            <Text style={styles.inviteCode}>{INVITE_CODE}</Text>
            <TouchableOpacity style={styles.copyBtn} activeOpacity={0.7}>
              <Ionicons name="copy-outline" size={15} color={Colors.accent} />
              <Text style={styles.copyBtnText}>Копировать</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inviteHint}>Поделитесь кодом, чтобы пригласить в семью</Text>
        </GlassCard>

        <Text style={styles.sectionTitle}>Участники</Text>
        <GlassCard padding={0}>
          {MOCK_MEMBERS.map((member, idx) => (
            <TouchableOpacity
              key={member.id}
              style={[styles.memberItem, idx < MOCK_MEMBERS.length - 1 && styles.memberBorder]}
              onPress={() => router.push(`/family/${member.id}` as never)}
              activeOpacity={0.7}
            >
              <AvatarBubble name={member.name} color={member.color} size={44} />
              <View style={styles.memberBody}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberEmail}>{member.email}</Text>
              </View>
              {member.isCreator && (
                <View style={styles.roleBadge}>
                  <Ionicons name="star" size={11} color={Colors.warning} />
                  <Text style={styles.roleText}>Создатель</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </GlassCard>

        <TouchableOpacity style={styles.leaveBtn} activeOpacity={0.7}>
          <Ionicons name="exit-outline" size={18} color={Colors.error} />
          <Text style={styles.leaveText}>Выйти из семьи</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: Spacing.screenPadding, paddingTop: 4, gap: 12 },
  familyCard: { alignItems: 'center', paddingVertical: 24 },
  familyAvatars: { flexDirection: 'row', marginBottom: 12 },
  familyAvatar: {
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#fff',
  },
  familyName: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  familySubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  inviteLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inviteCode: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 4,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  copyBtnText: { fontSize: 13, fontWeight: '600', color: Colors.accent },
  inviteHint: { fontSize: 12, color: Colors.textMuted },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 },
  memberItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  memberBorder: { borderBottomWidth: 1, borderBottomColor: Colors.glassDivider },
  memberBody: { flex: 1 },
  memberName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  memberEmail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleText: { fontSize: 12, color: Colors.warning, fontWeight: '500' },
  leaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  leaveText: { fontSize: 15, color: Colors.error, fontWeight: '500' },
});
