import {
  BRAND_DESCRIPTION,
  BRAND_KEYWORDS,
  BRAND_NAME,
  BRAND_TAGLINE,
} from "@/lib/brand";

export const HOME_META_TITLE =
  "Mesio — Plataforma de presença digital para restaurantes";

export const HOME_META_DESCRIPTION =
  "Crie um site profissional, organize seu cardápio digital, compartilhe por QR Code e fortaleça a marca do seu restaurante. Plataforma SaaS simples e completa.";

export const HOME_KEYWORDS = [
  ...BRAND_KEYWORDS,
  "QR Code restaurante",
  "site para restaurante",
  "gestão de cardápio",
  "presença online restaurante",
  "plataforma SaaS restaurantes",
  "landing page para restaurante",
];

export function getMarketingBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://mesio.com.br";
}

export function getHomeJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: BRAND_NAME,
        url: baseUrl,
        description: BRAND_DESCRIPTION,
        email: "contato@mesio.com.br",
        sameAs: ["https://instagram.com/mesio"],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: BRAND_NAME,
        description: HOME_META_DESCRIPTION,
        publisher: { "@id": `${baseUrl}/#organization` },
        inLanguage: "pt-BR",
      },
      {
        "@type": "SoftwareApplication",
        name: BRAND_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: HOME_META_DESCRIPTION,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/PreOrder",
          description: "Planos em breve — solicite demonstração",
        },
        featureList: [
          "Landing Page",
          "Cardápio Digital",
          "QR Code",
          "Painel Administrativo",
          "SEO",
          "Produtos Configuráveis",
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/#webpage`,
        url: baseUrl,
        name: HOME_META_TITLE,
        description: HOME_META_DESCRIPTION,
        isPartOf: { "@id": `${baseUrl}/#website` },
        about: { "@id": `${baseUrl}/#organization` },
        inLanguage: "pt-BR",
      },
    ],
  };
}

export const HOME_OG = {
  title: HOME_META_TITLE,
  description: HOME_META_DESCRIPTION,
  tagline: BRAND_TAGLINE,
};
