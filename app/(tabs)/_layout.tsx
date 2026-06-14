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
  null, // центральная кнопка +
  { name: 'shopping', icon: 'cart-outline', iconActive: 'cart', label: 'Покупки' },
  { name: 'family', icon: 'people-outline', iconActive: 'people', label: 'Семья' },
];

const FAB_ACTIONS: { icon: IconName; label: string; route: string }[] = [
  { icon: 'checkmark-circle-outline', label: 'Добавить дело', route: '/task/new' },
  { icon: 'bag-add-outline', label: 'Добавить товар', route: '/shopping/new-item' },
  { icon: 'list-outline', label: 'Создать список покупок', route: '/shopping/new-list' },
];

// Минимальный тип пропсов таб-бара (не тянем @react-navigation/bottom-tabs напрямую)
interface TabBarProps {
  state: { index: number; routes: { name: string; key: string }[] };
  navigation: { navigate: (name: string) => void };
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
            <BlurView intensity={40} tint="dark" style={styles.pillBlur}>
              <View style={styles.pillHighlight} />
              {TABS.map((tab) => {
                if (!tab) {
                  return (
                    <Pressable
                      key="fab"
                      style={({ pressed }) => [styles.fabWrapper, pressed && styles.fabPressed]}
                      onPress={() => setFabOpen((v) => !v)}
                    >
                      <LinearGradient
                        colors={Colors.accentGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.fab}
                      >
                        <Ionicons name={fabOpen ? 'close' : 'add'} size={30} color="#fff" />
                      </LinearGradient>
                    </Pressable>
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
                    activeOpacity={0.6}
                  >
                    <Ionicons
                      name={isFocused ? tab.iconActive : tab.icon}
                      size={24}
                      color={isFocused ? Colors.tabBarActive : Colors.tabBarInactive}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        {
                          color: isFocused ? Colors.tabBarActive : Colors.tabBarInactive,
                          fontWeight: isFocused ? '600' : '500',
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </BlurView>
          ) : (
          <LinearGradient
            colors={['rgba(40, 16, 6, 0.45)', 'rgba(20, 8, 3, 0.55)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.pill}
          >
            <View style={styles.pillHighlight} />
            {TABS.map((tab) => {
              if (!tab) {
                return (
                  <Pressable
                    key="fab"
                    style={({ pressed }) => [styles.fabWrapper, pressed && styles.fabPressed]}
                    onPress={() => setFabOpen((v) => !v)}
                  >
                    <LinearGradient
                      colors={Colors.accentGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.fab}
                    >
                      <Ionicons name={fabOpen ? 'close' : 'add'} size={30} color="#fff" />
                    </LinearGradient>
                  </Pressable>
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
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name={isFocused ? tab.iconActive : tab.icon}
                    size={24}
                    color={isFocused ? Colors.tabBarActive : Colors.tabBarInactive}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isFocused ? Colors.tabBarActive : Colors.tabBarInactive,
                        fontWeight: isFocused ? '600' : '500',
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </LinearGradient>
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
    paddingHorizontal: 16,
    paddingTop: 6,
    backgroundColor: 'transparent',
  },
  pillShadow: {
    borderRadius: 34,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.65,
    shadowRadius: 28,
    elevation: 14,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 34,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 140, 60, 0.35)',
    overflow: 'hidden',
  },
  pillBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 34,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 100, 0.30)',
    overflow: 'hidden',
  },
  pillHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 180, 80, 0.45)',
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: 2 },
  tabLabel: { fontSize: 10, letterSpacing: -0.1 },
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -34,
  },
  fabPressed: { transform: [{ scale: 0.94 }] },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  fabOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 8, 20, 0.55)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  fabMenu: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(40, 35, 65, 0.97)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    padding: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.60,
    shadowRadius: 28,
    elevation: 12,
  },
  fabMenuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  fabMenuDivider: { borderBottomWidth: 1, borderBottomColor: Colors.glassDivider },
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
