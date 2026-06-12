import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

// Мок-данные до подключения Supabase
const MOCK_ITEMS = [
  { id: '1', title: 'Молоко 2л', quantity: '2', unit: 'шт', isChecked: false, addedBy: 'Мама', checkedBy: null as string | null },
  { id: '2', title: 'Хлеб белый', quantity: '1', unit: 'шт', isChecked: true, addedBy: 'Папа', checkedBy: 'Мама' as string | null },
  { id: '3', title: 'Яблоки', quantity: '1', unit: 'кг', isChecked: false, addedBy: 'Мама', checkedBy: null as string | null },
  { id: '4', title: 'Сыр твёрдый', quantity: '300', unit: 'г', isChecked: false, addedBy: 'Папа', checkedBy: null as string | null },
  { id: '5', title: 'Йогурт', quantity: '4', unit: 'шт', isChecked: true, addedBy: 'Мама', checkedBy: 'Папа' as string | null },
];

export default function ShoppingListScreen() {
  useLocalSearchParams<{ id: string }>();
  const [items, setItems] = useState(MOCK_ITEMS);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isChecked: !i.isChecked } : i)));
  const clearChecked = () => setItems((prev) => prev.filter((i) => !i.isChecked));

  const unchecked = items.filter((i) => !i.isChecked);
  const checked = items.filter((i) => i.isChecked);
  const progress = items.length ? (checked.length / items.length) * 100 : 0;

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Продукты</Text>
        <TouchableOpacity
          onPress={() => router.push('/shopping/new-item' as never)}
          style={styles.addBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.progress}>
        <Text style={styles.progressText}>
          {checked.length} из {items.length} куплено
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {unchecked.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>НУЖНО КУПИТЬ</Text>
            <GlassCard padding={0}>
              {unchecked.map((item, idx) => (
                <TouchableOpacity key={item.id} onPress={() => toggle(item.id)} activeOpacity={0.7}>
                  <View style={[styles.item, idx < unchecked.length - 1 && styles.itemBorder]}>
                    <View style={styles.checkbox} />
                    <View style={styles.itemBody}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemMeta}>
                        {item.quantity} {item.unit} · добавил(а) {item.addedBy}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </GlassCard>
          </>
        )}

        {checked.length > 0 && (
          <>
            <View style={styles.checkedHeader}>
              <Text style={styles.sectionLabel}>КУПЛЕНО</Text>
              <TouchableOpacity onPress={clearChecked} activeOpacity={0.7} style={styles.clearBtn}>
                <Ionicons name="trash-outline" size={14} color={Colors.error} />
                <Text style={styles.clearText}>Очистить купленное</Text>
              </TouchableOpacity>
            </View>
            <GlassCard padding={0} style={styles.checkedList}>
              {checked.map((item, idx) => (
                <TouchableOpacity key={item.id} onPress={() => toggle(item.id)} activeOpacity={0.7}>
                  <View style={[styles.item, idx < checked.length - 1 && styles.itemBorder]}>
                    <View style={[styles.checkbox, styles.checkboxDone]}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                    <View style={styles.itemBody}>
                      <Text style={[styles.itemTitle, styles.itemTitleDone]}>{item.title}</Text>
                      <Text style={styles.itemMeta}>
                        {item.quantity} {item.unit}
                        {item.checkedBy ? ` · купил(а) ${item.checkedBy}` : ''}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </GlassCard>
          </>
        )}
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.fabShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  progress: { paddingHorizontal: Spacing.screenPadding, paddingBottom: 14 },
  progressText: { fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  progressBar: {
    height: 6,
    backgroundColor: Colors.glassDivider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 3 },
  content: { padding: Spacing.screenPadding, paddingTop: 0, gap: 8 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    paddingVertical: 6,
  },
  checkedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearText: { fontSize: 13, color: Colors.error, fontWeight: '500' },
  checkedList: { opacity: 0.75 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.glassDivider },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  itemTitleDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  itemMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});
