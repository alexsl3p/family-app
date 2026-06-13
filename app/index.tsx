import { Redirect } from 'expo-router';
import { useUIStore } from '@/store/uiStore';

export default function Index() {
  const hasCompletedOnboarding = useUIStore((s) => s.hasCompletedOnboarding);
  if (hasCompletedOnboarding) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/welcome" />;
}
