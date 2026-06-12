# Family OS — Inventory (v0.2–v0.3)

Открывать агенту только после DoD v0.1. Работает поверх MVP, не ломая его.

## Три сущности

```
Product       = карточка товара (название, бренд, штрихкод, фото, ссылка)
InventoryItem = остаток дома (кол-во, место, min/target, срок годности)
ShoppingItem  = что купить (из MVP + product_id начиная с v0.2)
```

## Стратегия версий

```
v0.2 — repeat-слой: product_id в shopping_items, карточка продукта, фото, ссылка,
       штрихкод вручную, «купить снова», список часто покупаемых.
       mark_shopping_item_checked расширяется → пишет inventory_event purchase.
v0.3 — полный инвентарь: локации, остатки, min/target, срок, сканер,
       Supabase Storage для фото, очередь офлайн-синка.
```

---

## Источники данных

1. **Barcode / EAN / GTIN** — главный идентификатор. Хранить: `barcode, gtin, brand, name, package_size, image_url, product_url, source`.
2. **Open Food Facts** — для еды. Для бытовой химии и локальных эстонских брендов (Rimi, Selver) покрытие хуже — всегда оставлять ручную правку. API: https://openfoodfacts.github.io/openfoodfacts-server/api/
3. **GS1 Digital Link** — ориентир на будущее. В MVP: просто правильно хранить GTIN. https://www.gs1.org/standards/gs1-digital-link
4. **Семейный каталог** — главное. Купил 3+ раза → повторяющийся товар → «купить снова».

---

## Функция «Сканировать и сохранить»

Кнопка `+` (с инвентарём):
```
Добавить дело · Добавить товар · Создать список покупок · Сканировать продукт
```

Сценарий:
```
Сканировать → barcode → найти в products семьи → если есть: открыть карточку →
если нет: Open Food Facts (еда) → если ничего: форма вручную → сохранить → realtime.
```

Barcode нормализовать перед сохранением (убрать пробелы, дефисы, trim):
```sql
create unique index unique_product_barcode_per_family
on public.products(family_id, barcode_normalized)
where barcode_normalized is not null;
```
Поле `barcode_normalized` — всегда trim + upper + убрать дефисы/пробелы при записи.

После отметки «куплено» (если есть product_id):
```
→ «Добавить в инвентарь?» / «Обновить остаток?» / «Просто отметить»
```

---

## Схема (новые таблицы)

```sql
-- 9. Products — семейный каталог реально покупаемых товаров
create table if not exists public.products (
  id                 uuid primary key default gen_random_uuid(),
  family_id          uuid not null references public.families(id) on delete cascade,
  name               text not null,
  brand              text,
  barcode            text,
  barcode_normalized text,  -- trim+upper+без дефисов, для unique index
  gtin               text,
  package_size       text,
  default_unit       text,
  product_type       text not null default 'other'
    check (product_type in ('food','household_consumable','household_item','other')),
  image_url          text,
  product_url        text,
  notes              text,
  source             text,
  created_by         uuid not null references public.profiles(id) on delete cascade,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create unique index unique_product_barcode_per_family
on public.products(family_id, barcode_normalized)
where barcode_normalized is not null;

-- 10. Inventory locations
create table if not exists public.inventory_locations (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references public.families(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

-- 11. Inventory items — остаток дома
create table if not exists public.inventory_items (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.families(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  location_id uuid references public.inventory_locations(id) on delete set null,
  quantity    numeric(10,2) not null default 0,
  unit        text,
  min_quantity    numeric(10,2),
  target_quantity numeric(10,2),
  expires_at  date,
  is_active   boolean not null default true,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- composite FK: location и item должны принадлежать одной семье
  unique(id, family_id)
);

-- 12. Inventory events — история покупок / расхода / корректировок
create table if not exists public.inventory_events (
  id                uuid primary key default gen_random_uuid(),
  family_id         uuid not null references public.families(id) on delete cascade,
  product_id        uuid not null references public.products(id) on delete cascade,
  inventory_item_id uuid references public.inventory_items(id) on delete set null,
  event_type        text not null check (event_type in ('purchase','consume','adjust')),
  quantity          numeric(10,2),
  price             numeric(10,2),
  event_at          timestamptz not null default now(),
  created_by        uuid references public.profiles(id) on delete set null
);

-- Расширение shopping_items (v0.2 миграция)
alter table public.shopping_items
  add column if not exists product_id uuid references public.products(id) on delete set null,
  add column if not exists source_inventory_item_id uuid references public.inventory_items(id) on delete set null;
```

RLS на новых таблицах — та же модель, что в `00_mvp.md` (раздел 7): read/write через
`is_family_member(family_id)`. Каждая таблица имеет `family_id`.

Триггер `set_updated_at` — навесить на `products` и `inventory_items` при создании.

Realtime включить для: `products`, `inventory_locations`, `inventory_items`, `inventory_events`.

---

## Расширение mark_shopping_item_checked (v0.2)

Когда в shopping_items появился `product_id`, дополнить RPC (из `00_mvp.md` раздел 8.8):

```sql
-- добавить внутрь ветки if p_checked then, после update:
if item.product_id is not null then
  insert into public.inventory_events
    (family_id, product_id, event_type, created_by)
  values
    (item.family_id, item.product_id, 'purchase', auth.uid());
end if;
```

Это и есть источник данных для статистики в `20_stats.md`. Без этого `inventory_events`
будет пустым даже при активных покупках.

---

## Экраны и компоненты

```
app/inventory/index.tsx        внутри «Покупок»: [Списки][Инвентарь]
app/inventory/locations.tsx    Кухня/Холодильник/Морозилка/Кладовка/Ванная/Аптечка/Гараж/Дача
app/inventory/new.tsx          продукт, локация, кол-во, min/target, срок, заметка
app/product/[id].tsx           карточка: фото, название, бренд, штрихкод, ссылка,
                               где лежит, остаток, история, «В покупки»
app/product/new.tsx            поля: name*, brand, barcode, package_size, type, unit, notes
app/scanner/barcode.tsx        expo-camera CameraView → barcode → продукт/форма
app/products/index.tsx         поиск, фильтр по типу, сортировка

components/inventory/  InventoryItemCard · InventoryLocationCard · InventoryStatusBadge
                       StockLevelBar · ExpirationBadge
components/products/   ProductCard · ProductImage · ProductForm · BarcodeBadge
features/products/  ·  features/inventory/  ·  features/scanner/  (api/hooks/types/validators)
```

Нижнее меню не трогать: инвентарь живёт внутри «Покупок».

---

## DoD инвентаря

```
1.  Создать продукт вручную + фото + ссылка.
2.  Добавить в инвентарь: локация, кол-во, min/target, срок годности.
3.  Сканировать barcode; повторный скан открывает существующую карточку (не дубль).
4.  Сканирование нового → Open Food Facts (еда) → иначе ручная форма.
5.  Из инвентаря в покупки; при «куплено» → предложить обновить инвентарь.
6.  mark_shopping_item_checked пишет inventory_event purchase при наличии product_id.
7.  Статусы: «Заканчивается» (qty ≤ min), «Закончилось» (qty = 0), «Скоро истекает» (+3 дня).
8.  Всё синхронно; RLS не пускает в чужой инвентарь.
```
