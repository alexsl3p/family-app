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

// Стиль взят точно из uiverse.io/narmesh_sah/purple-quail-14:
// .nav-bar:  rgba(255,255,255,0.15)  blur(8px)  border rgba(255,255,255,0.18)  shadow #0d2626
// .nav-icons active: rgba(255,255,255,0.15) bg + translateY(-2px)
function TabItem({
  tab,
  isFocused,
  onPress,
}: {
  tab: { icon: IconName; iconActive: IconName; label: string };
  isFocused: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.navIcon, isFocused && styles.navIconActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isFocused ? tab.iconActive : tab.icon}
        size={22}
        color={isFocused ? '#ffffff' : 'rgba(255,255,255,0.55)'}
        style={isFocused ? styles.iconFloat : undefined}
      />
      <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
}

function NavBarContent({
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
      {/* Световой блик сверху (из оригинала) */}
      <View style={styles.topHighlight} />
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
                <Ionicons name={fabOpen ? 'close' : 'add'} size={26} color="#fff" />
              </LinearGradient>
            </Pressable>
          );
        }
        return (
          <TabItem
            key={tab.name}
            tab={tab}
            isFocused={currentRoute === tab.name}
            onPress={() => {
              setFabOpen(false);
              if (currentRoute !== tab.name) navigation.navigate(tab.name);
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
          {/* FAB меню — тёмное стекло для контраста (как .music у оригинала) */}
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
        <View style={styles.navBar}>
          <NavBarContent
            fabOpen={fabOpen}
            setFabOpen={setFabOpen}
            currentRoute={currentRoute}
            navigation={navigation}
          />
        </View>
      </View>
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // sceneStyle transparent позволяет ScreenBackground заходить под таббар
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="shopping" />
      <Tabs.Screen name="family" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Stitch nav: bg-black/40 backdrop-blur-xl border-t border-white/10 rounded-t-xl
  barArea: {
    paddingHorizontal: 0,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  navShadow: {},
  navBarBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    overflow: 'hidden',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.50)',
    overflow: 'hidden',
  },
  topHighlight: {},
  // Таб-иконка — чистая, без фона
  navIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 16,
    gap: 3,
  },
  // Активный — только цвет иконки меняется, без фона
  navIconActive: {},
  iconFloat: {
    transform: [{ translateY: -1 }],
  },
  tabLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0,
  },
  tabLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
  },
  fabPressed: { transform: [{ scale: 0.92 }] },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
  },
  fabOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(5, 3, 10, 0.65)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  // FAB меню — как .music из оригинала: rgba(149,0,255,0.25) но у нас тёмное для читаемости
  fabMenu: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    padding: 6,
    shadowColor: '#0d2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 14,
  },
  fabMenuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  fabMenuDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.10)' },
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
