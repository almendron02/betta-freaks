"use client";

import { PackagePlus } from "lucide-react";
import { useActionState } from "react";

import { adjustOwnerInventory } from "@/app/owner/inventory/actions";
import {
  initialInventoryActionState,
  inventoryReasonLabels,
  type InventoryActionState,
  type InventoryAdjustmentField,
} from "@/lib/commerce/inventory-adjustment";

type InventoryAction = (
  state: InventoryActionState,
  formData: FormData,
) => Promise<InventoryActionState>;

const previewAction: InventoryAction = async () => ({
  state: "idle",
  message: "Preview adjustments do not change stock.",
});

export function InventoryAdjustmentForm({
  productId,
  isExactFish,
  preview = false,
}: {
  productId: string;
  isExactFish: boolean;
  preview?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    preview ? previewAction : adjustOwnerInventory,
    initialInventoryActionState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      className="inventory-adjustment-form"
      onSubmit={preview ? (event) => event.preventDefault() : undefined}
    >
      <input type="hidden" name="productId" value={productId} />
      <div className="inventory-adjustment-fields">
        <label>
          <span>Change</span>
          <input
            aria-label="Quantity change"
            name="quantityDelta"
            type="number"
            step="1"
            placeholder={isExactFish ? "+1 or -1" : "+5 or -2"}
            required
          />
          {firstError(errors, "quantityDelta") ? <small>{firstError(errors, "quantityDelta")}</small> : null}
        </label>
        <label>
          <span>Reason</span>
          <select name="reason" defaultValue="stock_correction">
            {Object.entries(inventoryReasonLabels).map(([value, label]) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="inventory-note-field">
          <span>Note</span>
          <input name="note" maxLength={500} placeholder="Optional context for the audit log" />
          {firstError(errors, "note") ? <small>{firstError(errors, "note")}</small> : null}
        </label>
        <button className="button button-dark button-small" type="submit" disabled={pending || preview}>
          <PackagePlus size={15} /> {preview ? "Preview" : pending ? "Updating…" : "Apply"}
        </button>
      </div>
      {state.message ? (
        <p className={`inventory-adjustment-message ${state.state === "error" ? "is-error" : "is-success"}`} aria-live="polite">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

const firstError = (
  errors: Partial<Record<InventoryAdjustmentField, string[]>>,
  field: InventoryAdjustmentField,
) => errors[field]?.[0];
