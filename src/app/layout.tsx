import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Katumba Home Appliances | Timeless Furniture & Modern Appliances in Uganda",
  description:
    "Discover handcrafted Ugandan hardwood furniture and reliable modern home appliances. Priced in UGX with delivery across Kampala and Uganda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F7F4EF] text-[#2C221E] antialiased selection:bg-[#5C4332] selection:text-white">
        {children}
      </body>
    </html>
  );
}
