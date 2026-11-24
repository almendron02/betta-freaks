import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CartProvider } from "@/components/cart/cart-provider";
import { SiteMotionProvider } from "@/components/motion/motion-provider";
import { SiteFooter } from "@/components/storefront/site-footer";
import { GalleryMenu } from "@/components/storefront/gallery-menu";
import { CardMotion } from "@/components/motion/card-motion";

import "./globals.css";

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
