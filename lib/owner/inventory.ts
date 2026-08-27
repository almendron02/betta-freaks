import { createServerSupabaseClient } from "@/lib/supabase/server";

export type InventoryMovement = {
  id: number;
  productId: string;
  productName: string;
  sku: string;
  quantityDelta: number;
  reason: string;
  note: string | null;
  createdAt: string;
};

type InventoryMovementRecord = {
  id: number;
  product_id: string;
  quantity_delta: number;
  reason: string;
  note: string | null;
  created_at: string;
  products: { short_name: string; sku: string } | null;
};

export const getInventoryMovements = async (
  limit = 50,
): Promise<InventoryMovement[]> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("inventory_movements")
    .select("id, product_id, quantity_delta, reason, note, created_at, products (short_name, sku)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Unable to load inventory history: ${error.message}`);

  return ((data ?? []) as unknown as InventoryMovementRecord[]).map((movement) => ({
    id: movement.id,
    productId: movement.product_id,
    productName: movement.products?.short_name ?? "Deleted product",
    sku: movement.products?.sku ?? "—",
    quantityDelta: movement.quantity_delta,
    reason: movement.reason,
    note: movement.note,
    createdAt: movement.created_at,
  }));
};
