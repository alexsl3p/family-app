# Family OS — контекст для агента

Спецификация проекта: `docs/00_mvp.md` (текущая задача — только v0.1).
`docs/10_inventory.md` и `docs/20_stats.md` — не трогать до DoD v0.1.

## Стек
React Native · Expo · TypeScript · Expo Router · Supabase (Auth/Postgres/Realtime/RLS)
TanStack Query (+ AsyncStorage persister) · Zustand (только UI) · React Hook Form + Zod

## Жёсткие правила
- Supabase никогда не вызывать из UI-компонентов напрямую — только через `features/*/*.api.ts`.
- `service_role` ключ никогда не в мобильном приложении.
- Каждая фича: `api.ts` + `hooks.ts` + `types.ts`.
- Не добавлять фичи вне `00_mvp.md` (нет инвентаря, чата, финансов, AI, категорий, ролей).
- Нейминг: `familyId`, `userId`, `taskId`, `listId`, `itemId`.

## Сборка
Dev build через EAS с первого дня — Google Sign-In не работает в Expo Go.
`npx eas build --profile development --platform android`
