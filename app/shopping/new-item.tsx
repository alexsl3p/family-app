import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/radius';

const UNITS = ['шт', 'кг', 'г', 'л', 'мл', 'уп'];

export default function NewItemScreen() {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('шт');
  const [price, setPrice] = useState('');

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Новый товар</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <GlassCard padding={20}>
          <Text style={styles.fieldLabel}>НАЗВАНИЕ</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Что купить?"
            placeholderTextColor={Colors.textMuted}
            autoFocus
          />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.fieldLabel}>КОЛИЧЕСТВО</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="1"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.fieldLabel}>ЦЕНА (≈ ₽)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>ЕДИНИЦА</Text>
          <View style={styles.unitRow}>
            {UNITS.map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setUnit(u)}
                activeOpacity={0.7}
                style={[styles.unitChip, unit === u && styles.unitChipActive]}
              >
                <Text style={[styles.unitText, unit === u && styles.unitTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        <GlassButton
          title="Добавить товар"
          icon="bag-add-outline"
          onPress={() => router.back()}
          disabled={!title.trim()}
        />
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
  content: { padding: Spacing.screenPadding, paddingTop: 8, gap: 14 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 6,
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.glassBorder,
    padding: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  unitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  unitChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1.5,
    borderColor: Colors.glassBorder,
  },
  unitChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  unitText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  unitTextActive: { color: '#fff' },
});
