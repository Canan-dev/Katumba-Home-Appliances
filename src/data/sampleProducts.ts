import { Product } from "@/types/product";

export const HERO_IMAGES = {
  primary: "/images/hero-sofa.jpg",
  secondary:
    "https://images.unsplash.com/photo-1757792859308-b8d2115a0010?auto=format&fit=crop&w=1800&q=85",
  craftsmanship:
    "https://images.unsplash.com/photo-1699099647256-08047917681b?auto=format&fit=crop&w=1400&q=85",
  woodGrain:
    "https://images.unsplash.com/photo-1770573321383-4367691d87df?auto=format&fit=crop&w=1200&q=80",
};

export const CATEGORY_SHOWCASE = [
  {
    name: "Living Room" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1757792859308-b8d2115a0010?auto=format&fit=crop&w=900&q=80",
    subtitle: "Sofas, Lounge Chairs & Tables",
  },
  {
    name: "Dining Room" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1789758612617-976d1051e027?auto=format&fit=crop&w=900&q=80",
    subtitle: "Solid Wood Tables & Seating",
  },
  {
    name: "Bedroom" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?auto=format&fit=crop&w=900&q=80",
    subtitle: "Mvule & Mahogany Bed Frames",
  },
  {
    name: "Storage" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1767963758785-b9def36c13e3?auto=format&fit=crop&w=900&q=80",
    subtitle: "Sideboards, Credenzas & Shelving",
  },
  {
    name: "Home Appliances" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1706894075115-f140b40493cb?auto=format&fit=crop&w=900&q=80",
    subtitle: "Kitchen & Everyday Essentials",
  },
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "kampala-linen-sofa",
    name: "Entebbe Modular Linen Sofa",
    category: "Living Room",
    priceUGX: 3450000,
    imageUrl: "/images/hero-sofa.jpg",
    material: "Kiln-dried Mvule frame & breathable oat linen",
    dimensions: "245 cm W × 98 cm D × 82 cm H",
    description:
      "Hand-built on a solid Ugandan Mvule hardwood frame with high-resilience cushions and removable oat linen covers. Designed for generous family living rooms.",
    swatches: ["#E5DDD3", "#6B584A", "#3B312B"],
    rating: 4.9,
    reviewCount: 128,
    featured: true,
  },
  {
    id: "nakasero-dining-table",
    name: "Nakasero Solid Wood Dining Table",
    category: "Dining Room",
    priceUGX: 2650000,
    imageUrl:
      "https://images.unsplash.com/photo-1789758612617-976d1051e027?auto=format&fit=crop&w=1200&q=80",
    material: "Solid Ugandan Mahogany with natural matte oil finish",
    dimensions: "200 cm L × 100 cm W × 76 cm H",
    description:
      "Seats six to eight comfortably. Crafted from sustainably sourced mahogany planks with mortise-and-tenon joinery for generations of family gatherings.",
    swatches: ["#7C583E", "#4A3222"],
    rating: 4.9,
    reviewCount: 94,
    featured: true,
  },
  {
    id: "kololo-accent-chair",
    name: "Kololo Lounge Accent Chair",
    category: "Living Room",
    priceUGX: 1180000,
    imageUrl:
      "https://images.unsplash.com/photo-1758977404510-6ab7e07ff1fe?auto=format&fit=crop&w=1200&q=80",
    material: "Sculpted walnut-stained timber & textured boucle",
    dimensions: "78 cm W × 82 cm D × 79 cm H",
    description:
      "A low-slung reading and lounge chair pairing warm carved armrests with deep, supportive upholstery.",
    swatches: ["#4F583D", "#D9CFC3", "#5C4332"],
    rating: 4.8,
    reviewCount: 84,
    featured: true,
  },
  {
    id: "muyenga-fluted-sideboard",
    name: "Muyenga Fluted Wood Sideboard",
    category: "Storage",
    priceUGX: 1950000,
    imageUrl:
      "https://images.unsplash.com/photo-1767963758785-b9def36c13e3?auto=format&fit=crop&w=1200&q=80",
    material: "Solid Mvule & brushed brass hardware",
    dimensions: "175 cm W × 45 cm D × 78 cm H",
    description:
      "Concealed soft-close compartments with adjustable interior shelves—ideal for dining ware, media equipment, or entryway organization.",
    swatches: ["#8B6347", "#3F2E24"],
    rating: 4.9,
    reviewCount: 67,
    featured: true,
  },
  {
    id: "serena-platform-bed",
    name: "Serena Hardwood Platform Bed",
    category: "Bedroom",
    priceUGX: 2850000,
    imageUrl:
      "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?auto=format&fit=crop&w=1200&q=80",
    material: "Solid East African Teak & upholstered headboard",
    dimensions: "King (180 cm × 200 cm) • Headboard 112 cm H",
    description:
      "Clean architectural lines with reinforced hardwood slats for silent, lasting support without the need for a box spring.",
    swatches: ["#75543D", "#CFC6BA"],
    rating: 4.9,
    reviewCount: 73,
    featured: true,
  },
  {
    id: "bugolobi-barista-espresso",
    name: "Katumba Pro Barista Espresso Maker",
    category: "Home Appliances",
    priceUGX: 1850000,
    imageUrl:
      "https://images.unsplash.com/photo-1706894075115-f140b40493cb?auto=format&fit=crop&w=1200&q=80",
    material: "Brushed stainless steel & 15-bar Italian pump",
    dimensions: "32 cm W × 34 cm D × 40 cm H (220-240V / 50Hz)",
    description:
      "Engineered for Ugandan Bugisu AA coffee beans. Features PID temperature control, integrated steam wand, and 1-year local warranty.",
    swatches: ["#A8A9AD", "#2C221E"],
    rating: 4.8,
    reviewCount: 52,
    featured: true,
  },
  {
    id: "jinja-oak-shelving",
    name: "Jinja Open Bookcase & Cabinet",
    category: "Storage",
    priceUGX: 1490000,
    imageUrl:
      "https://images.unsplash.com/photo-1781032044213-571bc1faa592?auto=format&fit=crop&w=1200&q=80",
    material: "Natural ash-finish hardwood & matte steel pins",
    dimensions: "110 cm W × 38 cm D × 185 cm H",
    description:
      "Airy open display shelving above a closed lower cabinet—brings warmth and order to living rooms or home studies.",
    swatches: ["#C5A787", "#7A5B43"],
    rating: 4.7,
    reviewCount: 41,
  },
  {
    id: "munyonyo-sanctuary-bed",
    name: "Munyonyo Canopy Bed & Side Table Set",
    category: "Bedroom",
    priceUGX: 3150000,
    imageUrl:
      "https://images.unsplash.com/photo-1721742736282-06b1eb4cbe50?auto=format&fit=crop&w=1200&q=80",
    material: "Hand-rubbed Mahogany & natural linen",
    dimensions: "Queen (150 cm × 200 cm) + Matching Nightstand",
    description:
      "A serene bedroom centerpiece paired with a matching solid-wood bedside table with smooth dovetail drawer.",
    swatches: ["#6E4B35", "#DFD6CA"],
    rating: 4.8,
    reviewCount: 39,
  },
  {
    id: "kisaasi-living-suite",
    name: "Kisaasi 3-Seater Lounge & Armchair",
    category: "Living Room",
    priceUGX: 4100000,
    imageUrl:
      "https://images.unsplash.com/photo-1757792859308-b8d2115a0010?auto=format&fit=crop&w=1200&q=80",
    material: "Solid hardwood legs & stain-resistant woven fabric",
    dimensions: "Sofa 220 cm W + Armchair 85 cm W",
    description:
      "Complete living room seating pairing a deep 3-seater sofa with a matching fireside armchair.",
    swatches: ["#DFD5C8", "#5C4332"],
    rating: 4.9,
    reviewCount: 61,
  },
  {
    id: "katumba-smart-brewer",
    name: "Katumba Precision Drip Coffee Station",
    category: "Home Appliances",
    priceUGX: 680000,
    imageUrl:
      "https://images.unsplash.com/photo-1657758481156-fbed1d83e694?auto=format&fit=crop&w=1200&q=80",
    material: "Matte black alloy & thermal stainless carafe",
    dimensions: "22 cm W × 24 cm D × 35 cm H (220-240V / 50Hz)",
    description:
      "Programmable morning brewer with bloom cycle and double-walled thermal carafe that keeps coffee hot for hours.",
    swatches: ["#2C221E", "#B5B2AC"],
    rating: 4.7,
    reviewCount: 33,
  },
];
