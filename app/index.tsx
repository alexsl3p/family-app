import { Redirect } from 'expo-router';

export default function Index() {
  // Auth guard появится после подключения Supabase Auth;
  // пока всегда стартуем с welcome.
  return <Redirect href="/(auth)/welcome" />;
}
