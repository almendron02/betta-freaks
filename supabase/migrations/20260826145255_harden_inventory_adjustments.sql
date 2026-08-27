-- The exposed RPC runs with the caller's RLS permissions. A non-callable
-- trigger owns the ledger insert so direct product updates cannot change stock
-- without also providing a valid audit reason.
create or replace function private.log_inventory_movement()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  movement_reason text;
  movement_note text;
  actor_id uuid;
begin
  movement_reason := current_setting('app.inventory_reason', true);
  movement_note := nullif(current_setting('app.inventory_note', true), '');
  actor_id := auth.uid();

  if actor_id is null or not private.is_active_staff() then
    raise exception 'An active staff account is required.' using errcode = '42501';
  end if;

  if movement_reason is null or movement_reason not in (
    'stock_received',
    'stock_correction',
    'damaged_or_lost',
    'returned_to_stock'
  ) then
    raise exception 'Stock changes must include a valid inventory reason.'
      using errcode = '22023';
  end if;

  if length(movement_note) > 500 then
    raise exception 'Inventory note cannot exceed 500 characters.' using errcode = '22023';
  end if;

  insert into public.inventory_movements (
    product_id,
    quantity_delta,
    reason,
    note,
    created_by
  )
  values (
    new.id,
    new.stock_on_hand - old.stock_on_hand,
    movement_reason,
    movement_note,
    actor_id
  );

  return new;
end;
$$;

revoke all on function private.log_inventory_movement() from public;
revoke all on function private.log_inventory_movement() from anon;
revoke all on function private.log_inventory_movement() from authenticated;

drop trigger if exists products_log_inventory_movement on public.products;
create trigger products_log_inventory_movement
after update of stock_on_hand on public.products
for each row
when (old.stock_on_hand is distinct from new.stock_on_hand)
execute function private.log_inventory_movement();

create or replace function public.adjust_inventory(
  p_product_id uuid,
  p_quantity_delta integer,
  p_reason text,
  p_note text default null
)
returns table (
  product_id uuid,
  product_slug text,
  stock_on_hand integer
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_product public.products%rowtype;
  next_stock integer;
  clean_note text;
begin
  if auth.uid() is null or not private.is_active_staff() then
    raise exception 'An active staff account is required.' using errcode = '42501';
  end if;

  if p_quantity_delta is null or p_quantity_delta = 0 or abs(p_quantity_delta) > 1000 then
    raise exception 'Quantity change must be between -1000 and 1000 and cannot be zero.'
      using errcode = '22023';
  end if;

  if p_reason is null or p_reason not in (
    'stock_received',
    'stock_correction',
    'damaged_or_lost',
    'returned_to_stock'
  ) then
    raise exception 'Inventory adjustment reason is invalid.' using errcode = '22023';
  end if;

  clean_note := nullif(btrim(coalesce(p_note, '')), '');
  if length(clean_note) > 500 then
    raise exception 'Inventory note cannot exceed 500 characters.' using errcode = '22023';
  end if;

  select *
  into current_product
  from public.products
  where id = p_product_id
  for update;

  if not found then
    raise exception 'Product not found.' using errcode = 'P0002';
  end if;

  next_stock := current_product.stock_on_hand + p_quantity_delta;

  if next_stock < 0 then
    raise exception 'Stock cannot fall below zero.' using errcode = '23514';
  end if;

  if current_product.is_exact_fish and next_stock > 1 then
    raise exception 'An exact-fish listing cannot have more than one item in stock.'
      using errcode = '23514';
  end if;

  perform set_config('app.inventory_reason', p_reason, true);
  perform set_config('app.inventory_note', coalesce(clean_note, ''), true);

  update public.products
  set stock_on_hand = next_stock
  where id = current_product.id;

  return query
  select current_product.id, current_product.slug, next_stock;
end;
$$;

revoke all on function public.adjust_inventory(uuid, integer, text, text) from public;
revoke all on function public.adjust_inventory(uuid, integer, text, text) from anon;
grant execute on function public.adjust_inventory(uuid, integer, text, text) to authenticated;
