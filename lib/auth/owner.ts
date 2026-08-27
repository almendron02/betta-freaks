import { createServerSupabaseClient } from "@/lib/supabase/server";

export type OwnerAccess =
  | { state: "not_configured" }
  | { state: "signed_out" }
  | { state: "forbidden"; email: string | null }
  | { state: "authorized"; email: string | null; userId: string };

export const getOwnerAccess = async (): Promise<OwnerAccess> => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { state: "not_configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { state: "signed_out" };
  }

  const { data: staff } = await supabase
    .from("staff_members")
    .select("active")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (!staff) {
    return { state: "forbidden", email: user.email ?? null };
  }

  return {
    state: "authorized",
    email: user.email ?? null,
    userId: user.id,
  };
};
