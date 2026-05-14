import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://fixitrepairexpress.it"),
  title: {
    default: "Fixit Repair Express — Riparazioni smartphone e ricondizionati",
    template: "%s — Fixit Repair Express",
  },
  description:
    "Fixit Repair Express: riparazioni rapide di smartphone, tablet, computer e console. Smartphone ricondizionati garantiti e tracking in tempo reale dello stato lavorazioni.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/favicon-192.png", sizes: "192x192" }],
  },
  openGraph: {
    title: "Fixit Repair Express",
    description:
      "Riparazioni, ricondizionati e stato lavorazioni in tempo reale.",
    type: "website",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#05050a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
