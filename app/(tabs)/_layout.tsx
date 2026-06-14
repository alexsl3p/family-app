import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: ({ name: string; icon: IconName; iconActive: IconName; label: string } | null)[] = [
  { name: 'index', icon: 'home-outline', iconActive: 'home', label: 'Главная' },
  { name: 'tasks', icon: 'checkmark-circle-outline', iconActive: 'checkmark-circle', label: 'Дела' },
  null,
  { name: 'shopping', icon: 'cart-outline', iconActive: 'cart', label: 'Покупки' },
  { name: 'family', icon: 'people-outline', iconActive: 'people', label: 'Семья' },
];

const FAB_ACTIONS: { icon: IconName; label: string; route: string }[] = [
  { icon: 'checkmark-circle-outline', label: 'Добавить дело', route: '/task/new' },
  { icon: 'bag-add-outline', label: 'Добавить товар', route: '/shopping/new-item' },
  { icon: 'list-outline', label: 'Создать список покупок', route: '/shopping/new-list' },
];

interface TabBarProps {
  state: { index: number; routes: { name: string; key: string }[] };
  navigation: { navigate: (name: string) => void };
}

function TabItem({
  tab,
  isFocused,
  onPress,
}: {
  tab: { name: string; icon: IconName; iconActive: IconName; label: string };
  isFocused: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.tabIconWrapper}>
        {/* Glow blob за активным иконкой — ключевой эффект uiverse glassmorphism */}
        {isFocused && <View style={styles.activeGlow} />}
        <Ionicons
          name={isFocused ? tab.iconActive : tab.icon}
          size={22}
          color={isFocused ? Colors.tabBarActive : Colors.tabBarInactive}
          style={isFocused ? styles.activeIcon : undefined}
        />
      </View>
      <Text
        style={[
          styles.tabLabel,
          { color: isFocused ? Colors.tabBarActive : Colors.tabBarInactive },
          isFocused && styles.tabLabelActive,
        ]}
      >
        {tab.label}
      </Text>
      {/* Маленькая точка-индикатор под активным табом */}
      {isFocused && <View style={styles.activeDot} />}
    </TouchableOpacity>
  );
}

function TabsRow({
  fabOpen,
  setFabOpen,
  currentRoute,
  navigation,
}: {
  fabOpen: boolean;
  setFabOpen: (v: boolean) => void;
  currentRoute: string;
  navigation: { navigate: (name: string) => void };
}) {
  return (
    <>
      <View style={styles.pillHighlight} />
      {TABS.map((tab) => {
        if (!tab) {
          return (
            <Pressable
              key="fab"
              style={({ pressed }) => [styles.fabWrapper, pressed && styles.fabPressed]}
              onPress={() => setFabOpen(!fabOpen)}
            >
              <LinearGradient
                colors={Colors.accentGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fab}
              >
                <Ionicons name={fabOpen ? 'close' : 'add'} size={28} color="#fff" />
              </LinearGradient>
            </Pressable>
          );
        }
        const isFocused = currentRoute === tab.name;
        return (
          <TabItem
            key={tab.name}
            tab={tab}
            isFocused={isFocused}
            onPress={() => {
              setFabOpen(false);
              if (!isFocused) navigation.navigate(tab.name);
            }}
          />
        );
      })}
    </>
  );
}

function CustomTabBar({ state, navigation }: TabBarProps) {
  const [fabOpen, setFabOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index]?.name;

  return (
    <>
      {fabOpen && (
        <Pressable style={styles.fabOverlay} onPress={() => setFabOpen(false)}>
          <View style={[styles.fabMenu, { marginBottom: 110 + insets.bottom }]}>
            {FAB_ACTIONS.map((action, idx) => (
              <TouchableOpacity
                key={action.route}
                style={[styles.fabMenuItem, idx < FAB_ACTIONS.length - 1 && styles.fabMenuDivider]}
                onPress={() => {
                  setFabOpen(false);
                  router.push(action.route as never);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.fabMenuIcon}>
                  <Ionicons name={action.icon} size={20} color={Colors.accent} />
                </View>
                <Text style={styles.fabMenuText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      )}

      <View style={[styles.barArea, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.pillShadow}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={38} tint="dark" style={styles.pillBlur}>
              <TabsRow
                fabOpen={fabOpen}
                setFabOpen={setFabOpen}
                currentRoute={currentRoute}
                navigation={navigation}
              />
            </BlurView>
          ) : (
            <View style={styles.pill}>
              <TabsRow
                fabOpen={fabOpen}
                setFabOpen={setFabOpen}
                currentRoute={currentRoute}
                navigation={navigation}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="shopping" />
      <Tabs.Screen name="family" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barArea: {
    paddingHorizontal: 20,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  pillShadow: {
    borderRadius: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.55,
    shadowRadius: 32,
    elevation: 16,
  },
  // iOS: BlurView (настоящий frosted glass)
  pillBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 36,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
  },
  // Android: полупрозрачное серое стекло
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 36,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(30, 28, 36, 0.52)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  // Верхний световой блик — тонкая линия преломления (стиль uiverse)
  pillHighlight: {
    position: 'absolute',
    top: 0,
    left: 30,
    right: 30,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  // Таб-элемент
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  tabIconWrapper: {
    width: 40,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Glow blob за иконкой — главный эффект uiverse glassmorphism navigation
  // iOS: shadowRadius создаёт настоящее свечение
  // Android: полупрозрачный кружок имитирует glow
  activeGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    opacity: Platform.OS === 'ios' ? 0.22 : 0.18,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 18,
  },
  activeIcon: {
    transform: [{ translateY: -1 }],
  },
  tabLabel: { fontSize: 10, letterSpacing: -0.1 },
  tabLabelActive: { fontWeight: '600' },
  // Маленькая точка под активным табом
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.tabBarActive,
    shadowColor: Colors.tabBarActive,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  fabPressed: { transform: [{ scale: 0.93 }] },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.90)',
  },
  fabOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8, 5, 15, 0.60)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  fabMenu: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(22, 18, 30, 0.96)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.70,
    shadowRadius: 32,
    elevation: 14,
  },
  fabMenuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  fabMenuDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  fabMenuIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabMenuText: { fontSize: 16, color: Colors.textPrimary, fontWeight: '500', letterSpacing: -0.2, flex: 1 },
});
