# Family OS — MVP (v0.1)

**Платформа:** Android · **Язык:** Русский · **Дата:** 2026-06-12

Два модуля: **дела** (общие + назначенные, включая повторяющиеся) и **покупки** (списки).
Всё остальное — инвентарь, статистика, финансы, чат — НЕ в v0.1.

Стиль: light glassmorphism — голубой фон, полупрозрачные белые карточки, крупные
скругления, тени, нижняя навигация, центральная кнопка `+`.

---

## 1. Продуктовые решения

- **Вход:** Google Sign-In в v0.1. Phone auth — v0.2.
- **Семья:** создать или вступить по invite-коду (8 символов, например `A7K9Q2PM`).
- **Роли:** нет. Хранится только `created_by` у семьи.
- **Участники:** имя, аватар (или первая буква), цвет, email, дата подключения.
- **Дела:** общие (видят все) и назначенные (одному). Повторяющиеся — в v0.1 (roll-forward).
- **Покупки:** списки, не категории. Первый список — «Продукты». Категорий нет.
- **Сеть:** онлайн-first + офлайн-чтение (persist-кеш). Полный офлайн-синк — v0.3.

---

## 2. Стек

```
Mobile:    React Native · Expo · TypeScript · Expo Router
Backend:   Supabase (PostgreSQL · Auth · Realtime · RLS · Edge Functions v0.2)
State:     TanStack Query + AsyncStorage persister · Zustand (UI only)
Формы:     React Hook Form + Zod
Стиль:     StyleSheet + собственные компоненты (не NativeWind — glassmorphism под контролем)
Сборка:    EAS Build (dev build → preview AAB/APK)
```

---

## 3. Важно до написания кода

**Google Sign-In не работает в Expo Go.** Нужен dev build с первого дня:
```
npx eas build --profile development --platform android
```
Также нужны: SHA-1 отпечатки в Google Cloud Console, OAuth web client ID в Supabase.

Сессия Supabase — в AsyncStorage с авторефрешем:
```ts
const supabase = createClient(url, key, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true },
});
```

---

## 4. Принцип безопасности

- Все семейные таблицы имеют `family_id` + RLS.
- Операции с membership — только через security definer RPC (прямой INSERT в `families`/`family_members` запрещён).
- Бизнес-логика (создание задачи, отметка покупки) — через RPC, чтобы валидировать на сервере.
- `service_role` ключ — только в Edge Function, никогда в мобильном приложении.

---

## 5. Модель данных

### 5.1 Схема

```sql
create extension if not exists "pgcrypto";

-- 1. Profiles (auto-created триггером handle_new_user)
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text,
  avatar_url       text,
  color            text,
  phone            text,
  email            text,
  active_family_id uuid,  -- FK добавляется ниже, после families
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 2. Families
create table if not exists public.families (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  invite_code text not null unique,
  created_by  uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Обратная связь profiles → families (после создания обеих таблиц)
alter table public.profiles
  add constraint profiles_active_family_id_fk
  foreign key (active_family_id) references public.families(id) on delete set null;

-- 3. Family members
create table if not exists public.family_members (
  id        uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  nickname  text,
  color     text,
  joined_at timestamptz not null default now(),
  unique(family_id, user_id)
);

-- 4. Tasks
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.families(id) on delete cascade,
  title       text not null,
  description text,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by  uuid not null references public.profiles(id) on delete cascade,
  due_date    date,
  due_time    time,
  repeat_type text not null default 'none'
    check (repeat_type in ('none', 'daily', 'weekly', 'monthly')),
  is_completed  boolean not null default false,
  completed_by  uuid references public.profiles(id) on delete set null,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 5. Shopping lists
create table if not exists public.shopping_lists (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references public.families(id) on delete cascade,
  title      text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(id, family_id)  -- нужно для composite FK из shopping_items
);

-- 6. Shopping items
create table if not exists public.shopping_items (
  id              uuid primary key default gen_random_uuid(),
  family_id       uuid not null references public.families(id) on delete cascade,
  list_id         uuid not null,
  title           text not null,
  quantity        text,
  unit            text,
  estimated_price numeric(10,2),
  created_by      uuid not null references public.profiles(id) on delete cascade,
  is_checked      boolean not null default false,
  checked_by      uuid references public.profiles(id) on delete set null,
  checked_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- composite FK: list_id и family_id должны принадлежать одной записи в shopping_lists
  constraint shopping_items_list_family_fk
    foreign key (list_id, family_id) references public.shopping_lists(id, family_id)
  -- v0.2: добавятся product_id и source_inventory_item_id
);

-- 7. Notification settings
create table if not exists public.notification_settings (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null unique references public.profiles(id) on delete cascade,
  assigned_tasks_enabled boolean not null default true,
  general_tasks_enabled  boolean not null default true,
  shopping_enabled       boolean not null default true,
  reminders_enabled      boolean not null default true,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- 8. Push tokens
create table if not exists public.push_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  token       text not null,
  platform    text,
  device_name text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(user_id, token)
);
```

### 5.2 Индексы

```sql
create index if not exists idx_family_members_family_id on public.family_members(family_id);
create index if not exists idx_family_members_user_id   on public.family_members(user_id);
create index if not exists idx_tasks_family_id          on public.tasks(family_id);
create index if not exists idx_tasks_assigned_to        on public.tasks(assigned_to);
create index if not exists idx_tasks_due_date           on public.tasks(due_date);
create index if not exists idx_shopping_lists_family_id on public.shopping_lists(family_id);
create index if not exists idx_shopping_items_family_id on public.shopping_items(family_id);
create index if not exists idx_shopping_items_list_id   on public.shopping_items(list_id);
create index if not exists idx_push_tokens_user_id      on public.push_tokens(user_id);
```

---

## 6. Триггеры

### 6.1 Авто-создание профиля при регистрации

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 6.2 Авто-обновление updated_at

```sql
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.families
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.tasks
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.shopping_lists
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.shopping_items
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.notification_settings
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.push_tokens
  for each row execute procedure public.set_updated_at();
-- v0.2+: products, inventory_items — добавить при создании этих таблиц
```

---

## 7. RLS

### 7.1 Включить

```sql
alter table public.profiles              enable row level security;
alter table public.families              enable row level security;
alter table public.family_members        enable row level security;
alter table public.tasks                 enable row level security;
alter table public.shopping_lists        enable row level security;
alter table public.shopping_items        enable row level security;
alter table public.notification_settings enable row level security;
alter table public.push_tokens           enable row level security;
```

### 7.2 Helper-функции (security definer — не дают RLS-рекурсии)

```sql
-- Текущий пользователь состоит в семье
create or replace function public.is_family_member(target_family_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.family_members
    where family_id = target_family_id and user_id = auth.uid()
  );
$$;

-- Пользователь X состоит в семье Y (для валидации assigned_to)
create or replace function public.is_user_in_family(target_user_id uuid, target_family_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.family_members
    where user_id = target_user_id and family_id = target_family_id
  );
$$;

-- Текущий пользователь делит хотя бы одну семью с target_user_id (для чтения профилей)
create or replace function public.shares_family_with(target_user_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1
    from public.family_members me
    join public.family_members other on me.family_id = other.family_id
    where me.user_id = auth.uid() and other.user_id = target_user_id
  );
$$;
```

### 7.3 Profiles

```sql
create policy "read own profile"
on public.profiles for select using (id = auth.uid());

-- читать профили участников своих семей (нужно для "кто создал / кто купил")
create policy "read family member profiles"
on public.profiles for select using (public.shares_family_with(id));

create policy "update own profile"
on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "insert own profile"
on public.profiles for insert with check (id = auth.uid());
```

### 7.4 Families

```sql
create policy "members read families"
on public.families for select using (public.is_family_member(id));
-- INSERT и UPDATE только через RPC, прямые операции не разрешены
```

### 7.5 Family members (прямой INSERT закрыт)

```sql
create policy "members read family members"
on public.family_members for select using (public.is_family_member(family_id));
-- Нет INSERT-политики: вставка запрещена, только через RPC
```

### 7.6 Tasks

```sql
create policy "members read tasks"
on public.tasks for select using (public.is_family_member(family_id));

-- INSERT через RPC create_task (он валидирует assigned_to)
-- Но если агент пишет прямой insert — оставить policy для совместимости:
create policy "members create tasks"
on public.tasks for insert
with check (public.is_family_member(family_id) and created_by = auth.uid());

create policy "members update tasks"
on public.tasks for update
using (public.is_family_member(family_id))
with check (public.is_family_member(family_id));

create policy "members delete tasks"
on public.tasks for delete using (public.is_family_member(family_id));
```

### 7.7 Shopping lists / items

```sql
create policy "members read lists"   on public.shopping_lists for select using (public.is_family_member(family_id));
create policy "members create lists" on public.shopping_lists for insert
  with check (public.is_family_member(family_id) and created_by = auth.uid());
create policy "members update lists" on public.shopping_lists for update
  using (public.is_family_member(family_id)) with check (public.is_family_member(family_id));
create policy "members delete lists" on public.shopping_lists for delete
  using (public.is_family_member(family_id));

create policy "members read items"   on public.shopping_items for select using (public.is_family_member(family_id));
create policy "members create items" on public.shopping_items for insert
  with check (public.is_family_member(family_id) and created_by = auth.uid());
create policy "members update items" on public.shopping_items for update
  using (public.is_family_member(family_id)) with check (public.is_family_member(family_id));
create policy "members delete items" on public.shopping_items for delete
  using (public.is_family_member(family_id));
```

### 7.8 Notification settings / push tokens

```sql
create policy "manage own notification settings" on public.notification_settings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "manage own push tokens" on public.push_tokens
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
```

---

## 8. RPC

### 8.1 Создание семьи (атомарно: семья + участник + список «Продукты» + active_family_id)

```sql
create or replace function public.create_family_with_defaults(family_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  new_family_id uuid;
  new_code      text;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;

  loop
    new_code := upper(substring(replace(gen_random_uuid()::text, '-', '') for 8));
    exit when not exists (select 1 from public.families where invite_code = new_code);
  end loop;

  insert into public.families (name, invite_code, created_by)
  values (family_name, new_code, auth.uid())
  returning id into new_family_id;

  insert into public.family_members (family_id, user_id)
  values (new_family_id, auth.uid());

  insert into public.shopping_lists (family_id, title, created_by)
  values (new_family_id, 'Продукты', auth.uid());

  update public.profiles
  set active_family_id = new_family_id
  where id = auth.uid();

  return new_family_id;
end;
$$;
```

### 8.2 Вступление по коду

```sql
create or replace function public.join_family_by_code(code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  target_family_id uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;

  select id into target_family_id
  from public.families where invite_code = upper(trim(code));

  if target_family_id is null then raise exception 'Invalid invite code'; end if;

  insert into public.family_members (family_id, user_id)
  values (target_family_id, auth.uid())
  on conflict (family_id, user_id) do nothing;

  update public.profiles
  set active_family_id = target_family_id
  where id = auth.uid();

  return target_family_id;
end;
$$;
```

### 8.3 Выход из семьи

```sql
create or replace function public.leave_family(p_family_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_family_member(p_family_id) then raise exception 'Not a member'; end if;

  delete from public.family_members
  where family_id = p_family_id and user_id = auth.uid();

  -- если это была активная семья — сбросить
  update public.profiles
  set active_family_id = null
  where id = auth.uid() and active_family_id = p_family_id;
end;
$$;
```

### 8.4 Перегенерировать invite-код (только создатель семьи)

```sql
create or replace function public.regenerate_invite_code(p_family_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare
  new_code text;
begin
  if not exists (
    select 1 from public.families where id = p_family_id and created_by = auth.uid()
  ) then raise exception 'Forbidden'; end if;

  loop
    new_code := upper(substring(replace(gen_random_uuid()::text, '-', '') for 8));
    exit when not exists (select 1 from public.families where invite_code = new_code);
  end loop;

  update public.families set invite_code = new_code where id = p_family_id;
  return new_code;
end;
$$;
```

### 8.5 Создать задачу (валидирует assigned_to)

```sql
create or replace function public.create_task(
  p_family_id   uuid,
  p_title       text,
  p_description text    default null,
  p_assigned_to uuid    default null,
  p_due_date    date    default null,
  p_due_time    time    default null,
  p_repeat_type text    default 'none'
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  new_id uuid;
begin
  if not public.is_family_member(p_family_id) then raise exception 'Not a family member'; end if;

  if p_assigned_to is not null
     and not public.is_user_in_family(p_assigned_to, p_family_id) then
    raise exception 'Assigned user is not a member of this family';
  end if;

  insert into public.tasks
    (family_id, title, description, assigned_to, created_by, due_date, due_time, repeat_type)
  values
    (p_family_id, p_title, p_description, p_assigned_to, auth.uid(), p_due_date, p_due_time, p_repeat_type)
  returning id into new_id;

  return new_id;
end;
$$;
```

### 8.6 Выполнить задачу (идемпотентно; roll-forward для повторяющихся)

Возвращает jsonb с `rolled_forward` и `new_due_date` — клиент показывает undo-снекбар 5 секунд,
**не вызывает RPC** до истечения таймера. Undo — просто отмена вызова (клиентская сторона).
Для обычных задач undo доступен через `uncomplete_task`.

```sql
create or replace function public.complete_task(p_task_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  t            public.tasks%rowtype;
  new_due_date date;
begin
  select * into t from public.tasks where id = p_task_id;
  if t.id is null then raise exception 'Task not found'; end if;
  if not public.is_family_member(t.family_id) then raise exception 'Forbidden'; end if;

  -- идемпотентность: уже выполненная обычная задача
  if t.is_completed and t.repeat_type = 'none' then
    return jsonb_build_object('status', 'already_completed', 'rolled_forward', false);
  end if;

  if t.repeat_type = 'none' then
    update public.tasks
    set is_completed = true, completed_by = auth.uid(),
        completed_at = now(), updated_at = now()
    where id = p_task_id;
    return jsonb_build_object('status', 'completed', 'rolled_forward', false);

  else
    new_due_date := case t.repeat_type
      when 'daily'   then coalesce(t.due_date, current_date) + 1
      when 'weekly'  then coalesce(t.due_date, current_date) + 7
      when 'monthly' then (coalesce(t.due_date, current_date) + interval '1 month')::date
    end;

    update public.tasks
    set due_date = new_due_date, is_completed = false,
        completed_by = null, completed_at = null, updated_at = now()
    where id = p_task_id;

    return jsonb_build_object(
      'status', 'rolled_forward',
      'rolled_forward', true,
      'new_due_date', new_due_date
    );
  end if;
end;
$$;
```

### 8.7 Отменить выполнение задачи (undo для обычных задач)

```sql
create or replace function public.uncomplete_task(p_task_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare t public.tasks%rowtype;
begin
  select * into t from public.tasks where id = p_task_id;
  if t.id is null then raise exception 'Task not found'; end if;
  if not public.is_family_member(t.family_id) then raise exception 'Forbidden'; end if;
  if t.repeat_type != 'none' then raise exception 'Use client-side undo for repeating tasks'; end if;

  update public.tasks
  set is_completed = false, completed_by = null, completed_at = null, updated_at = now()
  where id = p_task_id;
end;
$$;
```

### 8.8 Отметить товар купленным / снять отметку (атомарно)

В v0.1 только обновляет `is_checked`. В v0.2, когда появятся `product_id` и
`inventory_events`, RPC расширится — запись события `purchase` добавится сюда же.

```sql
create or replace function public.mark_shopping_item_checked(
  p_item_id uuid,
  p_checked  boolean default true
)
returns void language plpgsql security definer set search_path = public as $$
declare item public.shopping_items%rowtype;
begin
  select * into item from public.shopping_items where id = p_item_id;
  if item.id is null then raise exception 'Item not found'; end if;
  if not public.is_family_member(item.family_id) then raise exception 'Forbidden'; end if;

  if p_checked then
    update public.shopping_items
    set is_checked = true, checked_by = auth.uid(),
        checked_at = now(), updated_at = now()
    where id = p_item_id;
  else
    update public.shopping_items
    set is_checked = false, checked_by = null,
        checked_at = null, updated_at = now()
    where id = p_item_id;
  end if;
end;
$$;
```

---

## 9. Realtime

```sql
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.shopping_lists;
alter publication supabase_realtime add table public.shopping_items;
alter publication supabase_realtime add table public.family_members;
```

Подписка в клиенте:

```ts
supabase
  .channel(`family:${familyId}`)
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'tasks',
      filter: `family_id=eq.${familyId}` },
    () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] }))
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'shopping_items',
      filter: `family_id=eq.${familyId}` },
    () => queryClient.invalidateQueries({ queryKey: ['shoppingItems', familyId] }))
  .subscribe();
```

---

## 10. Офлайн-чтение

Список покупок нужен в магазине без сети. Полный офлайн-синк — v0.3. В v0.1:

- `@tanstack/query-async-storage-persister` + AsyncStorage — кеш переживает перезапуск.
- Оптимистичные апдейты на `mark_shopping_item_checked` и `complete_task`.
- Конфликты: last-write-wins по `updated_at` (триггер гарантирует актуальность поля).
- При восстановлении сети: realtime + refetch приводят данные в порядок.

---

## 11. Навигация и структура

Нижнее меню:
```
Главная   Дела   [ + ]   Покупки   Семья
```

Действия кнопки `+`:
```
Добавить дело
Добавить товар
Создать список покупок
```

```
app/(auth)/welcome.tsx
app/(auth)/onboarding-family.tsx
app/(tabs)/index.tsx          — Главная
app/(tabs)/tasks.tsx          — Дела
app/(tabs)/shopping.tsx       — Покупки
app/(tabs)/family.tsx         — Семья

app/task/new.tsx · app/task/[id].tsx · app/task/edit/[id].tsx
app/shopping/list/[id].tsx · app/shopping/new-list.tsx · app/shopping/new-item.tsx

components/ui/   GlassCard · GlassButton · AvatarBubble · ScreenHeader · EmptyState
features/auth/   · features/family/ · features/tasks/ · features/shopping/
lib/supabase.ts  · lib/queryClient.ts (с persister) · store/uiStore.ts
constants/       colors.ts · spacing.ts · radius.ts
```

---

## 12. Что НЕ делать в v0.1

```
Чат · Семейный календарь · Финансы · Бюджет · Скан чеков
AI-помощник · Голосовой ввод · Полный офлайн-синк
Несколько семей одновременно · Сложные права · Роли
Платежи · Подписки · Публичный каталог
Инвентарь · Статистика · Категории товаров · Push-уведомления
```

---

## 13. Definition of Done (v0.1)

```
1.  Вход через Google (dev build, не Expo Go).
2.  Профиль создаётся автоматически при регистрации (handle_new_user).
3.  Создание семьи через RPC: появляется список «Продукты», active_family_id обновлён.
4.  Вступление по invite-коду через RPC: неверный код — ошибка.
5.  Участники видят имена и аватары друг друга.
6.  Создать общее дело; создать дело, назначенное участнику семьи.
7.  Назначить дело пользователю вне семьи — ошибка на сервере (create_task).
8.  Отметить обычное дело выполненным; снять выполнение (uncomplete_task).
9.  Отметить повторяющееся дело — дата сдвигается (roll-forward); показывается
    undo-снекбар 5 сек; undo отменяет вызов RPC.
10. Видно, кто создал и кто выполнил дело.
11. Добавить товар в список (title, quantity, unit, estimated_price).
12. Отметить товар купленным через mark_shopping_item_checked (оптимистично).
13. Кнопка «Очистить купленное» — удаляет все is_checked=true из списка.
14. Видно, кто добавил и кто купил товар.
15. Изменения у другого участника появляются через realtime.
16. Список покупок открывается и отмечается без сети (persist-кеш).
17. RLS не даёт видеть/менять данные чужой семьи.
18. Прямой INSERT в family_members — запрещён, только RPC.
19. Android build запускается и работает.
20. UI в стиле light glassmorphism.
```

---

## 14. Тестовые сценарии

**Auth:** Google → профиль (авто) → семья → выход → повторный вход → главная.

**Family:** A создаёт семью → invite-код 8 символов → B вступает → видят друг друга.
B вводит неверный код → ошибка «Invalid invite code».
A перегенерирует код → старый код перестаёт работать.
B выходит из семьи → active_family_id = null.

**Tasks:** A создаёт общее дело → B видит → B выполняет → A видит «выполнил B».
A назначает дело B → B видит в фильтре «Мои».
A пытается назначить дело UUID вне семьи → ошибка сервера.
Повторяющееся дело (weekly): A выполняет → due_date + 7 → дело снова активно.
A нажимает undo в течение 5 сек → RPC не вызван, дело осталось невыполненным.

**Shopping:** A добавляет товар → B видит → B отмечает → A видит «купил B».
A нажимает «Очистить купленное» → все отмеченные исчезают.
B открывает список в самолётном режиме → видит кеш → отмечает → включает сеть → A видит.

**Security:** чужой юзер не получает tasks по чужому family_id.
Прямой `INSERT INTO family_members` от стороннего юзера — запрещён (нет политики).
Юзер не читает чужие push_tokens / notification_settings.

---

## 15. Coding rules

```
TypeScript, без any без причины.
Компоненты НЕ вызывают supabase напрямую — только features/*/*.api.ts.
Бизнес-логика с валидацией → RPC (create_task, complete_task, mark_shopping_item_checked).
complete_task возвращает jsonb → проверять rolled_forward, показывать undo-снекбар.
Каждая фича: api.ts + hooks.ts + types.ts.
Переиспользовать UI: GlassCard, GlassButton, AvatarBubble, ScreenHeader, EmptyState.
Нейминг: familyId, userId, taskId, listId, itemId.
service_role ключ — никогда в клиенте.
```

ENV:
```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
# только на сервере (Edge Function v0.2):
# SUPABASE_SERVICE_ROLE_KEY=
```

---

## 16. Промпт 1 — структура проекта

```
Работаешь над Family OS (спецификация в docs/00_mvp.md).

Стек: React Native, Expo, TypeScript, Expo Router, Supabase, TanStack Query
(+ AsyncStorage persister), Zustand (UI only), React Hook Form + Zod.

ВАЖНО: Google Sign-In не работает в Expo Go. С первого дня нужен EAS dev build.

Шаг 1. Структуру проекта по разделу 11 (routes, components/ui, features/*, lib/*, constants/*).
Шаг 2. lib/supabase.ts — клиент с AsyncStorage, autoRefreshToken, persistSession.
Шаг 3. lib/queryClient.ts — TanStack Query client + AsyncStorage persister.
Шаг 4. Дизайн-система: GlassCard, GlassButton, AvatarBubble, ScreenHeader, EmptyState
       (полупрозрачные карточки, градиенты, тени, без тяжёлого blur — Android тормозит).
Шаг 5. Auth guard + welcome screen + tabs layout + заглушки экранов.

Не добавлять ничего из 10_inventory.md или 20_stats.md.
Не делать роли, категории, чат, финансы, пуш.
```

## 17. Промпт 2 — схема Supabase

```
Применить к Supabase разделы 5, 6, 7, 8, 9 из 00_mvp.md одной миграцией:
таблицы со всеми constraints (включая composite FK shopping_items),
индексы, RLS, три helper-функции, все 8 RPC, два триггера (handle_new_user,
set_updated_at), realtime-публикацию.
Прямой INSERT в families и family_members не разрешать.
После применения — прогнать сценарии Security из раздела 14.
```

## 18. Промпт 3 — feature tasks

```
Реализовать features/tasks (api/hooks/types) и экраны tasks.tsx,
task/new.tsx, task/[id].tsx, task/edit/[id].tsx.

Создание задачи — через RPC create_task (валидирует assigned_to на сервере).
Выполнение — через RPC complete_task; проверять rolled_forward в ответе;
если true — показывать undo-снекбар 5 сек перед вызовом (или отменять вызов).
Undo обычной задачи — RPC uncomplete_task.
Фильтры: Все / Мои / Общие / Выполненные.
Поля: title, description, assigned_to, due_date, due_time, repeat_type.
Показывать кто создал и кто выполнил.
Realtime invalidate. Supabase не вызывать из компонентов.
```

## 19. Промпт 4 — feature shopping

```
Реализовать features/shopping (api/hooks/types) и экраны shopping.tsx,
shopping/list/[id].tsx, shopping/new-list.tsx, shopping/new-item.tsx.

Первый список "Продукты" (создаётся через create_family_with_defaults).
Отметка купленным — через RPC mark_shopping_item_checked с оптимистичным апдейтом.
Кнопка «Очистить купленное» — удаляет все is_checked=true из текущего списка.
Поля товара: title, quantity, unit, estimated_price.
Показывать кто добавил и кто купил.
Realtime invalidate. Офлайн-чтение через persist-кеш.
Категории товаров не делать.
```

---

## Приложение A — Server-side push (первая задача v0.2)

Клиентский пуш запрещён: нарушает RLS (надо читать чужие push_tokens) и не работает
при закрытом приложении. Правильно — Supabase Edge Function с триггером на INSERT в tasks.

Логика: `assigned_to` задан → пуш назначенному; пустой → пуш всем членам семьи кроме автора.

```ts
// supabase/functions/notify-task/index.ts (Deno)
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const { record } = await req.json();
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  let recipientIds: string[];
  if (record.assigned_to) {
    recipientIds = [record.assigned_to];
  } else {
    const { data: members } = await admin
      .from('family_members').select('user_id').eq('family_id', record.family_id);
    recipientIds = (members ?? [])
      .map((m: { user_id: string }) => m.user_id)
      .filter((id: string) => id !== record.created_by);
  }

  const { data: tokens } = await admin
    .from('push_tokens').select('token').in('user_id', recipientIds);

  const messages = (tokens ?? []).map((t: { token: string }) => ({
    to: t.token, sound: 'default', title: 'Family OS', body: record.title,
  }));

  if (messages.length) {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });
  }
  return new Response('ok');
});
```

Триггер: Database Webhook в Supabase (Insert на `public.tasks` → вызов функции).
Документация: https://docs.expo.dev/push-notifications/overview/
