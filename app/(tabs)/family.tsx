import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUIStore } from '@/store/uiStore';
import { useScheduleStore } from '@/store/scheduleStore';
import { getCurrentStatus } from '@/lib/scheduleUtils';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { AvatarBubble } from '@/components/ui/AvatarBubble';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/radius';

const MOCK_MEMBERS = [
  { id: '1', name: 'Мама',   color: '#FF7849', isCreator: true  },
  { id: '2', name: 'Папа',   color: '#60A5FA', isCreator: false },
  { id: '3', name: 'Лёня',   color: '#4ADE80', isCreator: false },
  { id: '4', name: 'Маша',   color: '#C084FC', isCreator: false },
];

const INVITE_CODE = 'A7K9Q2PM';

function MemberRow({ member }: { member: typeof MOCK_MEMBERS[number] }) {
  const schedules = useScheduleStore((s) => s.schedules);
  const slots = schedules[member.id] ?? [];
  const status = getCurrentStatus(slots) ?? 'Дома';
  const isHome = status === 'Дома';

  return (
    <View style={styles.memberItem}>
      <AvatarBubble name={member.name} color={member.color} size={44} />
      <View style={styles.memberBody}>
        <View style={styles.memberNameRow}>
          <Text style={styles.memberName}>{member.name}</Text>
          {member.isCreator && (
            <View style={styles.roleBadge}>
              <Ionicons name="star" size={10} color={Colors.warning} />
            </View>
          )}
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: isHome ? Colors.textMuted : Colors.success }]} />
          <Text style={[styles.memberStatus, !isHome && { color: Colors.success }]}>{status}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.scheduleBtn}
        onPress={() =>
          router.push({
            pathname: '/family/schedule',
            params: { memberId: member.id, memberName: member.name },
          } as never)
        }
        activeOpacity={0.7}
      >
        <Ionicons name="calendar-outline" size={16} color={Colors.accent} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push(`/family/${member.id}` as never)}
        activeOpacity={0.7}
        style={styles.chevronBtn}
      >
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

export default function FamilyScreen() {
  const logout = useUIStore((s) => s.logout);

  return (
    <ScreenBackground>
      <ScreenHeader title="Семья" subtitle="Family OS" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Family card */}
        <GlassCard style={styles.familyCard}>
          <View style={styles.familyAvatars}>
            {MOCK_MEMBERS.slice(0, 4).map((m, i) => (
              <View key={m.id} style={[styles.familyAvatar, i > 0 && { marginLeft: -12 }]}>
                <AvatarBubble name={m.name} color={m.color} size={48} />
              </View>
            ))}
          </View>
          <Text style={styles.familyName}>Наша семья</Text>
          <Text style={styles.familySubtitle}>{MOCK_MEMBERS.length} участника</Text>
        </GlassCard>

        {/* Invite code */}
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

        {/* Members with schedule/status */}
        <Text style={styles.sectionTitle}>Участники</Text>
        <GlassCard padding={0}>
          {MOCK_MEMBERS.map((member, idx) => (
            <View
              key={member.id}
              style={idx < MOCK_MEMBERS.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.glassDivider }}
            >
              <MemberRow member={member} />
            </View>
          ))}
        </GlassCard>

        <TouchableOpacity
          style={styles.leaveBtn}
          onPress={() => { logout(); router.replace('/'); }}
          activeOpacity={0.7}
        >
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
  familyAvatar: { borderRadius: 26, borderWidth: 2, borderColor: '#fff' },
  familyName: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  familySubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  inviteLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 8, fontWeight: '600', letterSpacing: 0.8 },
  inviteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  inviteCode: { fontSize: 26, fontWeight: '700', color: Colors.accent, letterSpacing: 4 },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accentLight, paddingHorizontal: 13, paddingVertical: 8, borderRadius: Radius.full,
  },
  copyBtnText: { fontSize: 13, fontWeight: '600', color: Colors.accent },
  inviteHint: { fontSize: 12, color: Colors.textMuted },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 },
  memberItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  memberBody: { flex: 1 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  memberName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  roleBadge: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.warningLight, alignItems: 'center', justifyContent: 'center',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  memberStatus: { fontSize: 12, color: Colors.textSecondary },
  scheduleBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center',
  },
  chevronBtn: { width: 28, alignItems: 'center', justifyContent: 'center' },
  leaveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14,
  },
  leaveText: { fontSize: 15, color: Colors.error, fontWeight: '500' },
});
