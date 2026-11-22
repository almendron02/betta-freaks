import type { Product } from "@/lib/commerce/types";

export const aquariumImages = [{"src": "/media/catalog/aquarium-1.png", "alt": "Aquarium 1", "name": "Aquarium 1", "priceCents": 8999}, {"src": "/media/catalog/aquarium-2.png", "alt": "Aquarium 2", "name": "Aquarium 2", "priceCents": 14999}, {"src": "/media/catalog/aquarium-3.png", "alt": "Aquarium 3", "name": "Aquarium 3", "priceCents": 10999}, {"src": "/media/catalog/aquarium-4.png", "alt": "Aquarium 4", "name": "Aquarium 4", "priceCents": 12999}, {"src": "/media/catalog/aquarium-5.png", "alt": "Aquarium 5", "name": "Aquarium 5", "priceCents": 17999}];
export const foodImages = [{"src": "/media/catalog/food-1.png", "alt": "Aqueon PRO Betta Food", "name": "Aqueon PRO Betta Food", "priceCents": 999}, {"src": "/media/catalog/food-2.png", "alt": "San Francisco Bay Betta Food", "name": "San Francisco Bay Betta Food", "priceCents": 649}, {"src": "/media/catalog/food-3.png", "alt": "Betta Fish Food", "name": "Betta Fish Food", "priceCents": 799}];

export function displayItemProduct(item: (typeof aquariumImages)[number]): Product {
  const slug = item.src.split("/").pop()!.replace(".png", "");
  return {
    id: `preview-${slug}`, slug, sku: `PREVIEW-${slug.toUpperCase()}`,
    name: item.name, shortName: item.name,
    description: "Preview item with a sample price.",
    priceCents: item.priceCents, currency: "usd", type: "accessory",
    stockOnHand: 1, status: "active", featured: false,
    isExactFish: false, isDemo: true, image: item.src, imageAlt: item.alt,
  };
}
