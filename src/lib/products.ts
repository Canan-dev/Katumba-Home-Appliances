import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { SAMPLE_PRODUCTS } from "@/data/sampleProducts";
import { Product } from "@/types/product";

export const PRODUCTS_COLLECTION = "products";

/** Maps a raw Firestore document to a typed Product. */
function docToProduct(doc: { id: string; data: () => Record<string, unknown> }): Product {
  const data = doc.data();
  return {
    id: doc.id,
    name: String(data.name || "Untitled Item"),
    category: (data.category as Product["category"]) || "Living Room",
    priceUGX: Number(data.priceUGX || 0),
    imageUrl: String(data.imageUrl || SAMPLE_PRODUCTS[0].imageUrl),
    material: String(data.material || "Solid Ugandan Hardwood"),
    dimensions: String(data.dimensions || "Standard Showroom Size"),
    description: String(data.description || ""),
    swatches: Array.isArray(data.swatches) ? (data.swatches as string[]) : undefined,
    rating: typeof data.rating === "number" ? data.rating : 4.8,
    reviewCount: typeof data.reviewCount === "number" ? data.reviewCount : 12,
    featured: Boolean(data.featured),
    createdAt: typeof data.createdAt === "number" ? data.createdAt : Date.now(),
  };
}

/**
 * Subscribe to real-time product updates from Firestore.
 * The callback fires immediately with the current list, then again
 * whenever a product is added, edited, or deleted — no page refresh needed.
 *
 * Falls back to SAMPLE_PRODUCTS if Firebase is not configured.
 * Returns an unsubscribe function — call it in a useEffect cleanup.
 */
export function subscribeToProducts(
  callback: (products: Product[], source: "firestore" | "sample") => void
): () => void {
  if (!isFirebaseConfigured || !db) {
    callback(SAMPLE_PRODUCTS, "sample");
    return () => {};
  }

  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(SAMPLE_PRODUCTS, "sample");
      } else {
        const products = snapshot.docs.map(docToProduct);
        callback(products, "firestore");
      }
    },
    (error) => {
      console.warn("Firestore live feed fell back to sample catalog:", error);
      callback(SAMPLE_PRODUCTS, "sample");
    }
  );

  return unsubscribe;
}
