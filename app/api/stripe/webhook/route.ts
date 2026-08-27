import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!secret || !webhookSecret || !signature) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const stripe = new Stripe(secret);
  const payload = await request.text();

  try {
    stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  // A non-2xx response makes Stripe retry instead of losing a payment event.
  // Change this only when idempotent order fulfillment is deployed.
  return NextResponse.json(
    { error: "Webhook verified; fulfillment handler is not deployed." },
    { status: 503, headers: { "Retry-After": "3600" } },
  );
}
