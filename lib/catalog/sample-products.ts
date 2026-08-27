import type { Product, ProductSex, ProductType } from "@/lib/commerce/types";

export const sampleProducts: Product[] = [
  {
    id: "f2d1ae8e-267f-41c8-8ca5-5ef6724d0061",
    slug: "crimson-rosetail-male",
    sku: "BF-DEMO-001",
    name: "Crimson Rosetail Male",
    shortName: "Crimson Rosetail",
    description:
      "A sample exact-fish listing used to shape the Betta Freaks shopping experience. Replace this record with the photographed specimen before launch.",
    priceCents: 8500,
    currency: "usd",
    type: "fish",
    sex: "male",
    variety: "Rosetail",
    color: "Crimson red",
    tailType: "Halfmoon",
    stockOnHand: 1,
    status: "active",
    featured: true,
    isExactFish: true,
    isDemo: true,
    image: "/media/red-betta-showcase.jpg",
    imageAlt: "Crimson red show-quality betta fish facing the camera",
    imageTone: "natural",
  },
  {
    id: "a1f5f3be-49fa-442c-a7d7-3aa63cc4ad24",
    slug: "scarlet-plakat-female",
    sku: "BF-DEMO-002",
    name: "Scarlet Plakat Female",
    shortName: "Scarlet Plakat",
    description:
      "A sample female inventory record demonstrating sex-based filtering and exact-fish availability.",
    priceCents: 6800,
    currency: "usd",
    type: "fish",
    sex: "female",
    variety: "Plakat",
    color: "Scarlet",
    tailType: "Short fin",
    stockOnHand: 1,
    status: "active",
    featured: true,
    isExactFish: true,
    isDemo: true,
    image: "/media/red-betta-showcase.jpg",
    imageAlt: "Sample media placement for a scarlet female betta listing",
    imageTone: "warm",
  },
  {
    id: "be35a034-9a84-4f7f-8722-38e639d601e5",
    slug: "copper-halfmoon-male",
    sku: "BF-DEMO-003",
    name: "Copper Halfmoon Male",
    shortName: "Copper Halfmoon",
    description:
      "A sample new-arrival record. Product media and specimen details will come from the owner's live inventory.",
    priceCents: 9200,
    currency: "usd",
    type: "fish",
    sex: "male",
    variety: "Halfmoon",
    color: "Copper",
    tailType: "Halfmoon",
    stockOnHand: 1,
    status: "active",
    featured: false,
    isExactFish: true,
    isDemo: true,
    image: "/media/red-betta-showcase.jpg",
    imageAlt: "Sample media placement for a copper halfmoon betta listing",
    imageTone: "cool",
  },
];

type CatalogFilters = {
  sex?: ProductSex | "all";
  type?: ProductType | "all";
};

export const getCatalogProducts = ({ sex = "all", type = "all" }: CatalogFilters = {}) =>
  sampleProducts.filter(
    (product) =>
      product.status === "active" &&
      (sex === "all" || product.sex === sex) &&
      (type === "all" || product.type === type),
  );

export const getProductBySlug = (slug: string) =>
  sampleProducts.find(
    (product) => product.slug === slug && product.status === "active",
  );
