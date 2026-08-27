# Betta Freaks Web Application Implementation Plan

**Status:** Project blueprint

**Last verified:** August 24, 2026

**Companion design brief:** [Betta Freaks Website Concept Brief](../Betta_Freaks_Website_Concept_Brief.pdf)

## 1. Project goal

Build a professional online store for Betta Freaks with two connected experiences:

1. A customer storefront where visitors can discover and purchase betta fish, aquarium accessories, and live foods.
2. A protected owner/manager dashboard where authorized staff can manage products, stock, orders, fulfillment, media, and store content.

The store will use one-time Stripe payments. It will not sell subscriptions.

The finished application must prevent two customers from buying the same one-of-a-kind fish, protect customer and business data, and keep payment, inventory, and order records synchronized.

## 2. Recommended technical foundation

| Layer | Recommended technology | Responsibility |
| --- | --- | --- |
| Web application | Next.js with TypeScript | Storefront, owner dashboard, server routes, rendering, and SEO |
| Styling | Tailwind CSS with a small reusable component system | Responsive implementation of the approved visual direction |
| Database | Supabase PostgreSQL | Products, inventory, orders, reservations, profiles, and audit history |
| Authentication | Supabase Auth | Customer sessions, password recovery, owner authentication, and MFA |
| File storage | Supabase Storage | Product photos and videos |
| Payments | Stripe Checkout Sessions in `payment` mode | One-time payments, shipping-address collection, and payment authentication |
| Email | A transactional email provider | Order confirmations, shipping notifications, and authentication email delivery |
| Hosting | Vercel or another production-compatible Next.js host | Application deployment, environment variables, and server endpoints |
| Testing | Vitest, Playwright, Stripe CLI, and database policy tests | Unit, integration, payment, authorization, and end-to-end verification |

Use Node.js 22 or later. Pin dependency versions and commit the lockfile. Supabase client libraries ended Node.js 20 support in 2026, and new Supabase projects may require tables to be explicitly exposed to the Data API. Every exposed table must also have intentional grants and Row Level Security policies.

## 3. Application architecture

```text
Customer storefront ─┐
                     ├── Next.js application ─── Supabase Auth
Owner dashboard ─────┘            │              Supabase PostgreSQL
                                  │              Supabase Storage
                                  │
                                  ├── Stripe Checkout
                                  │
                                  └── Stripe webhook ─── Orders and inventory
```

The customer and owner interfaces can live in the same Next.js application. They must not have the same permissions.

- Public browser code may contain only publishable credentials.
- Prices, stock validation, role checks, and Stripe Checkout Session creation run on the server.
- Stripe secret keys, webhook secrets, and Supabase secret/service credentials never enter browser bundles.
- Hiding an owner button is not authorization. Every owner route, Server Action, API route, database query, and storage mutation must independently verify the user and role.

## 4. Decisions required before development

The owner should approve these items before their related phase begins:

### Store and inventory

- Are all fish sold as exact, individually photographed specimens?
- Which non-fish products are included in the first release?
- Which filters are required at launch beyond male/female?
- Can one customer buy more than one fish in a single order?
- How long may an unpaid checkout reserve a fish?
- Can an owner manually place a fish on hold?

### Customer accounts

- Is guest checkout allowed?
- Which authentication methods are allowed: email/password, magic link, or both?
- Must customers verify their email before seeing order history?

Recommended first release: allow guest checkout and optional customer accounts. Require authentication and MFA for owners.

### Shipping and policies

- Shipping territory and excluded locations
- Shipping days and cutoff times
- Carrier and service levels
- Weather-hold procedure
- Shipping-price rules
- Live-arrival guarantee requirements
- Evidence and reporting process for a claim
- Meaning and delivery method of store credit
- Cancellation, refund, and chargeback handling

Do not copy another business's policy. Use the market references to identify topics, then write original terms that match the actual Betta Freaks process. Obtain appropriate business or legal review before launch.

### Payments and tax

- Stripe account owner and bank account
- Accepted payment methods
- Whether Stripe Tax will be enabled
- Whether promotion codes are allowed
- How store credits will be represented and redeemed

## 5. User roles and authorization

Use three application roles.

| Role | Authentication | Allowed access |
| --- | --- | --- |
| Visitor | None | Published products, public content, cart, and guest checkout |
| Customer | Supabase Auth | Visitor access plus their own profile, addresses, and orders |
| Owner | Supabase Auth plus MFA | Product, media, inventory, order, fulfillment, customer-support, and content management |

Owner authorization should be stored in trusted application data, not user-editable metadata. Use a tightly protected staff table or trusted `app_metadata`, and perform a fresh server/database authorization check for sensitive operations.

Never use Supabase `user_metadata` for authorization because customers can edit it. Never expose the Supabase secret/service key to the browser.

## 6. Customer storefront

### Required routes

| Route | Purpose |
| --- | --- |
| `/` | Hero, direct category access, live stock, new arrivals, best sellers, and brand introduction |
| `/shop` | All available products |
| `/bettas` | Available betta inventory |
| `/bettas/[slug]` | Individual fish detail and purchase page |
| `/new-arrivals` | Recently published products |
| `/best-sellers` | Curated or sales-ranked products |
| `/accessories` | Aquarium accessories |
| `/live-foods` | Live food products |
| `/cart` | Cart review and checkout entry |
| `/checkout/success` | Server-verified order confirmation |
| `/checkout/cancelled` | Return to cart after an incomplete checkout |
| `/account` | Customer profile and order summary |
| `/account/orders/[publicId]` | Customer-owned order detail |
| `/auth/sign-in` | Customer and owner sign-in |
| `/auth/sign-up` | Optional customer registration |
| `/auth/forgot-password` | Password recovery |
| `/about` | Refined company description |
| `/shipping` | Shipping policy |
| `/live-arrival-guarantee` | Live-arrival terms |
| `/store-credit-policy` | No-refund/store-credit policy |
| `/contact` | Contact and social links |

### Product discovery

The betta catalog should support:

- Male and female filters
- Variety
- Color
- Tail or fin type
- Price range
- Availability
- New arrivals
- Sort by newest, price, or featured order

Filters must be represented in the URL so a customer can bookmark or share a filtered view. Pagination should be cursor-based once the inventory grows; do not load the full catalog into the browser.

### Product detail requirements

Each fish product should include:

- Exact product name
- SKU
- Sex
- Variety and relevant traits
- Price
- Availability
- Multiple sharp images
- Optional short video
- Clearly identified exact-fish or representative-image status
- Relevant purchase and shipping notices
- Add-to-cart action

For exact fish, quantity must always be one. Once reserved or sold, purchasing actions must immediately become unavailable.

### Cart behavior

- The cart may be stored locally before checkout, but local cart data is never authoritative.
- The server re-reads every product and price before creating an order.
- Removed, sold, unpublished, or repriced products produce a clear cart correction message.
- The browser sends product identifiers and quantities, not trusted prices or totals.

## 7. Owner dashboard

Place the dashboard under `/owner` and protect every route and mutation.

### Dashboard routes

| Route | Responsibility |
| --- | --- |
| `/owner` | Orders requiring action, inventory warnings, and recent sales |
| `/owner/products` | Search, filter, create, duplicate, archive, and publish products |
| `/owner/products/new` | New product entry |
| `/owner/products/[id]` | Product, media, attributes, price, and stock editing |
| `/owner/inventory` | Stock view and manual inventory adjustments |
| `/owner/orders` | Payment and fulfillment queue |
| `/owner/orders/[id]` | Order items, customer details, shipping, tracking, notes, and permitted actions |
| `/owner/customers` | Customer-support lookup with minimal necessary information |
| `/owner/content` | Homepage and policy content management |
| `/owner/settings` | Shipping, notification, and store settings |
| `/owner/staff` | Owner-managed staff access if more than one manager is needed |

### Product-management fields

- Product type: fish, accessory, or live food
- Name and URL slug
- SKU
- Description
- Price in cents
- Currency
- Sex, variety, color, and tail type when applicable
- Stock on hand
- Product status
- Featured and best-seller flags
- Publication date
- Images and video
- Image alt text
- Sort order
- Internal notes that never appear publicly

### Order-management actions

- View verified payment status
- Move an order through fulfillment states
- Add internal notes
- Add or correct a tracking number
- Send a shipping notification
- Cancel an unpaid order
- Release an unpaid inventory reservation
- Start an authorized refund or store-credit workflow

The owner must not manually mark an order paid. Stripe events are the source of truth for payment status.

### Inventory audit history

Every inventory change should create an immutable inventory-movement record containing:

- Product
- Quantity change
- Reason
- Related order when applicable
- Acting owner or system actor
- Timestamp

This makes stock discrepancies diagnosable and prevents silent edits.

## 8. Database model

Use lowercase `snake_case` identifiers, timezone-aware timestamps, check constraints, foreign keys, and indexes on every foreign key used for joins or cascading deletes.

Use `bigint generated always as identity` for most internal primary keys. `profiles.id` should use the Supabase Auth user UUID because it references `auth.users(id)`. Use a separate non-sequential public identifier for customer-facing order URLs.

Store USD money as integer cents to avoid floating-point rounding. Preserve a price snapshot in every order item.

### `profiles`

| Column | Type/constraint | Purpose |
| --- | --- | --- |
| `id` | `uuid primary key references auth.users(id)` | Authenticated user identity |
| `display_name` | `text` | Customer-facing name |
| `phone` | `text` | Optional contact number |
| `created_at` | `timestamptz not null` | Account creation |
| `updated_at` | `timestamptz not null` | Last update |

Do not place payment-card information in this table. Stripe manages payment data.

### `staff_members`

| Column | Type/constraint | Purpose |
| --- | --- | --- |
| `user_id` | `uuid primary key references auth.users(id)` | Authorized owner identity |
| `role` | checked `text` | `owner` or a future restricted staff role |
| `active` | `boolean not null` | Immediate access disablement |
| `created_at` | `timestamptz not null` | Audit information |

Access to this table must be tightly restricted. Use it for fresh server-side owner checks.

### `categories`

| Column | Type/constraint | Purpose |
| --- | --- | --- |
| `id` | identity primary key | Internal category key |
| `slug` | unique `text` | Public route value |
| `name` | `text not null` | Display name |
| `sort_order` | `integer not null` | Owner-controlled order |
| `active` | `boolean not null` | Public visibility |

### `products`

| Column | Type/constraint | Purpose |
| --- | --- | --- |
| `id` | identity primary key | Internal product key |
| `public_id` | unique UUID | Safe external reference |
| `category_id` | indexed foreign key | Product category |
| `product_type` | checked `text` | `fish`, `accessory`, or `live_food` |
| `slug` | unique `text` | Product URL |
| `sku` | unique `text` | Inventory identifier |
| `name` | `text not null` | Product title |
| `description` | `text` | Store description |
| `price_cents` | nonnegative `bigint` | Current price |
| `currency` | checked `text` | Initially `usd` |
| `sex` | nullable checked `text` | `male` or `female` for fish |
| `variety` | `text` | Betta variety |
| `color` | `text` | Color description |
| `tail_type` | `text` | Tail or fin classification |
| `stock_on_hand` | nonnegative `integer` | Physical stock |
| `status` | checked `text` | `draft`, `active`, `reserved`, `sold`, or `archived` |
| `featured` | `boolean not null` | Homepage merchandising |
| `published_at` | nullable `timestamptz` | Public publication time |
| `created_at` | `timestamptz not null` | Creation time |
| `updated_at` | `timestamptz not null` | Last edit |

For an exact fish, enforce a maximum stock of one at the application and database layers.

Useful indexes include:

- Partial index for publicly active products ordered by publication date
- Composite indexes matching catalog filters such as `(product_type, sex, status, published_at)`
- Partial unique or lookup index for non-null SKU values
- Index on `category_id`

Choose indexes from real query shapes rather than adding an index to every column.

### `product_media`

| Column | Type/constraint | Purpose |
| --- | --- | --- |
| `id` | identity primary key | Media record |
| `product_id` | indexed foreign key | Parent product |
| `storage_path` | unique `text` | Supabase Storage object path |
| `media_type` | checked `text` | `image` or `video` |
| `alt_text` | `text` | Accessibility text |
| `sort_order` | `integer not null` | Gallery sequence |
| `created_at` | `timestamptz not null` | Upload time |

### `orders`

| Column | Type/constraint | Purpose |
| --- | --- | --- |
| `id` | identity primary key | Internal order key |
| `public_id` | unique UUID | Customer-facing route key |
| `order_number` | unique `text` | Human-readable support number |
| `customer_id` | nullable indexed UUID | Authenticated customer; null for guest |
| `email` | `text not null` | Order contact |
| `payment_status` | checked `text` | `unpaid`, `processing`, `paid`, `failed`, `refunded`, or `partially_refunded` |
| `fulfillment_status` | checked `text` | `unfulfilled`, `processing`, `ready_to_ship`, `shipped`, `delivered`, or `cancelled` |
| `subtotal_cents` | nonnegative `bigint` | Product subtotal snapshot |
| `shipping_cents` | nonnegative `bigint` | Shipping snapshot |
| `tax_cents` | nonnegative `bigint` | Tax snapshot |
| `credit_cents` | nonnegative `bigint` | Store credit applied |
| `total_cents` | nonnegative `bigint` | Charged total |
| `currency` | checked `text` | Initially `usd` |
| `stripe_checkout_session_id` | unique nullable `text` | Stripe reconciliation |
| `stripe_payment_intent_id` | unique nullable `text` | Payment reconciliation |
| `shipping_address` | structured JSON snapshot | Address used for this order |
| `tracking_number` | nullable `text` | Fulfillment data |
| `shipped_at` | nullable `timestamptz` | Shipment time |
| `created_at` | `timestamptz not null` | Order creation |
| `updated_at` | `timestamptz not null` | Last state change |

Create an index on `(customer_id, created_at desc)` for customer history and partial indexes for operational owner queues such as paid but unfulfilled orders.

### `order_items`

| Column | Type/constraint | Purpose |
| --- | --- | --- |
| `id` | identity primary key | Order-line key |
| `order_id` | indexed foreign key | Parent order |
| `product_id` | nullable indexed foreign key | Original product reference |
| `product_name` | `text not null` | Purchase-time snapshot |
| `sku` | `text` | Purchase-time snapshot |
| `image_url` | `text` | Purchase-time snapshot |
| `unit_price_cents` | nonnegative `bigint` | Purchase-time price |
| `quantity` | positive `integer` | Purchased quantity |
| `line_total_cents` | nonnegative `bigint` | Verified line total |

Historical order data must remain meaningful even after a product is renamed or archived.

### `inventory_reservations`

| Column | Type/constraint | Purpose |
| --- | --- | --- |
| `id` | identity primary key | Reservation key |
| `product_id` | indexed foreign key | Reserved inventory |
| `order_id` | indexed foreign key | Pending order |
| `quantity` | positive `integer` | Reserved quantity |
| `status` | checked `text` | `active`, `converted`, `released`, or `expired` |
| `expires_at` | indexed `timestamptz` | Release deadline |
| `created_at` | `timestamptz not null` | Reservation time |

Use a partial index on active reservations and a database transaction that locks requested product rows in a consistent ID order before checking availability.

### `inventory_movements`

| Column | Type/constraint | Purpose |
| --- | --- | --- |
| `id` | identity primary key | Audit entry |
| `product_id` | indexed foreign key | Changed product |
| `order_id` | nullable indexed foreign key | Related order |
| `quantity_delta` | nonzero `integer` | Increase or decrease |
| `reason` | checked `text` | Sale, restock, correction, cancellation, or release |
| `actor_user_id` | nullable UUID | Owner who made the change |
| `created_at` | `timestamptz not null` | Change time |

Do not update or delete historical inventory movements through the dashboard.

### `processed_stripe_events`

| Column | Type/constraint | Purpose |
| --- | --- | --- |
| `stripe_event_id` | `text primary key` | Webhook idempotency key |
| `event_type` | `text not null` | Received event type |
| `processed_at` | `timestamptz not null` | Completion time |

This prevents duplicate Stripe webhook deliveries from fulfilling an order twice.

### Optional later tables

- `store_credits` and `store_credit_transactions`
- `addresses`
- `discount_codes`
- `product_tags`
- `order_notes`
- `site_content`
- `notification_log`

Do not build optional tables until their workflow and owner requirements are approved.

## 9. Supabase security design

Enable RLS on every table in the exposed `public` schema. Explicitly grant only the operations each role needs.

### Required policy behavior

| Table/resource | Visitor | Customer | Owner |
| --- | --- | --- | --- |
| Published products/categories | Read active rows | Read active rows | Full authorized management |
| Product media | Public read for published products | Public read | Upload, reorder, replace, and delete |
| Profiles | None | Read/update own row | Limited support access |
| Orders | None | Read own orders | Read and update fulfillment fields |
| Order items | None | Read items belonging to own orders | Read for order fulfillment |
| Reservations | None | No direct browser access | Server-managed; owner read/release |
| Inventory movements | None | None | Read; controlled insert through server workflow |
| Stripe events | None | None | Server-only |
| Staff membership | None | None | Owner-only administration |

Important implementation rules:

- `TO authenticated` alone is not authorization. Include ownership checks such as `(select auth.uid()) = customer_id`.
- RLS update policies need both `USING` and `WITH CHECK` conditions.
- Index columns used by RLS, especially `customer_id` and product publication/status columns.
- Do not create RLS-bypassing `SECURITY DEFINER` functions merely to fix permission errors.
- If a private authorization helper is truly necessary, keep it in a non-exposed schema, include an explicit caller identity check, set an empty search path, and revoke direct execution from public roles.
- Views should use `security_invoker = true` or remain inaccessible to public API roles.
- Run Supabase database advisors after schema and policy changes.
- Verify policies as anonymous, authenticated customer A, authenticated customer B, and owner. Confirm customer A can never read or mutate customer B's data.

### Storage

Use a `product-media` bucket with:

- Public reads only for media intended for the storefront
- Owner-only upload, update, and delete access
- Generated unique object paths instead of trusting uploaded filenames
- File type and size validation on the server
- Image normalization and thumbnail generation before publication

Storage upsert requires `INSERT`, `SELECT`, and `UPDATE` permissions. Test both new uploads and replacements.

## 10. Authentication implementation

### Customer flow

1. Customer creates an account or continues as a guest.
2. Supabase establishes a cookie-based server-rendered session.
3. The server validates the session before returning private account data.
4. Customer order queries are protected by RLS and server authorization.
5. Password reset and email confirmation return only to approved application URLs.

### Owner flow

1. Create the initial owner account through a controlled administrative process.
2. Insert the user into the trusted staff table.
3. Require MFA enrollment.
4. Verify session and active staff status on every owner request.
5. Log sensitive inventory and order actions.
6. Removing staff access must immediately prevent new privileged operations; also revoke active sessions when access is removed.

Use the current Supabase SSR package recommended by the official documentation at implementation time. Supabase packages and authentication conventions change; confirm the changelog before installing and pin the selected versions.

## 11. Stripe payment and inventory flow

Use Stripe Checkout Sessions with `mode: payment`. Hosted Checkout is recommended for the first release because Stripe handles the payment form, authentication requirements, and much of the payment lifecycle.

### Checkout creation

1. Customer selects Checkout.
2. Server parses and validates the cart.
3. Server retrieves current products and prices from PostgreSQL.
4. In a short database transaction:
   - Lock requested product rows in consistent ID order.
   - Confirm the products are active and available.
   - Create an unpaid order and immutable order items.
   - Create active inventory reservations.
5. Commit the database transaction before calling Stripe.
6. Create a Stripe Checkout Session with:
   - `mode: payment`
   - Server-generated line items
   - Shipping-address collection
   - Approved shipping rates
   - The internal order public ID in metadata
   - Success and cancellation URLs
   - A configured session expiration compatible with the inventory hold policy
7. Store the Stripe Checkout Session ID on the order.
8. Return only the Stripe Checkout URL or required client secret to the customer.

Do not hold database locks while calling the Stripe API. If Session creation fails, immediately mark the pending order failed and release its reservations.

### Payment webhook

Create a dedicated server endpoint such as `/api/stripe/webhook`.

The endpoint must:

1. Read the raw request body.
2. Verify the Stripe signature with `STRIPE_WEBHOOK_SECRET`.
3. Reject invalid signatures.
4. Insert the Stripe event ID into `processed_stripe_events`.
5. If that event ID already exists, return success without processing twice.
6. Retrieve and verify the related order.
7. In a short transaction, update payment status, convert reservations, reduce stock, and create inventory movements.
8. Queue or send confirmation email after the database state is committed.
9. Return a successful response quickly so Stripe does not needlessly retry.

Events to design for include:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded` when delayed payment methods are enabled
- `checkout.session.async_payment_failed` when delayed payment methods are enabled
- `checkout.session.expired`
- Relevant refund events for reconciliation

The webhook and fulfillment function must be idempotent and safe when called concurrently.

### Success page

The success page receives a Checkout Session identifier, then asks the server for verified order status. It must never mark an order paid from a query parameter or browser redirect alone. Webhooks remain the reliable payment source because a customer may pay and never reach the success page.

### Expired or abandoned checkout

When a Session expires:

1. Verify the Stripe event.
2. Mark the unpaid order expired or cancelled.
3. Release active reservations.
4. Return products to available status when stock permits.
5. Record the inventory action.

Also run a scheduled reconciliation task for reservations that passed `expires_at` but did not receive a usable event. It should verify current Stripe state before releasing inventory.

### Refunds and store credit

Define one approved workflow before implementation.

- A refund is a Stripe payment operation and must synchronize back to the order.
- Store credit is a business balance or controlled discount, not a change to Stripe's historical payment result.
- Do not let an owner change totals or credit balances with an unrestricted text field.
- Every refund or credit action needs an actor, reason, amount, timestamp, and related order.

## 12. Order and inventory states

### Payment status

```text
unpaid → processing → paid
unpaid → failed
paid → partially_refunded
paid or partially_refunded → refunded
```

### Fulfillment status

```text
unfulfilled → processing → ready_to_ship → shipped → delivered
unfulfilled or processing → cancelled
```

### Product status for an exact fish

```text
draft → active → reserved → sold → archived
                  └────────→ active   when a valid reservation is released
```

Define allowed transitions in one server-side domain module. Do not let arbitrary UI values bypass the transition rules.

## 13. Email and notifications

Minimum transactional emails:

- Account verification if enabled
- Password reset
- Order confirmation after verified payment
- Shipping confirmation with tracking
- Order cancellation
- Live-arrival claim acknowledgment if claims are handled through the site

Email sending should be retryable. Record the notification type, order, recipient, provider identifier, and delivery attempt so duplicate webhooks do not send duplicate confirmations.

If customized Supabase Auth templates are required, configure a production SMTP provider; do not depend on development/default email delivery for launch.

## 14. Proposed repository structure

```text
app/
  (store)/
    page.tsx
    shop/
    bettas/
    new-arrivals/
    accessories/
    live-foods/
    cart/
    checkout/
    account/
    about/
    shipping/
    live-arrival-guarantee/
    store-credit-policy/
    contact/
  (auth)/
    auth/sign-in/
    auth/sign-up/
    auth/forgot-password/
  owner/
    page.tsx
    products/
    inventory/
    orders/
    customers/
    content/
    settings/
  api/
    stripe/checkout/route.ts
    stripe/webhook/route.ts
components/
  storefront/
  owner/
  forms/
  ui/
lib/
  auth/
  database/
  inventory/
  orders/
  stripe/
  validation/
supabase/
  migrations/
  seed.sql
tests/
  unit/
  integration/
  e2e/
sources/
  betta-freaks-web-app-implementation-plan.md
```

Keep payment, inventory, authorization, and order-state logic in server/domain modules rather than React components.

## 15. Environment configuration

Use separate local, staging, and production environments. Production must have its own Supabase project or carefully controlled production database and its own Stripe live credentials.

Expected environment variables include:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
TRANSACTIONAL_EMAIL_API_KEY
TRANSACTIONAL_EMAIL_FROM
```

If Stripe's embedded UI is chosen instead of hosted Checkout, add the Stripe publishable key. Keep all secret values in the hosting provider's encrypted environment configuration. Never commit `.env` files containing credentials.

## 16. Development phases

### Phase 0: Requirements and content

Tasks:

- Approve catalog types and product fields.
- Approve guest checkout and account behavior.
- Define the shipping process.
- Define reservation timing.
- Complete the three policies.
- Decide tax and store-credit handling.
- Select final logo and approve homepage direction.
- Collect launch-quality fish images and videos.

Exit criteria:

- No unresolved business rule can change the data model or checkout flow.

### Phase 1: Project foundation

Tasks:

- Create the Next.js TypeScript application.
- Configure formatting, linting, type checks, and tests.
- Create local, staging, and production environment strategy.
- Configure Supabase and Stripe test accounts.
- Establish the design tokens and reusable components.
- Implement public layout, navigation, footer, and responsive foundations.
- Add continuous integration for lint, type checking, tests, and production build.

Exit criteria:

- The empty application deploys successfully to staging and passes automated checks.

### Phase 2: Database, storage, and authentication

Tasks:

- Create schema migrations and seed data.
- Add constraints and required indexes.
- Enable RLS and explicit Data API grants.
- Configure the product-media bucket and policies.
- Implement customer sign-in, registration, recovery, and session handling.
- Implement the staff table, owner checks, and MFA requirement.
- Test every role against every protected table and route.
- Run Supabase database and security advisors.

Exit criteria:

- Customer A cannot access customer B's data.
- A normal customer cannot call any owner mutation.
- Public users only see published inventory.
- Owners can upload and replace media without exposing secret credentials.

### Phase 3: Owner catalog and inventory dashboard

Tasks:

- Build product list, search, and filters.
- Build product creation and editing forms.
- Add image/video upload, ordering, and deletion.
- Add publish, archive, featured, and availability controls.
- Build inventory adjustment workflow.
- Add immutable inventory movements.
- Add input validation and owner action logging.

Exit criteria:

- An owner can create, publish, edit, sell out, restock, and archive products without database-console access.

### Phase 4: Storefront and customer account

Tasks:

- Build homepage from the design brief.
- Build category and filtered catalog pages.
- Build product detail pages.
- Build cart and server-side cart validation.
- Build customer profile and owned order-history pages.
- Add responsive behavior, keyboard navigation, image alt text, and loading/error states.
- Add product metadata, canonical URLs, and structured product data where appropriate.

Exit criteria:

- A mobile or desktop visitor can find a fish, filter by sex, inspect it, add it to cart, and reach checkout.

### Phase 5: Stripe checkout and scarce inventory

Tasks:

- Implement pending orders and inventory reservations.
- Implement server-created Checkout Sessions in `payment` mode.
- Implement signed webhook verification.
- Implement idempotent payment fulfillment.
- Implement Session expiration and reservation release.
- Implement payment reconciliation and failure handling.
- Test simultaneous attempts to purchase the same fish.
- Test webhook retries and out-of-order events.

Exit criteria:

- A paid order appears once, exact inventory is reduced once, and the same fish cannot be sold twice.

### Phase 6: Fulfillment and communication

Tasks:

- Build owner order queue and detail pages.
- Add fulfillment-state transitions.
- Add tracking-number workflow.
- Send order and shipping emails.
- Add cancellation, refund, or store-credit workflow according to the approved rules.
- Add order and notification audit history.

Exit criteria:

- An owner can take a verified paid order from processing to shipped without using the database or Stripe Dashboard for ordinary fulfillment.

### Phase 7: Hardening and content readiness

Tasks:

- Complete unit, integration, RLS, webhook, and end-to-end tests.
- Run accessibility checks.
- Verify mobile layouts and large-image performance.
- Add rate limiting to sensitive public endpoints.
- Validate file-upload limits and types.
- Test backups and recovery procedures.
- Review logging to ensure secrets and unnecessary personal data are excluded.
- Review policies and content against actual operations.
- Run dependency and database security checks.

Exit criteria:

- All launch-critical tests pass and no high-severity security issue remains.

### Phase 8: Production launch

Tasks:

- Configure the production domain and HTTPS.
- Configure Supabase production URLs, email, storage, RLS, and backups.
- Activate Stripe live keys and production webhook endpoint.
- Configure production shipping rates and taxes.
- Create and verify the initial owner account and MFA.
- Import real inventory.
- Place a controlled live order and reconcile the website, Stripe, database, email, and inventory records.
- Set up uptime, error, payment-failure, and webhook-failure alerts.
- Document the owner workflow.

Exit criteria:

- The store can accept, verify, fulfill, and reconcile a real purchase end to end.

## 17. Test plan

### Unit tests

- Price and total calculations
- Product and order validation
- Allowed state transitions
- Store-credit calculations if implemented
- Reservation-expiration decisions
- Authorization helpers

### Database and RLS tests

- Public access to active products only
- No public order access
- Customer reads only their own profile and orders
- Customer cannot change payment or fulfillment fields
- Owner can perform approved operations
- Deactivated owner loses access
- Storage upload, replacement, and deletion policies

### Stripe integration tests

- Successful card payment
- Failed payment
- Abandoned and expired Checkout Session
- Duplicate webhook delivery
- Concurrent webhook delivery
- Invalid webhook signature
- Delayed payment success/failure if such methods are enabled
- Refund reconciliation

### Inventory concurrency tests

- Two customers attempt the same exact fish simultaneously
- Multi-item carts lock products in a consistent order
- Failed Stripe Session creation releases inventory
- Expired reservation becomes available again
- Paid reservation never becomes available again
- Manual stock correction creates an audit movement

### End-to-end tests

- Visitor filters male/female bettas
- Customer completes guest checkout
- Customer signs in and reads their order
- Customer cannot read another order by changing a URL
- Owner creates and publishes a fish
- Owner fulfills a paid order and adds tracking
- Non-owner receives an authorization error on owner routes and actions

### Visual and accessibility tests

- Phone, tablet, laptop, and large desktop widths
- Keyboard-only navigation
- Visible focus states
- Form labels and error messages
- Image alt text
- Color contrast
- Reduced-motion behavior
- Empty, sold-out, loading, and error states

## 18. Launch checklist

### Business

- [ ] Shipping policy approved
- [ ] Live-arrival guarantee approved
- [ ] No-refund/store-credit policy approved
- [ ] Shipping territory and schedule configured
- [ ] Taxes configured
- [ ] Customer-support email monitored
- [ ] Launch inventory verified

### Security

- [ ] Owner MFA enabled
- [ ] RLS enabled on every exposed table
- [ ] Data API grants reviewed
- [ ] Secret/service credentials absent from browser bundles
- [ ] Stripe webhook signatures verified
- [ ] Upload restrictions verified
- [ ] Rate limits applied where needed
- [ ] Database advisors reviewed
- [ ] Dependency audit reviewed

### Payments and inventory

- [ ] Stripe live account activated
- [ ] Production webhook receiving events
- [ ] Duplicate event handling tested
- [ ] Exact-fish oversell test passed
- [ ] Session expiration releases reservations
- [ ] Paid order inventory conversion verified
- [ ] Refund/store-credit workflow verified

### Customer experience

- [ ] Product filters work on mobile and desktop
- [ ] Sold products cannot be purchased
- [ ] Cart repricing and unavailable-item messages work
- [ ] Confirmation and shipping emails work
- [ ] Order history is private and accurate
- [ ] Policies are linked before checkout
- [ ] Contact and social links work

### Operations

- [ ] Owner can publish products
- [ ] Owner can adjust inventory with an audit record
- [ ] Owner can process and ship orders
- [ ] Error and webhook alerts reach the owner
- [ ] Backup and recovery process documented
- [ ] Controlled live purchase reconciled across all systems

## 19. Suggested delivery schedule

For one experienced full-time developer, a professional MVP is approximately 8 to 10 weeks after the business rules and content are ready.

| Week | Primary focus |
| --- | --- |
| 1 | Requirements, visual system, repository, deployment, and environments |
| 2 | Database, storage, authentication, RLS, and owner authorization |
| 3–4 | Owner product, media, and inventory dashboard |
| 5–6 | Storefront, filtering, product pages, cart, and customer account |
| 7 | Stripe Checkout, webhooks, reservations, and concurrency handling |
| 8 | Orders, fulfillment, tracking, and transactional email |
| 9 | Security, accessibility, performance, and end-to-end testing |
| 10 | Production setup, content entry, controlled live order, and launch |

The schedule expands if the first release includes automated carrier purchasing, advanced store credit, complex tax rules, multiple staff roles, multilingual content, or extensive product migration.

## 20. Definition of done

The MVP is complete only when all of the following are true:

- Customers can discover and purchase available inventory from phone or desktop.
- Male/female filtering works.
- Exact fish cannot be sold twice.
- Stripe confirms payments through a signed, idempotent webhook.
- Customers can access only their own account and orders.
- Owners can manage products, media, stock, orders, fulfillment, and tracking without database access.
- Every stock change is traceable.
- Required policies are visible before purchase.
- Test, staging, and production credentials are separated.
- Automated quality checks and the controlled live-purchase test pass.
- Monitoring can alert the owner to payment, webhook, and application failures.

## 21. Official implementation references

### Stripe

- [Checkout Sessions API](https://docs.stripe.com/payments/checkout-sessions)
- [How Checkout works](https://docs.stripe.com/payments/checkout/how-checkout-works)
- [Checkout order fulfillment](https://docs.stripe.com/checkout/fulfillment)
- [Webhook endpoints and signature verification](https://docs.stripe.com/webhooks)
- [Managing limited inventory](https://docs.stripe.com/payments/checkout/managing-limited-inventory)
- [Checkout Sessions versus Payment Intents](https://docs.stripe.com/payments/checkout-sessions-and-payment-intents-comparison)

### Supabase

- [Supabase changelog](https://supabase.com/changelog)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Supabase server package selection](https://supabase.com/docs/guides/auth/choosing-a-server-package)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Securing the Data API](https://supabase.com/docs/guides/api/securing-your-api)
- [Supabase user data management](https://supabase.com/docs/guides/auth/managing-user-data)
- [Supabase product security](https://supabase.com/docs/guides/security/product-security)

### Next.js and PostgreSQL

- [Next.js authentication and authorization](https://nextjs.org/docs/app/guides/authentication)
- [PostgreSQL data types](https://www.postgresql.org/docs/current/datatype.html)
- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL transaction management](https://www.postgresql.org/docs/current/tutorial-transactions.html)
