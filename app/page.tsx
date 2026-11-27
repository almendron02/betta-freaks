import { redirect } from "next/navigation";
import { StoreHome } from "@/components/storefront/store-home";
import { getSafeNextPath } from "@/lib/auth/redirect";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { code, next } = await searchParams;
  if (typeof code === "string") {
    const destination = getSafeNextPath(typeof next === "string" ? next : null);
    redirect(`/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(destination)}`);
  }
  return <StoreHome />;
}
