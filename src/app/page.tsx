import type { Metadata } from "next";
import { MarketingPage } from "@/features/marketing/marketing-page";
import {
  getHomeJsonLd,
  getMarketingBaseUrl,
  HOME_KEYWORDS,
  HOME_META_DESCRIPTION,
  HOME_META_TITLE,
  HOME_OG,
} from "@/lib/marketing/seo";

const baseUrl = getMarketingBaseUrl();
const ogImageUrl = `${baseUrl}/logo.png`;

export const metadata: Metadata = {
  title: HOME_META_TITLE,
  description: HOME_META_DESCRIPTION,
  keywords: HOME_KEYWORDS,
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: HOME_OG.title,
    description: HOME_OG.description,
    url: baseUrl,
    siteName: "Mesio",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 640,
        height: 320,
        alt: "Mesio — Plataforma de presença digital para restaurantes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_OG.title,
    description: HOME_OG.description,
    images: [ogImageUrl],
  },
};

export default function HomePage() {
  const jsonLd = getHomeJsonLd(baseUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingPage />
    </>
  );
}
