import "server-only";

import { cache } from "react";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AccountSession =
  | { state: "not_configured" }
  | { state: "signed_out" }
  | {
      state: "authenticated";
      email: string;
      userId: string;
      isStaff: boolean;
    };

export const getAccountSession = cache(async (): Promise<AccountSession> => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) return { state: "not_configured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { state: "signed_out" };

  const { data: staff } = await supabase
    .from("staff_members")
    .select("active")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  return {
    state: "authenticated",
    email: user.email ?? "Signed-in account",
    userId: user.id,
    isStaff: Boolean(staff),
  };
});
