export const getSafeNextPath = (
  value: string | null | undefined,
  fallback = "/account",
) => (value?.startsWith("/") && !value.startsWith("//") ? value : fallback);
