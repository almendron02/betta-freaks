import { NextResponse } from "next/server";

import { checkoutRequestSchema } from "@/lib/commerce/checkout";
import { hasStripeEnvironment, hasSupabaseSecretEnvironment } from "@/lib/env";

export async function POST(request: Request) {
  const parsed = checkoutRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "The cart request is invalid.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (!hasStripeEnvironment() || !hasSupabaseSecretEnvironment()) {
    return NextResponse.json(
      { error: "Checkout is not configured. No payment was attempted." },
      { status: 503 },
    );
  }

  // Fail closed until the atomic database reservation function and Stripe test
  // webhook are deployed together. Prices are never accepted from the browser;
  // the production handler will load them by productId.
  return NextResponse.json(
    { error: "Checkout is awaiting the inventory-reservation deployment." },
    { status: 503, headers: { "Retry-After": "3600" } },
  );
}
