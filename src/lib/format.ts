import { Product } from "@/types/product";

export function formatUGX(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `UGX ${safeAmount.toLocaleString("en-UG")}`;
}

export function buildWhatsAppOrderUrl(product: Product): string {
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "256700000000").replace(
    /[^\d]/g,
    ""
  );
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://katumbahome.ug"
  ).replace(/\/$/, "");
  const itemUrl = `${siteUrl}/?product=${encodeURIComponent(product.id)}`;

  const message = [
    `Hello Katumba Home Appliances! I would like to order:`,
    ``,
    `• *Product:* ${product.name}`,
    `• *Category:* ${product.category}`,
    `• *Price:* ${formatUGX(product.priceUGX)}`,
    `• *Reference:* ${itemUrl}`,
    ``,
    `Please let me know availability and delivery details in Uganda.`,
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
