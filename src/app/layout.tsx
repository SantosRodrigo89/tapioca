import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import {
  BRAND_DESCRIPTION,
  BRAND_KEYWORDS,
  BRAND_NAME,
  BRAND_TAGLINE,
} from "@/lib/brand";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: BRAND_NAME,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: BRAND_KEYWORDS,
  openGraph: {
    title: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    siteName: BRAND_NAME,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: BRAND_NAME,
    description: BRAND_TAGLINE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${plusJakarta.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
