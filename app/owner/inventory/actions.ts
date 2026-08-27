"use server";

import { revalidatePath } from "next/cache";

import { getOwnerAccess } from "@/lib/auth/owner";
import {
  parseInventoryAdjustment,
  type InventoryActionState,
  type InventoryAdjustmentField,
} from "@/lib/commerce/inventory-adjustment";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const errorState = (
  message: string,
  fieldErrors?: Partial<Record<InventoryAdjustmentField, string[]>>,
): InventoryActionState => ({ state: "error", message, fieldErrors });

export async function adjustOwnerInventory(
  _previousState: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const access = await getOwnerAccess();
  if (access.state !== "authorized") {
    return errorState("Your owner session is no longer authorized. Sign in again.");
  }

  const parsed = parseInventoryAdjustment(formData);
  if (!parsed.success) {
    return errorState(
      "Review the inventory adjustment.",
      parsed.error.flatten().fieldErrors as Partial<Record<InventoryAdjustmentField, string[]>>,
    );
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return errorState("Supabase is not configured for this workspace.");

  const { data, error } = await supabase.rpc("adjust_inventory", {
    p_product_id: parsed.data.productId,
    p_quantity_delta: parsed.data.quantityDelta,
    p_reason: parsed.data.reason,
    p_note: parsed.data.note,
  });

  if (error) {
    if (error.code === "23514" || error.code === "22023") {
      return errorState(error.message);
    }
    if (error.code === "P0002") return errorState("This product no longer exists.");
    if (error.code === "42501") return errorState("Your staff access could not be verified.");
    return errorState(`Stock could not be updated. ${error.message}`);
  }

  const result = data?.[0];
  if (!result) return errorState("Stock changed, but no updated inventory row was returned.");

  revalidatePath("/");
  revalidatePath("/new-arrivals");
  revalidatePath("/owner");
  revalidatePath("/owner/products");
  revalidatePath("/owner/inventory");
  revalidatePath(`/bettas/${result.product_slug}`);

  return {
    state: "success",
    message: `Stock updated to ${result.stock_on_hand}.`,
    newStock: result.stock_on_hand,
  };
}
