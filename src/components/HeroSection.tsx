"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { HERO_IMAGES } from "@/data/sampleProducts";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onShopNow: () => void;
}

export default function HeroSection({ onShopNow }: HeroSectionProps) {
  const heroTriggerRef = useRef<HTMLDivElement>(null);
  const primaryImgRef = useRef<HTMLImageElement>(null);
  const secondaryImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const triggerEl = heroTriggerRef.current;
    const primaryEl = primaryImgRef.current;
    const secondaryEl = secondaryImgRef.current;

    if (!triggerEl || !primaryEl || !secondaryEl) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Pin the hero section; keep left-side copy completely still while zooming & crossfading full-bleed photos
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top+=68",
          end: "+=110%",
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        primaryEl,
        { scale: 1 },
        { scale: 1.14, ease: "none", duration: 1 },
        0
      ).fromTo(
        secondaryEl,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1.0, ease: "power1.inOut", duration: 0.65 },
        0.35
      );
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section id="hero" className="relative bg-[#F7F4EF]">
      {/* Full-Bleed Pinned Hero Showcase */}
      <div
        ref={heroTriggerRef}
        className="relative flex min-h-[540px] w-full items-center overflow-hidden border-b border-[#E4DDD3] bg-[#EFE9E0] md:min-h-[600px] lg:min-h-[650px]"
      >
        {/* Full-Bleed Background Images (Zoom & Crossfade on Scroll) */}
        <img
          ref={primaryImgRef}
          src={HERO_IMAGES.primary}
          alt="Minimalist living room sofa set with armchairs and warm lighting"
          className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
        />
        <img
          ref={secondaryImgRef}
          src={HERO_IMAGES.secondary}
          alt="Cozy wooden living room sofa and armchair showcase"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-0 will-change-transform"
        />

        {/* Soft Warm Left-to-Right Scrim for Editorial Contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F7F4EF]/95 via-[#F7F4EF]/82 to-[#F7F4EF]/15 md:via-[#F7F4EF]/65 md:to-transparent" />

        {/* Left Static Content (remains completely still while pinned) */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-xl">
            {/* Eyebrow + Hairline */}
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#5C4332] uppercase">
                Welcome to Katumba Home Appliances
              </span>
              <span className="hidden h-px w-14 bg-[#5C4332]/35 sm:inline-block" />
            </div>

            {/* Editorial Headline with Italic Serif & Curved Underline */}
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[#2C221E] sm:text-5xl lg:text-[54px]">
              Furniture &amp; Appliances for the way you{" "}
              <span
                className="relative inline-block font-bold italic text-[#5C4332]"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                live.
                <svg
                  viewBox="0 0 120 14"
                  fill="none"
                  className="absolute -bottom-1.5 left-0 w-full text-[#5C4332]"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10.5C32 3.5 85 2.5 117 9.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#4F433C] sm:text-base">
              Thoughtfully crafted Ugandan hardwood furniture and reliable modern
              appliances. Timeless style, lasting quality, made for everyday
              living.
            </p>

            {/* Primary CTA + UGX / Delivery Pill */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onShopNow}
                className="inline-flex items-center gap-2 rounded-full bg-[#5C4332] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#483326] active:scale-[0.98]"
              >
                <span>Shop Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="inline-flex items-center gap-3 rounded-full border border-[#2C221E]/25 bg-[#F7F4EF]/80 px-4 py-2.5 text-xs font-medium text-[#2C221E] backdrop-blur-sm">
                <span className="font-semibold">Priced in UGX</span>
                <span className="h-3.5 w-px bg-[#2C221E]/25" />
                <span className="inline-flex items-center gap-1.5 text-[#5C4332]">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Delivered across Uganda</span>
                </span>
              </div>
            </div>

            {/* Inline Trust Row */}
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#2C221E]/10 pt-5 text-xs text-[#4F433C]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#5C4332]" />
                <span className="font-semibold text-[#2C221E]">
                  Trusted Quality
                </span>
              </div>

              <span className="hidden h-4 w-px bg-[#2C221E]/15 sm:inline-block" />

              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#5C4332]" />
                <span className="font-semibold text-[#2C221E]">
                  Nationwide Delivery
                </span>
              </div>

              <span className="hidden h-4 w-px bg-[#2C221E]/15 sm:inline-block" />

              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-[#5C4332]" />
                <span className="font-semibold text-[#2C221E]">
                  Dedicated Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
