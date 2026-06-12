# Family OS — Статистика и прогноз (v0.4)

Открывать агенту только после DoD инвентаря. Работает поверх `10_inventory.md`.

## Метрики

```
1.  Часто покупаемые товары
2.  Самые регулярные (стабильный интервал)
3.  Что заканчивается (qty ≤ min)
4.  Что скоро испортится (expires ≤ +3 дня)
5.  Что давно не проверяли
6.  Средний расход товара
7.  Средний интервал между покупками
8.  Примерная трата по повторяющимся товарам
9.  Сколько товаров сейчас дома
10. Что чаще всего забывают купить
```

Экран: `app/stats/index.tsx`
Компоненты: `StatCard · FrequentProductsList · LowStockList · ExpiringSoonList`

---

## Правила статусов

**Repeat score:**
```
repeat_score = (покупок за 90 дней) × 0.6 + (регулярность интервала) × 0.4
MVP-упрощение: 3+ покупки за 90 дней → повторяющийся товар.
```

**Low stock:** `quantity ≤ min_quantity` → «Заканчивается»; `quantity = 0` → «Закончилось».

**Expiring soon:** `expires_at ≤ today + 3 days` → «Скоро истекает срок».

**Restock suggestion:** повторяющийся товар и
`days_since_last_purchase ≥ avg_purchase_interval_days` → «Пора купить снова».

---

## SQL views (security_invoker = true — обязательно)

По умолчанию view в Postgres/Supabase исполняется с правами владельца и обходит RLS.
`security_invoker = true` заставляет view работать с правами вызывающего пользователя,
и RLS базовых таблиц применяется корректно.

```sql
-- Часто покупаемые за 90 дней
create or replace view public.v_frequent_products_90d
with (security_invoker = true) as
select
  ie.family_id,
  ie.product_id,
  count(*)                     as purchase_count,
  sum(coalesce(ie.price, 0))   as total_spent,
  max(ie.event_at)             as last_purchased_at
from public.inventory_events ie
where ie.event_type = 'purchase'
  and ie.event_at >= now() - interval '90 days'
group by ie.family_id, ie.product_id;

-- Статус запасов
create or replace view public.v_inventory_status
with (security_invoker = true) as
select
  ii.family_id,
  ii.id       as inventory_item_id,
  ii.product_id,
  ii.quantity,
  ii.min_quantity,
  ii.target_quantity,
  ii.expires_at,
  case
    when ii.quantity <= 0 then 'out'
    when ii.min_quantity is not null
         and ii.quantity <= ii.min_quantity then 'low'
    when ii.expires_at is not null
         and ii.expires_at <= current_date + interval '3 days' then 'expiring'
    else 'ok'
  end as status
from public.inventory_items ii
where ii.is_active = true;

-- Средний интервал между покупками (для restock suggestion)
create or replace view public.v_purchase_cadence
with (security_invoker = true) as
select
  ie.family_id,
  ie.product_id,
  count(*)              as purchases,
  max(ie.event_at)      as last_purchased_at,
  case when count(*) > 1
    then extract(epoch from (max(ie.event_at) - min(ie.event_at)))
         / nullif(count(*) - 1, 0) / 86400.0
  end                   as avg_interval_days
from public.inventory_events ie
where ie.event_type = 'purchase'
group by ie.family_id, ie.product_id;
```

---

## v0.4 scope

```
Часто покупаемые · повторяющиеся · средний интервал · расход за месяц
Что заканчивается · что скоро истечёт · что пора купить снова
Автосборка списка покупок из «заканчивающегося»
```

---

## Промпт агенту

```
Реализовать features/stats и app/stats/index.tsx поверх инвентаря.
Использовать views v_frequent_products_90d, v_inventory_status, v_purchase_cadence.
Блоки: часто покупаемые, заканчивается, скоро истекает, повторяющиеся,
расход за месяц, пора купить снова.
Добавить «Собрать список из заканчивающегося» → новый shopping_list.
Без AI: только пороговая логика из правил выше.
Realtime invalidate по inventory_events и inventory_items.
```
