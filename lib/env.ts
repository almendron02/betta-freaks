const isNonEmpty = (value: string | undefined): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const hasSupabaseEnvironment = () =>
  isNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  isNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export const hasSupabaseSecretEnvironment = () =>
  hasSupabaseEnvironment() && isNonEmpty(process.env.SUPABASE_SECRET_KEY);

export const hasStripeEnvironment = () =>
  isNonEmpty(process.env.STRIPE_SECRET_KEY) &&
  isNonEmpty(process.env.NEXT_PUBLIC_SITE_URL);

export const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";
