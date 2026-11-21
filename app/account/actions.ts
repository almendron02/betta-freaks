"use server";

import { revalidatePath } from "next/cache";

import {
  parseProfileForm,
  type ProfileFormState,
} from "@/lib/auth/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function updateProfile(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const parsed = parseProfileForm(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { status: "error", message: "Account services are not configured." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Your session expired. Sign in again." };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName || null,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { status: "error", message: "We could not save your profile. Try again." };
  }

  revalidatePath("/account");
  return { status: "success", message: "Profile saved." };
}
