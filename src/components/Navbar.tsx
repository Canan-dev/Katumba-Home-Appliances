"use client";

import React, { useState } from "react";
import {
  Search,
  MessageCircle,
  X,
  Home,
  ShoppingBag,
  LayoutGrid,
  MapPin,
} from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  onNavigateSection,
}: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { label: "HOME", target: "hero" },
    { label: "SHOP", target: "products" },
    { label: "COLLECTIONS", target: "collections" },
    { label: "CRAFTSMANSHIP", target: "craftsmanship" },
    { label: "CONTACT", target: "footer" },
  ];

  const handleNavClick = (target: string) => {
    onNavigateSection(target);
  };

  const whatsappGeneralUrl = `https://wa.me/${(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "256700000000"
  ).replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    "Hello Katumba Home Appliances! I have a question about your furniture and appliances."
  )}`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E4DDD3]/80 bg-[#F7F4EF]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5C4332] text-[#F7F4EF] shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c-4.5 2.5-7 6.5-7 10.5A7 7 0 0 0 12 21a7 7 0 0 0 7-7.5C19 9.5 16.5 5.5 12 3Z"
                />
                <path strokeLinecap="round" d="M12 21V9" />
              </svg>
            </span>
            <div className="leading-none">
              <span className="block text-base font-bold tracking-[0.14em] text-[#2C221E] sm:text-lg">
                KATUMBA
              </span>
              <span className="block text-[9px] font-semibold tracking-[0.22em] text-[#6E6058]">
                HOME APPLIANCES
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.target}
                type="button"
                onClick={() => handleNavClick(item.target)}
                className="text-xs font-semibold tracking-[0.12em] text-[#2C221E]/80 transition-colors hover:text-[#5C4332]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {searchOpen ? (
              <div className="flex items-center rounded-full border border-[#D8CFC3] bg-white px-3 py-1.5 shadow-sm">
                <Search className="mr-2 h-4 w-4 text-[#6E6058]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search furniture, appliances..."
                  autoFocus
                  className="w-32 bg-transparent text-xs text-[#2C221E] placeholder-[#9B8E85] focus:outline-none sm:w-48"
                />
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange("");
                    setSearchOpen(false);
                  }}
                  className="ml-1 text-[#6E6058] hover:text-[#2C221E]"
                  aria-label="Close search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#2C221E] transition-colors hover:bg-[#EAE3D8]"
                aria-label="Search products"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
            )}

            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full bg-[#5C4332] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#483326] lg:inline-flex"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Floating Pill Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed inset-x-4 bottom-[calc(0.85rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-full border border-[#E4DDD3]/90 bg-white/95 px-3 py-2 shadow-[0_10px_32px_rgba(44,34,30,0.14)] backdrop-blur-md lg:hidden"
      >
        <div className="grid grid-cols-5 items-center">
          <button
            type="button"
            onClick={() => handleNavClick("hero")}
            className="flex flex-col items-center justify-center gap-0.5 rounded-full py-1 text-[#5C4332] transition-colors hover:text-[#2C221E] active:scale-95"
          >
            <Home className="h-[19px] w-[19px]" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("products")}
            className="flex flex-col items-center justify-center gap-0.5 rounded-full py-1 text-[#6E6058] transition-colors hover:text-[#5C4332] active:scale-95"
          >
            <ShoppingBag className="h-[19px] w-[19px]" />
            <span className="text-[10px] font-medium">Shop</span>
          </button>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => handleNavClick("categories")}
              aria-label="Browse Categories"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5C4332] text-white shadow-md ring-4 ring-[#F7F4EF]/80 transition-transform hover:bg-[#483326] active:scale-95"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>

          <a
            href={whatsappGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 rounded-full py-1 text-[#6E6058] transition-colors hover:text-[#5C4332] active:scale-95"
          >
            <MessageCircle className="h-[19px] w-[19px]" />
            <span className="text-[10px] font-medium">WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => handleNavClick("footer")}
            className="flex flex-col items-center justify-center gap-0.5 rounded-full py-1 text-[#6E6058] transition-colors hover:text-[#5C4332] active:scale-95"
          >
            <MapPin className="h-[19px] w-[19px]" />
            <span className="text-[10px] font-medium">Contact</span>
          </button>
        </div>
      </nav>
    </>
  );
}
