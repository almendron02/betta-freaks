export const formatUsd = (amountCents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);

export const calculateCartSubtotal = (
  items: ReadonlyArray<{ priceCents: number; quantity: number }>,
) =>
  items.reduce((total, item) => total + item.priceCents * item.quantity, 0);
