"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Leaf,
  Gem,
  Cog,
  MapPin,
  Phone,
} from "lucide-react";

import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import {
  CATEGORY_SHOWCASE,
  HERO_IMAGES,
  SAMPLE_PRODUCTS,
} from "@/data/sampleProducts";
import { PRODUCT_CATEGORIES, Product, ProductCategory } from "@/types/product";
import { subscribeToProducts } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const lenisRef = useRef<Lenis | null>(null);
  const craftsmanshipImgRef = useRef<HTMLImageElement>(null);
  const craftsmanshipSectionRef = useRef<HTMLElement>(null);

  // Real-time product feed — fires instantly when any product is added/edited/deleted
  useEffect(() => {
    let deepLinkHandled = false;

    const unsubscribe = subscribeToProducts((loaded) => {
      setProducts(loaded);

      // Deep-link support: ?product=<id> — only on first load
      if (!deepLinkHandled) {
        deepLinkHandled = true;
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("product");
        if (productId) {
          const match = loaded.find((p) => p.id === productId);
          if (match) setActiveProduct(match);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize Lenis smooth scroll + GSAP ScrollTrigger sync + scroll animations
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Category thumbnails gentle fade upward one by one (once: true)
      gsap.fromTo(
        ".category-card-reveal",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#categories",
            start: "top 85%",
            once: true,
          },
        }
      );

      // Product cards gentle fade upward one by one (once: true)
      gsap.fromTo(
        ".product-card-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#products",
            start: "top 82%",
            once: true,
          },
        }
      );

      // Craftsmanship wood detail photo subtle scroll-linked upward parallax
      if (craftsmanshipImgRef.current && craftsmanshipSectionRef.current) {
        gsap.fromTo(
          craftsmanshipImgRef.current,
          { yPercent: 8, scale: 1.1 },
          {
            yPercent: -8,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: craftsmanshipSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -72 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategoryPick = (cat: ProductCategory | "All") => {
    setSelectedCategory(cat);
    scrollToSection("products");
  };

  useEffect(() => {
    if (!lenisRef.current) return;
    if (activeProduct) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [activeProduct]);

  return (
    <div className="min-h-screen bg-[#F7F4EF] pb-24 text-[#2C221E] lg:pb-0">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          if (val.trim()) scrollToSection("products");
        }}
        onNavigateSection={scrollToSection}
      />

      <main>
        {/* Sticky Hero Zoom & Swap + Trust Badges */}
        <HeroSection onShopNow={() => scrollToSection("products")} />

        {/* Shop by Category */}
        <section
          id="categories"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-[#D8CFC3] sm:w-16" />
            <h2 className="text-center text-xs font-bold tracking-[0.22em] text-[#2C221E] uppercase sm:text-sm">
              Shop by Category
            </h2>
            <span className="h-px w-10 bg-[#D8CFC3] sm:w-16" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {CATEGORY_SHOWCASE.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategoryPick(cat.name)}
                  className={`category-card-reveal group flex flex-col items-center rounded-2xl border p-3 text-center transition-all duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? "border-[#5C4332] bg-[#EFE9E0] shadow-sm"
                      : "border-[#E4DDD3] bg-white hover:border-[#CBBFB0] hover:shadow-md"
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#EFE9E0]">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-[#2C221E]">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-[#6E6058]">
                    {cat.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Best Selling Furniture & Appliances */}
        <section
          id="products"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-[11px] font-bold tracking-[0.18em] text-[#6E6058] uppercase">
                Curated for Ugandan Homes
              </span>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#2C221E] sm:text-3xl">
                Best Selling Furniture &amp; Appliances
              </h2>
            </div>

            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="inline-flex w-fit items-center gap-1.5 text-xs font-bold tracking-[0.1em] text-[#5C4332] uppercase hover:underline"
              >
                <span>View All Products</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {(["All", ...PRODUCT_CATEGORIES] as const).map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#5C4332] text-white shadow-sm"
                      : "border border-[#E4DDD3] bg-white text-[#2C221E] hover:border-[#5C4332]/50 hover:bg-[#EFE9E0]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setActiveProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#E4DDD3] bg-white p-12 text-center">
              <p className="text-base font-bold text-[#2C221E]">
                No items matched your filter.
              </p>
              <p className="mt-1 text-sm text-[#6E6058]">
                Try clearing your search or selecting another category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-5 rounded-full bg-[#5C4332] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#483326]"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Dual Collection Banners */}
        <section
          id="collections"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Banner 1: Living Room */}
            <div className="group relative min-h-[280px] overflow-hidden rounded-3xl bg-[#EFE9E0] p-8 sm:p-10">
              <img
                src={HERO_IMAGES.primary}
                alt="The Living Room Collection"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F7F4EF]/95 via-[#F7F4EF]/80 to-transparent" />
              <div className="relative z-10 flex h-full max-w-xs flex-col justify-center">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#6E6058] uppercase">
                  The Living Room Collection
                </span>
                <h3 className="mt-2 text-2xl font-extrabold leading-tight text-[#2C221E] sm:text-3xl">
                  Comfort Meets Style
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#5C4E46] sm:text-sm">
                  Solid Mvule sofas and lounge seating built for warm Ugandan
                  hospitality.
                </p>
                <button
                  type="button"
                  onClick={() => handleCategoryPick("Living Room")}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#5C4332] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#483326]"
                >
                  <span>Shop Living Room</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Banner 2: Bedroom / Home Appliances */}
            <div className="group relative min-h-[280px] overflow-hidden rounded-3xl bg-[#EFE9E0] p-8 sm:p-10">
              <img
                src="https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?auto=format&fit=crop&w=1200&q=80"
                alt="The Bedroom Collection"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F7F4EF]/95 via-[#F7F4EF]/80 to-transparent" />
              <div className="relative z-10 flex h-full max-w-xs flex-col justify-center">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#6E6058] uppercase">
                  The Bedroom &amp; Appliance Collection
                </span>
                <h3 className="mt-2 text-2xl font-extrabold leading-tight text-[#2C221E] sm:text-3xl">
                  Rest Beautifully
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#5C4E46] sm:text-sm">
                  Serene hardwood beds and dependable home appliances for modern
                  living.
                </p>
                <button
                  type="button"
                  onClick={() => handleCategoryPick("Bedroom")}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#5C4332] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#483326]"
                >
                  <span>Shop Bedroom</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Craftsmanship (with scroll-linked upward parallax on wood photo) */}
        <section
          id="craftsmanship"
          ref={craftsmanshipSectionRef}
          className="border-y border-[#E4DDD3] bg-[#F2ECE3]"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
            {/* Parallax Wood Detail Photo */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#DED4C6] bg-[#E6DDD0] shadow-sm">
                <img
                  ref={craftsmanshipImgRef}
                  src={HERO_IMAGES.craftsmanship}
                  alt="Precision dovetail wood joinery craftsmanship detail"
                  loading="lazy"
                  className="h-full w-full object-cover object-center will-change-transform"
                />
              </div>
            </div>

            {/* Editorial Copy */}
            <div className="lg:col-span-4">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#6E6058] uppercase">
                Our Craftsmanship
              </span>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-[#2C221E] sm:text-3xl">
                Thoughtful Materials. A More Beautiful Home.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#5C4E46]">
                We source kiln-dried Ugandan Mvule and Mahogany alongside
                energy-efficient appliances tested for local power stability.
                Every joint, finish, and appliance is chosen to serve your
                family for years.
              </p>
              <button
                type="button"
                onClick={() => scrollToSection("products")}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-[#5C4332] uppercase hover:underline"
              >
                <span>Explore Our Pieces</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 3 Craftsmanship Pillars */}
            <div className="grid grid-cols-3 gap-3 lg:col-span-3">
              <div className="flex flex-col items-center rounded-2xl bg-[#F7F4EF] p-4 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8CFC3] bg-white text-[#5C4332]">
                  <Leaf className="h-5 w-5" />
                </span>
                <span className="mt-3 text-[11px] font-bold tracking-[0.06em] text-[#2C221E] uppercase">
                  Sustainable Materials
                </span>
              </div>

              <div className="flex flex-col items-center rounded-2xl bg-[#F7F4EF] p-4 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8CFC3] bg-white text-[#5C4332]">
                  <Gem className="h-5 w-5" />
                </span>
                <span className="mt-3 text-[11px] font-bold tracking-[0.06em] text-[#2C221E] uppercase">
                  Timeless Designs
                </span>
              </div>

              <div className="flex flex-col items-center rounded-2xl bg-[#F7F4EF] p-4 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8CFC3] bg-white text-[#5C4332]">
                  <Cog className="h-5 w-5" />
                </span>
                <span className="mt-3 text-[11px] font-bold tracking-[0.06em] text-[#2C221E] uppercase">
                  Built to Last
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="footer"
        className="border-t border-[#E4DDD3] bg-[#2C221E] text-[#F7F4EF]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-base font-bold tracking-[0.16em] uppercase">
              Katumba
            </p>
            <p className="text-[10px] tracking-[0.22em] text-[#C8BDB2] uppercase">
              Home Appliances &amp; Furniture
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[#C8BDB2]">
              Handcrafted Ugandan hardwood furniture and dependable modern
              appliances, curated for lasting comfort.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.16em] uppercase">
              Categories
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-[#C8BDB2]">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => handleCategoryPick(cat)}
                    className="transition-colors hover:text-white"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.16em] uppercase">
              Showroom &amp; Support
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#C8BDB2]">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D9B89C]" />
                <span>Kampala, Uganda — Nationwide Delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-[#D9B89C]" />
                <span>WhatsApp Ordering Available Daily</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.16em] uppercase">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-[#C8BDB2]">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("hero")}
                  className="transition-colors hover:text-white"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("products")}
                  className="transition-colors hover:text-white"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("collections")}
                  className="transition-colors hover:text-white"
                >
                  Collections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("craftsmanship")}
                  className="transition-colors hover:text-white"
                >
                  Our Craftsmanship
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#43352F] py-5 text-center text-[11px] text-[#B8ABA0]">
          © {new Date().getFullYear()} Katumba Home Appliances. All rights
          reserved.
        </div>
      </footer>

      {/* Full-Screen Product View Modal */}
      <ProductModal
        product={activeProduct}
        allProducts={products}
        onClose={() => setActiveProduct(null)}
        onSelectProduct={(p) => setActiveProduct(p)}
      />
    </div>
  );
}
