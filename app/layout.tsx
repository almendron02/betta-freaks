import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { CartProvider } from "@/components/cart/cart-provider";
import { SiteMotionProvider } from "@/components/motion/motion-provider";
import { SiteFooter } from "@/components/storefront/site-footer";
import { GalleryMenu } from "@/components/storefront/gallery-menu";
import { SiteHeader } from "@/components/storefront/site-header";

import "./globals.css";

const outfit = localFont({
  src: [
    { path: "./fonts/outfit-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/outfit-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/outfit-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/outfit-700.ttf", weight: "700", style: "normal" },
    { path: "./fonts/outfit-800.ttf", weight: "800", style: "normal" },
    { path: "./fonts/outfit-900.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-outfit",
  display: "swap",
});

const archivoBlack = localFont({
  src: "./fonts/archivo-black.ttf",
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Betta Freaks | Show-quality betta fish",
    template: "%s | Betta Freaks",
  },
  description:
    "A U.S.-based betta fish shop and specialist breeder focused on selectively bred, show-quality Betta splendens.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${outfit.variable} ${archivoBlack.variable}`}>
        <SiteMotionProvider>
          <CartProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <GalleryMenu />
          </CartProvider>
        </SiteMotionProvider>
      </body>
    </html>
  );
}
