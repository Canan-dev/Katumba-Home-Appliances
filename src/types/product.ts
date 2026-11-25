export type ProductCategory =
  | "Living Room"
  | "Dining Room"
  | "Bedroom"
  | "Storage"
  | "Home Appliances";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Living Room",
  "Dining Room",
  "Bedroom",
  "Storage",
  "Home Appliances",
];

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  priceUGX: number;
  imageUrl: string;
  material: string;
  dimensions: string;
  description: string;
  swatches?: string[];
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  createdAt?: number;
}
