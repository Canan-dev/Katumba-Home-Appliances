"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  MessageCircle,
  Ruler,
  Layers,
  Truck,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Product } from "@/types/product";
import { formatUGX, buildWhatsAppOrderUrl } from "@/lib/format";
import ProductCard from "./ProductCard";

interface ProductModalProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductModal({
  product,
  allProducts,
  onClose,
  onSelectProduct,
}: ProductModalProps) {
  const [zoomed, setZoomed] = useState(false);
  const [panOrigin, setPanOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setZoomed(false);
    setPanOrigin({ x: 50, y: 50 });
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  // Related products: 3–4 from the same category, padded with others if needed
  const sameCategory = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  const fallbackOthers = allProducts.filter(
    (p) => p.category !== product.category && p.id !== product.id
  );
  const relatedProducts = [...sameCategory, ...fallbackOthers].slice(0, 4);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPanOrigin({ x, y });
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#F7F4EF]"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      {/* Top Sticky Bar */}
      <div className="sticky top-0 z-20 border-b border-[#E4DDD3] bg-[#F7F4EF]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-medium text-[#6E6058]">
            <button
              type="button"
              onClick={onClose}
              className="font-semibold text-[#2C221E] hover:underline"
            >
              Storefront
            </button>
            <span>/</span>
            <span>{product.category}</span>
            <span className="hidden sm:inline">/</span>
            <span className="hidden truncate font-semibold text-[#2C221E] sm:inline">
              {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D8CFC3] bg-white px-4 py-1.5 text-xs font-semibold text-[#2C221E] shadow-sm transition-colors hover:bg-[#EFE9E0]"
          >
            <X className="h-4 w-4" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Main Product Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Zoomable Product Photo */}
          <div className="lg:col-span-7">
            <div
              onClick={() => setZoomed((z) => !z)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setPanOrigin({ x: 50, y: 50 })}
              className={`relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#E4DDD3] bg-[#EFE9E0] shadow-sm ${
                zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  transformOrigin: `${panOrigin.x}% ${panOrigin.y}%`,
                  transform: zoomed ? "scale(2)" : "scale(1)",
                }}
                className="h-full w-full object-cover object-center transition-transform duration-300 ease-out"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomed((z) => !z);
                }}
                className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-[#2C221E]/85 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-[#2C221E]"
              >
                {zoomed ? (
                  <>
                    <ZoomOut className="h-4 w-4" />
                    <span>Reset Zoom</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="h-4 w-4" />
                    <span>Click to Zoom</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-2.5 text-center text-xs text-[#6E6058]">
              Tip: Click the photo to zoom in and move your cursor to inspect
              material details.
            </p>
          </div>

          {/* Product Details & WhatsApp CTA */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <span className="inline-block w-fit rounded-full bg-[#EFE9E0] px-3.5 py-1 text-[11px] font-bold tracking-[0.12em] text-[#5C4332] uppercase">
              {product.category}
            </span>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#2C221E] sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center text-[#C98A3A]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating ?? 4.8)
                        ? "fill-current"
                        : "opacity-30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-[#6E6058]">
                {(product.rating ?? 4.8).toFixed(1)} ({product.reviewCount ?? 24}{" "}
                customer reviews)
              </span>
            </div>

            <p className="mt-5 text-2xl font-extrabold text-[#5C4332] sm:text-3xl">
              {formatUGX(product.priceUGX)}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[#4F433C] sm:text-base">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="mt-6 space-y-3 rounded-2xl border border-[#E4DDD3] bg-white p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Layers className="mt-0.5 h-4 w-4 shrink-0 text-[#5C4332]" />
                <div>
                  <p className="text-[11px] font-bold tracking-[0.08em] text-[#6E6058] uppercase">
                    Wood / Material Details
                  </p>
                  <p className="text-sm font-medium text-[#2C221E]">
                    {product.material}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#EFE9E0] pt-3 flex items-start gap-3">
                <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-[#5C4332]" />
                <div>
                  <p className="text-[11px] font-bold tracking-[0.08em] text-[#6E6058] uppercase">
                    Dimensions
                  </p>
                  <p className="text-sm font-medium text-[#2C221E]">
                    {product.dimensions}
                  </p>
                </div>
              </div>
            </div>

            {/* Order on WhatsApp CTA */}
            <div className="mt-6 space-y-3">
              <a
                href={buildWhatsAppOrderUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#5C4332] px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-[#483326] active:scale-[0.99]"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Order on WhatsApp</span>
              </a>
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#6E6058]">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-[#5C4332]" />
                  Kampala &amp; upcountry delivery
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#5C4332]" />
                  Pay on confirmation / Mobile Money
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 border-t border-[#E4DDD3] pt-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-extrabold tracking-tight text-[#2C221E] sm:text-2xl">
                You May Also Like
              </h2>
              <span className="text-xs font-semibold tracking-[0.1em] text-[#6E6058] uppercase">
                More from {product.category}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onSelect={(item) => {
                    onSelectProduct(item);
                    const modalEl = document.querySelector('[role="dialog"]');
                    if (modalEl) modalEl.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
