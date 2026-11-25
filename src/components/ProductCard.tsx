"use client";

import React from "react";
import { Star, MessageCircle } from "lucide-react";
import { Product } from "@/types/product";
import { formatUGX, buildWhatsAppOrderUrl } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const rating = product.rating ?? 4.8;
  const reviews = product.reviewCount ?? 24;

  return (
    <article
      onClick={() => onSelect(product)}
      className="product-card-reveal group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#E4DDD3] bg-white shadow-[0_2px_12px_rgba(44,34,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(44,34,30,0.09)]"
    >
      {/* Top Image Container: strictly fills and covers entire top area with consistent 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFE9E0]">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-[#F7F4EF]/90 px-3 py-1 text-[10px] font-bold tracking-[0.08em] text-[#2C221E] uppercase backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <h3 className="line-clamp-1 text-base font-bold text-[#2C221E] transition-colors group-hover:text-[#5C4332]">
            {product.name}
          </h3>

          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center text-[#C98A3A]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(rating) ? "fill-current" : "opacity-30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-[#6E6058]">({reviews})</span>
          </div>

          <p className="mt-2.5 text-base font-extrabold tracking-tight text-[#2C221E]">
            {formatUGX(product.priceUGX)}
          </p>

          {/* Swatches */}
          {product.swatches && product.swatches.length > 0 && (
            <div className="mt-2.5 flex items-center gap-1.5">
              {product.swatches.map((hex, index) => (
                <span
                  key={`${product.id}-swatch-${index}`}
                  className="h-3.5 w-3.5 rounded-full border border-[#D4C9BC]"
                  style={{ backgroundColor: hex }}
                  title="Finish option"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 rounded-full border border-[#5C4332]/30 bg-[#F7F4EF] px-3 py-2 text-xs font-semibold text-[#2C221E] transition-colors hover:border-[#5C4332] hover:bg-[#EFE9E0]"
          >
            View Details
          </button>
          <a
            href={buildWhatsAppOrderUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#5C4332] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#483326]"
            title="Order on WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Order</span>
          </a>
        </div>
      </div>
    </article>
  );
}
