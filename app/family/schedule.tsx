import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useScheduleStore, ScheduleSlot } from '@/store/scheduleStore';
import { DAY_NAMES, SCHEDULE_PRESETS, getCurrentStatus } from '@/lib/scheduleUtils';

type PresetType = typeof SCHEDULE_PRESETS[number]['type'];

function parseMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function TimeStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const minutes = parseMinutes(value);
  const step = 15;
  return (
    <View style={ts.timeBlock}>
      <Text style={ts.timeLabel}>{label}</Text>
      <View style={ts.timeRow}>
        <TouchableOpacity
          style={ts.timeBtn}
          onPress={() => onChange(formatTime(Math.max(0, minutes - step)))}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={ts.timeValue}>{value}</Text>
        <TouchableOpacity
          style={ts.timeBtn}
          onPress={() => onChange(formatTime(Math.min(23 * 60 + 45, minutes + step)))}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ts = StyleSheet.create({
  timeBlock: { flex: 1, alignItems: 'center' },
  timeLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 6, fontWeight: '600', letterSpacing: 0.5 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  timeValue: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, minWidth: 60, textAlign: 'center' },
});

export default function ScheduleScreen() {
  const { memberId, memberName } = useLocalSearchParams<{ memberId: string; memberName: string }>();
  const { schedules, addSlot, removeSlot } = useScheduleStore();
  const slots = schedules[memberId ?? ''] ?? [];

  const [adding, setAdding] = useState(false);
  const [selectedType, setSelectedType] = useState<PresetType>('work');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const preset = SCHEDULE_PRESETS.find((p) => p.type === selectedType) ?? SCHEDULE_PRESETS[0];

  const toggleDay = (day: number) => {
    setSelectedDays((d) => d.includes(day) ? d.filter((x) => x !== day) : [...d, day].sort());
  };

  const handleAdd = () => {
    if (selectedDays.length === 0) return;
    const slot: ScheduleSlot = {
      id: Date.now().toString(),
      type: selectedType,
      label: preset.label,
      color: preset.color,
      days: selectedDays,
      startTime,
      endTime,
    };
    addSlot(memberId ?? '', slot);
    setAdding(false);
    setSelectedDays([0, 1, 2, 3, 4]);
    setStartTime('09:00');
    setEndTime('17:00');
  };

  const activeStatus = getCurrentStatus(slots);

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Расписание</Text>
          <Text style={styles.headerSub}>{memberName}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Current status */}
        <GlassCard padding={16}>
          <Text style={styles.sectionLabel}>СЕЙЧАС</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: activeStatus ? Colors.success : Colors.textMuted }]} />
            <Text style={styles.statusText}>
              {activeStatus ?? 'Дома'}
            </Text>
          </View>
        </GlassCard>

        {/* Existing slots */}
        {slots.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Расписание</Text>
            {slots.map((slot) => (
              <GlassCard key={slot.id} padding={14} style={styles.slotCard}>
                <View style={styles.slotHeader}>
                  <View style={[styles.slotBadge, { backgroundColor: `${slot.color}22`, borderColor: `${slot.color}55` }]}>
                    <View style={[styles.slotDot, { backgroundColor: slot.color }]} />
                    <Text style={[styles.slotLabel, { color: slot.color }]}>{slot.label}</Text>
                  </View>
                  <Text style={styles.slotTime}>{slot.startTime} – {slot.endTime}</Text>
                  <TouchableOpacity
                    onPress={() => removeSlot(memberId ?? '', slot.id)}
                    style={styles.deleteBtn}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                <View style={styles.daysRow}>
                  {DAY_NAMES.map((name, i) => (
                    <View
                      key={i}
                      style={[styles.dayChip, slot.days.includes(i) && { backgroundColor: `${slot.color}33`, borderColor: `${slot.color}66` }]}
                    >
                      <Text style={[styles.dayChipText, slot.days.includes(i) && { color: slot.color, fontWeight: '700' }]}>
                        {name}
                      </Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            ))}
          </>
        )}

        {/* Add form */}
        {adding ? (
          <GlassCard padding={16} style={styles.addForm}>
            <Text style={styles.sectionTitle}>Новая запись</Text>

            {/* Type selector */}
            <View style={styles.typeRow}>
              {SCHEDULE_PRESETS.map((p) => (
                <TouchableOpacity
                  key={p.type}
                  style={[styles.typeBtn, selectedType === p.type && { backgroundColor: `${p.color}33`, borderColor: `${p.color}88` }]}
                  onPress={() => setSelectedType(p.type)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={p.icon} size={18} color={selectedType === p.type ? p.color : Colors.textMuted} />
                  <Text style={[styles.typeBtnText, selectedType === p.type && { color: p.color }]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Days */}
            <Text style={styles.fieldLabel}>ДНИ НЕДЕЛИ</Text>
            <View style={styles.daysPickerRow}>
              {DAY_NAMES.map((name, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => toggleDay(i)}
                  activeOpacity={0.7}
                  style={[
                    styles.dayPickerChip,
                    selectedDays.includes(i) && { backgroundColor: `${preset.color}33`, borderColor: `${preset.color}88` },
                  ]}
                >
                  <Text style={[styles.dayPickerText, selectedDays.includes(i) && { color: preset.color, fontWeight: '700' }]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time */}
            <Text style={styles.fieldLabel}>ВРЕМЯ</Text>
            <View style={styles.timeStepperRow}>
              <TimeStepper label="НАЧАЛО" value={startTime} onChange={setStartTime} />
              <View style={styles.timeDash}>
                <Text style={styles.timeDashText}>—</Text>
              </View>
              <TimeStepper label="КОНЕЦ" value={endTime} onChange={setEndTime} />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAdding(false)} activeOpacity={0.7}>
                <Text style={styles.cancelBtnText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: preset.color }]}
                onPress={handleAdd}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>Добавить</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={() => setAdding(true)} activeOpacity={0.8}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.accent} />
            <Text style={styles.addBtnText}>Добавить запись</Text>
          </TouchableOpacity>
        )}

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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  scroll: { flex: 1 },
  content: { padding: Spacing.screenPadding, gap: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  slotCard: {},
  slotHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  slotBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, borderWidth: 1,
  },
  slotDot: { width: 8, height: 8, borderRadius: 4 },
  slotLabel: { fontSize: 13, fontWeight: '600' },
  slotTime: { flex: 1, fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
  deleteBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(248,113,113,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  daysRow: { flexDirection: 'row', gap: 4 },
  dayChip: {
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
  },
  dayChipText: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  addForm: {},
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 10, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  typeBtnText: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, marginBottom: 8 },
  daysPickerRow: { flexDirection: 'row', gap: 5, marginBottom: 18, flexWrap: 'wrap' },
  dayPickerChip: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  dayPickerText: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  timeStepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  timeDash: { alignItems: 'center', justifyContent: 'center', paddingTop: 18 },
  timeDashText: { color: Colors.textMuted, fontSize: 18 },
  formActions: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
  saveBtn: { flex: 2, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  saveBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16,
    borderRadius: 18, borderWidth: 1.5,
    borderColor: `${Colors.accent}55`,
    backgroundColor: Colors.accentLight,
  },
  addBtnText: { fontSize: 15, color: Colors.accent, fontWeight: '600' },
});
