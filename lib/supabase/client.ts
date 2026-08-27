"use client";

import { createBrowserClient } from "@supabase/ssr";

import { hasSupabaseEnvironment } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export const createBrowserSupabaseClient = () => {
  if (!hasSupabaseEnvironment()) {
    return null;
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
};
