import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

// Мок-данные до подключения Supabase
const MOCK_LISTS = [
  { id: '1', title: 'Продукты', total: 8, checked: 3, preview: ['Молоко 2л', 'Хлеб', 'Яблоки 1кг', 'Сыр'] },
  { id: '2', title: 'Аптека', total: 4, checked: 0, preview: ['Аспирин', 'Витамин C', 'Пластырь'] },
  { id: '3', title: 'Хозтовары', total: 2, checked: 1, preview: ['Лампочки', 'Губки'] },
];

export default function ShoppingScreen() {
  return (
    <ScreenBackground>
      <ScreenHeader
        title="Покупки"
        subtitle={`${MOCK_LISTS.length} списка`}
        rightAction={{ icon: 'add', onPress: () => router.push('/shopping/new-list' as never) }}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_LISTS.length === 0 ? (
          <EmptyState
            icon="cart-outline"
            title="Нет списков"
            description="Нажмите + чтобы создать первый список покупок"
          />
        ) : (
          MOCK_LISTS.map((list) => {
            const done = list.checked === list.total;
            return (
              <TouchableOpacity
                key={list.id}
                onPress={() => router.push(`/shopping/list/${list.id}` as never)}
                activeOpacity={0.7}
              >
                <GlassCard padding={16}>
                  <View style={styles.listHeader}>
                    <View style={styles.listTitleRow}>
                      <View style={styles.listIcon}>
                        <Ionicons name="cart" size={18} color={Colors.accent} />
                      </View>
                      <Text style={styles.listTitle}>{list.title}</Text>
                    </View>
                    <View style={[styles.progressBadge, done && styles.progressBadgeDone]}>
                      <Text style={[styles.progressText, done && styles.progressTextDone]}>
                        {list.checked}/{list.total}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${list.total ? (list.checked / list.total) * 100 : 0}%` },
                        done && styles.progressFillDone,
                      ]}
                    />
                  </View>
                  <View style={styles.itemPreview}>
                    {list.preview.slice(0, 3).map((item) => (
                      <Text key={item} style={styles.previewItem} numberOfLines={1}>
                        • {item}
                      </Text>
                    ))}
                    {list.preview.length > 3 && (
                      <Text style={styles.moreItems}>ещё {list.preview.length - 3}…</Text>
                    )}
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: Spacing.screenPadding, paddingTop: 4, gap: 12, flexGrow: 1 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  listIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary },
  progressBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeDone: { backgroundColor: Colors.successLight },
  progressText: { fontSize: 13, fontWeight: '600', color: Colors.accent },
  progressTextDone: { color: Colors.success },
  progressBar: {
    height: 4,
    backgroundColor: Colors.glassDivider,
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 2 },
  progressFillDone: { backgroundColor: Colors.success },
  itemPreview: { gap: 4 },
  previewItem: { fontSize: 13, color: Colors.textSecondary },
  moreItems: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },
});
