import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

// Минимальный тип пропсов таб-бара (не тянем @react-navigation/bottom-tabs напрямую)
interface TabBarProps {
  state: { index: number; routes: { name: string; key: string }[] };
  navigation: { navigate: (name: string) => void };
}

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: ({ name: string; icon: IconName; iconActive: IconName; label: string } | null)[] = [
  { name: 'index', icon: 'home-outline', iconActive: 'home', label: 'Главная' },
  { name: 'tasks', icon: 'checkmark-circle-outline', iconActive: 'checkmark-circle', label: 'Дела' },
  null, // центральная кнопка +
  { name: 'shopping', icon: 'cart-outline', iconActive: 'cart', label: 'Покупки' },
  { name: 'family', icon: 'people-outline', iconActive: 'people', label: 'Семья' },
];

const FAB_ACTIONS: { icon: IconName; label: string; route: string }[] = [
  { icon: 'checkmark-circle-outline', label: 'Добавить дело', route: '/task/new' },
  { icon: 'bag-add-outline', label: 'Добавить товар', route: '/shopping/new-item' },
  { icon: 'list-outline', label: 'Создать список покупок', route: '/shopping/new-list' },
];

function CustomTabBar({ state, navigation }: TabBarProps) {
  const [fabOpen, setFabOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index]?.name;

  const BarWrapper = Platform.OS === 'ios' ? BlurView : View;
  const barProps = Platform.OS === 'ios' ? { intensity: 60, tint: 'extraLight' as const } : {};

  return (
    <>
      {fabOpen && (
        <Pressable style={styles.fabOverlay} onPress={() => setFabOpen(false)}>
          <View style={[styles.fabMenu, { marginBottom: 96 + insets.bottom }]}>
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

      <BarWrapper {...barProps} style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {TABS.map((tab) => {
          if (!tab) {
            return (
              <TouchableOpacity
                key="fab"
                style={styles.fabWrapper}
                onPress={() => setFabOpen((v) => !v)}
                activeOpacity={0.8}
              >
                <View style={styles.fab}>
                  <Ionicons name={fabOpen ? 'close' : 'add'} size={30} color="#fff" />
                </View>
              </TouchableOpacity>
            );
          }
          const isFocused = currentRoute === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => {
                setFabOpen(false);
                if (!isFocused) navigation.navigate(tab.name);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFocused ? tab.iconActive : tab.icon}
                size={24}
                color={isFocused ? Colors.tabBarActive : Colors.tabBarInactive}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? Colors.tabBarActive : Colors.tabBarInactive },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BarWrapper>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.5)' : Colors.tabBar,
    borderTopWidth: 1.5,
    borderTopColor: Colors.tabBarBorder,
    paddingTop: 8,
    paddingHorizontal: 8,
    shadowColor: 'rgba(100, 160, 210, 0.3)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 4 },
  tabLabel: { fontSize: 10, fontWeight: '500' },
  fabWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -32 },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.fabBackground,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.fabShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  fabOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 40, 60, 0.25)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  fabMenu: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.glassBorder,
    padding: 6,
    shadowColor: 'rgba(0, 0, 0, 0.18)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10,
  },
  fabMenuItem: { flexDirection: 'row', alignItems: 'center', padding: 13, gap: 12 },
  fabMenuDivider: { borderBottomWidth: 1, borderBottomColor: Colors.glassDivider },
  fabMenuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabMenuText: { fontSize: 16, color: Colors.textPrimary, fontWeight: '500' },
});
