-- Betta Freaks initial commerce schema.
-- The browser receives only the publishable key. Secret-key operations such as
-- checkout creation and Stripe webhook processing belong on the server.

create schema if not exists private;

create type public.staff_role as enum ('owner', 'manager');
create type public.product_type as enum ('fish', 'accessory', 'live_food');
create type public.product_sex as enum ('male', 'female');
create type public.product_status as enum ('draft', 'active', 'reserved', 'sold', 'archived');
create type public.payment_status as enum ('unpaid', 'processing', 'paid', 'failed', 'partially_refunded', 'refunded');
create type public.fulfillment_status as enum ('unfulfilled', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled');
create type public.reservation_status as enum ('active', 'converted', 'released', 'expired');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.staff_role not null default 'manager',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug = lower(slug)),
  name text not null,
  description text,
  position integer not null default 0 check (position >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id bigint references public.categories (id) on delete set null,
  slug text not null unique check (slug = lower(slug)),
  sku text not null unique,
  name text not null,
  short_name text not null,
  description text not null default '',
  product_type public.product_type not null,
  sex public.product_sex,
  variety text,
  color text,
  tail_type text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd' check (currency = lower(currency) and char_length(currency) = 3),
  stock_on_hand integer not null default 0 check (stock_on_hand >= 0),
  status public.product_status not null default 'draft',
  featured boolean not null default false,
  is_exact_fish boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_fish_sex_check check (
    (product_type = 'fish' and sex is not null) or
    (product_type <> 'fish' and sex is null)
  ),
  constraint products_exact_fish_stock_check check (
    not is_exact_fish or stock_on_hand between 0 and 1
  )
);

create table public.product_media (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text text not null,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  unique (product_id, position),
  unique (storage_path)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_user_id uuid references auth.users (id) on delete set null,
  customer_email text not null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  payment_status public.payment_status not null default 'unpaid',
  fulfillment_status public.fulfillment_status not null default 'unfulfilled',
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'usd' check (currency = lower(currency) and char_length(currency) = 3),
  shipping_name text,
  shipping_address jsonb,
  tracking_number text,
  notes text,
  paid_at timestamptz,
  shipped_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_total_check check (total_cents = subtotal_cents + shipping_cents + tax_cents)
);

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete restrict,
  sku text not null,
  product_name text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  line_total_cents integer generated always as (unit_price_cents * quantity) stored,
  created_at timestamptz not null default now()
);

create table public.inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete restrict,
  order_id uuid not null references public.orders (id) on delete cascade,
  stripe_checkout_session_id text unique,
  quantity integer not null default 1 check (quantity > 0),
  status public.reservation_status not null default 'active',
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_movements (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products (id) on delete restrict,
  order_id uuid references public.orders (id) on delete set null,
  quantity_delta integer not null check (quantity_delta <> 0),
  reason text not null,
  note text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.processed_stripe_events (
  event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

create index staff_members_active_idx on public.staff_members (user_id) where active;
create index products_category_id_idx on public.products (category_id);
create index products_active_catalog_idx on public.products (product_type, sex, created_at desc) where status = 'active' and stock_on_hand > 0;
create index products_featured_idx on public.products (created_at desc) where status = 'active' and featured and stock_on_hand > 0;
create index product_media_product_id_idx on public.product_media (product_id, position);
create index orders_customer_created_idx on public.orders (customer_user_id, created_at desc);
create index orders_fulfillment_created_idx on public.orders (fulfillment_status, created_at desc);
create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);
create index inventory_reservations_product_status_idx on public.inventory_reservations (product_id, status);
create index inventory_reservations_order_id_idx on public.inventory_reservations (order_id);
create index inventory_reservations_expiry_idx on public.inventory_reservations (status, expires_at);
create unique index inventory_reservations_one_active_exact_fish_idx on public.inventory_reservations (product_id) where status = 'active';
create index inventory_movements_product_created_idx on public.inventory_movements (product_id, created_at desc);
create index inventory_movements_order_id_idx on public.inventory_movements (order_id);
create index inventory_movements_created_by_idx on public.inventory_movements (created_by) where created_by is not null;

create or replace function private.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff_members
    where user_id = (select auth.uid())
      and active = true
  );
$$;

create or replace function private.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff_members
    where user_id = (select auth.uid())
      and role = 'owner'
      and active = true
  );
$$;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger staff_members_set_updated_at before update on public.staff_members for each row execute function private.set_updated_at();
create trigger categories_set_updated_at before update on public.categories for each row execute function private.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute function private.set_updated_at();
create trigger orders_set_updated_at before update on public.orders for each row execute function private.set_updated_at();
create trigger inventory_reservations_set_updated_at before update on public.inventory_reservations for each row execute function private.set_updated_at();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.staff_members enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_reservations enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.processed_stripe_events enable row level security;

create policy "profiles_select_self_or_staff" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select private.is_active_staff()));
create policy "profiles_update_self_or_staff" on public.profiles for update to authenticated
using (id = (select auth.uid()) or (select private.is_active_staff()))
with check (id = (select auth.uid()) or (select private.is_active_staff()));

create policy "staff_select_self_or_staff" on public.staff_members for select to authenticated
using (user_id = (select auth.uid()) or (select private.is_active_staff()));
create policy "staff_manage_by_owner" on public.staff_members for all to authenticated
using ((select private.is_owner())) with check ((select private.is_owner()));

create policy "categories_public_read_active" on public.categories for select to anon, authenticated
using (active or (select private.is_active_staff()));
create policy "categories_staff_manage" on public.categories for all to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));

create policy "products_public_read_available" on public.products for select to anon, authenticated
using ((status = 'active' and stock_on_hand > 0) or (select private.is_active_staff()));
create policy "products_staff_manage" on public.products for all to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));

create policy "media_public_read_available" on public.product_media for select to anon, authenticated
using (
  exists (
    select 1 from public.products
    where products.id = product_media.product_id
      and products.status = 'active'
      and products.stock_on_hand > 0
  ) or (select private.is_active_staff())
);
create policy "media_staff_manage" on public.product_media for all to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));

create policy "orders_customer_or_staff_read" on public.orders for select to authenticated
using (customer_user_id = (select auth.uid()) or (select private.is_active_staff()));
create policy "orders_staff_manage" on public.orders for all to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));

create policy "order_items_customer_or_staff_read" on public.order_items for select to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and (orders.customer_user_id = (select auth.uid()) or (select private.is_active_staff()))
  )
);
create policy "order_items_staff_manage" on public.order_items for all to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));

create policy "reservations_staff_only" on public.inventory_reservations for all to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));
create policy "inventory_movements_staff_only" on public.inventory_movements for all to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));
create policy "stripe_events_staff_read" on public.processed_stripe_events for select to authenticated
using ((select private.is_active_staff()));

revoke all on all tables in schema public from anon, authenticated;
grant select on public.categories, public.products, public.product_media to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.staff_members, public.categories, public.products, public.product_media, public.orders, public.order_items, public.inventory_reservations, public.inventory_movements to authenticated;
grant select on public.processed_stripe_events to authenticated;
grant usage, select on all sequences in schema public to authenticated;

revoke all on function private.is_active_staff() from public;
grant execute on function private.is_active_staff() to anon, authenticated;
revoke all on function private.is_owner() from public;
grant execute on function private.is_owner() to authenticated;
revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function private.set_updated_at() from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-media',
  'product-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "product_media_storage_public_read"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-media');

create policy "product_media_storage_staff_insert"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-media' and (select private.is_active_staff()));

create policy "product_media_storage_staff_update"
on storage.objects for update to authenticated
using (bucket_id = 'product-media' and (select private.is_active_staff()))
with check (bucket_id = 'product-media' and (select private.is_active_staff()));

create policy "product_media_storage_staff_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'product-media' and (select private.is_active_staff()));
