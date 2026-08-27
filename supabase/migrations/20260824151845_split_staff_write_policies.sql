-- Split broad ALL policies into write-only policies. Existing SELECT policies
-- already include the applicable staff path, so this avoids evaluating two
-- permissive policies for the same authenticated read.

drop policy if exists "staff_manage_by_owner" on public.staff_members;
create policy "staff_insert_by_owner" on public.staff_members for insert to authenticated
with check ((select private.is_owner()));
create policy "staff_update_by_owner" on public.staff_members for update to authenticated
using ((select private.is_owner())) with check ((select private.is_owner()));
create policy "staff_delete_by_owner" on public.staff_members for delete to authenticated
using ((select private.is_owner()));

drop policy if exists "categories_staff_manage" on public.categories;
create policy "categories_staff_insert" on public.categories for insert to authenticated
with check ((select private.is_active_staff()));
create policy "categories_staff_update" on public.categories for update to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));
create policy "categories_staff_delete" on public.categories for delete to authenticated
using ((select private.is_active_staff()));

drop policy if exists "products_staff_manage" on public.products;
create policy "products_staff_insert" on public.products for insert to authenticated
with check ((select private.is_active_staff()));
create policy "products_staff_update" on public.products for update to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));
create policy "products_staff_delete" on public.products for delete to authenticated
using ((select private.is_active_staff()));

drop policy if exists "media_staff_manage" on public.product_media;
create policy "media_staff_insert" on public.product_media for insert to authenticated
with check ((select private.is_active_staff()));
create policy "media_staff_update" on public.product_media for update to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));
create policy "media_staff_delete" on public.product_media for delete to authenticated
using ((select private.is_active_staff()));

drop policy if exists "orders_staff_manage" on public.orders;
create policy "orders_staff_insert" on public.orders for insert to authenticated
with check ((select private.is_active_staff()));
create policy "orders_staff_update" on public.orders for update to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));
create policy "orders_staff_delete" on public.orders for delete to authenticated
using ((select private.is_active_staff()));

drop policy if exists "order_items_staff_manage" on public.order_items;
create policy "order_items_staff_insert" on public.order_items for insert to authenticated
with check ((select private.is_active_staff()));
create policy "order_items_staff_update" on public.order_items for update to authenticated
using ((select private.is_active_staff())) with check ((select private.is_active_staff()));
create policy "order_items_staff_delete" on public.order_items for delete to authenticated
using ((select private.is_active_staff()));
