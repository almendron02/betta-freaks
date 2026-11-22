import { z } from "zod";

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .max(80, "Name must be 80 characters or fewer."),
  phone: z
    .string()
    .trim()
    .max(32, "Phone number must be 32 characters or fewer.")
    .refine(
      (value) => value.length === 0 || /^[0-9+().\-\s]+$/.test(value),
      "Enter a valid phone number.",
    ),
});

export type ProfileFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  errors?: {
    fullName?: string[];
    phone?: string[];
  };
};

export const initialProfileFormState: ProfileFormState = {
  status: "idle",
  message: null,
};

export const parseProfileForm = (formData: FormData) =>
  profileSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
  });
