# Family OS — спецификация (v3, финальная перед стартом кода)

**Дата:** 2026-06-12 · **Платформа v0.1:** Android · **Язык:** Русский

## Файлы

| Файл | Когда давать агенту |
|------|---------------------|
| `CLAUDE.md` | Положить в корень репозитория. Агент читает при каждом запуске. |
| `00_mvp.md` | **Сейчас.** Дела + покупки + семья + realtime. Только это для v0.1. |
| `10_inventory.md` | После DoD v0.1 (v0.2–v0.3). Products / Inventory / сканер. |
| `20_stats.md` | После DoD инвентаря (v0.4). Статистика и прогноз. |

**Правило:** в первый промпт — только `00_mvp.md`. Остальное не открывать, пока MVP не готов.

## Roadmap

- **v0.1** — Google-вход, профиль (auto), семья, invite-код, дела (включая повторяющиеся), покупки, realtime, офлайн-чтение, Android build.
- **v0.2** — Edge Function для пуша, phone auth, `product_id` в shopping_items, карточка продукта, «купить снова», mark_shopping_item_checked → inventory_events.
- **v0.3** — полный инвентарь, сканер, Supabase Storage, офлайн-синк с очередью.
- **v0.4** — статистика, прогноз, автосписок.
- **v0.5** — iOS.
- **v1.0** — публичный релиз.

## Что исправлено (все раунды)

**Раунд 1 — баги исходного roadmap:**
1. Дыра в `family_members` INSERT — закрыта, только через RPC.
2. Чтение профилей участников — добавлен helper `shares_family_with` и политика.
3. Пуш убран из v0.1, перенесён в Edge Function v0.2.
4. Повторяющиеся дела — реальная механика roll-forward через RPC `complete_task`.
5. Офлайн-чтение — TanStack Query persist-кеш + оптимистичные апдейты.
6. Дубль строки в промпте сканера — убран.

**Раунд 2 — ревью GPT:**
7. `complete_task` идемпотентен, возвращает `{rolled_forward, new_due_date}` для undo.
8. `is_user_in_family` helper + проверка в `create_task` — нельзя назначить дело чужому.
9. Composite FK: `shopping_items(list_id, family_id)` → `shopping_lists(id, family_id)`.
10. `set_updated_at()` триггер на всех таблицах с `updated_at`.
11. Stats views — `security_invoker = true`, иначе RLS обходится.
12. `mark_shopping_item_checked` RPC — атомарно, в v0.2 расширяется на inventory_events.

**Раунд 3 — дополнительные улучшения:**
13. `handle_new_user` триггер — профиль создаётся автоматически при регистрации.
14. `profiles.active_family_id` — понятие «текущей семьи» для юзера.
15. RPC `leave_family` + `regenerate_invite_code` — жизненный цикл семьи.
16. Кнопка «Очистить купленное» в DoD v0.1 — иначе список зарастает мусором.
17. Google Sign-In требует dev build с первого дня (в Expo Go не работает) — зафиксировано.
18. Undo-снекбар 5 сек для roll-forward задач — отмена до фактического RPC.
19. `uncomplete_task` RPC — undo для обычных (не повторяющихся) задач.
20. `CLAUDE.md` в репозитории — контекст не теряется между сессиями.
