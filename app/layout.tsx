import localFont from "next/font/local";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CartProvider } from "@/components/cart/cart-provider";
import { SiteMotionProvider } from "@/components/motion/motion-provider";
import { SiteFooter } from "@/components/storefront/site-footer";
import { GalleryMenu } from "@/components/storefront/gallery-menu";
import { CardMotion } from "@/components/motion/card-motion";

import "./globals.css";

const outfit = localFont({
  src: [
    { path: "./fonts/outfit-400.ttf", weight: "400" },
    { path: "./fonts/outfit-600.ttf", weight: "600" },
    { path: "./fonts/outfit-800.ttf", weight: "800" },
  ], variable: "--font-street-body", display: "swap",
});
const archivo = localFont({ src: "./fonts/archivo-black.ttf", variable: "--font-street-display", display: "swap" });

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
    <html lang="en" data-scroll-behavior="smooth" className={`${outfit.variable} ${archivo.variable}`}>
      <body>
        <SiteMotionProvider>
          <CartProvider>
            <CardMotion />
            <main>{children}</main>
            <SiteFooter />
            <GalleryMenu />
          </CartProvider>
        </SiteMotionProvider>
      </body>
    </html>
  );
}
