import type { NextConfig } from "next";

const productMediaRemotePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [
  {
    protocol: "https",
    hostname: "**.supabase.co",
    pathname: "/storage/v1/object/public/product-media/**",
  },
];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  productMediaRemotePatterns.push({
    protocol: supabaseUrl.protocol === "http:" ? "http" : "https",
    hostname: supabaseUrl.hostname,
    port: supabaseUrl.port,
    pathname: "/storage/v1/object/public/product-media/**",
  });
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: productMediaRemotePatterns,
  },
  poweredByHeader: false,
};

export default nextConfig;
