import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicTheme } from "@/components/public/public-theme";
import { ProductDetailProvider } from "@/components/public/product-detail-context";
import { UnavailablePage } from "@/components/public/unavailable-page";
import { renderLandingSections } from "@/lib/site/sections";
import {
  getCachedTenantBySlug,
  getPublicLandingBySlug,
} from "@/lib/site/load-public-landing.server";
import { getResolvedSiteConfig } from "@/services/site.service";

export const revalidate = 120;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getCachedTenantBySlug(slug);

  if (!tenant) {
    return { title: "Cardápio não encontrado" };
  }

  const siteConfig = getResolvedSiteConfig(tenant);
  const title = siteConfig.seo.title ?? tenant.name;
  const description =
    siteConfig.seo.description ??
    tenant.description ??
    `Veja o cardápio completo de ${tenant.name}`;

  const ogImageUrl =
    siteConfig.seo.ogImageUrl ?? tenant.bannerUrl ?? tenant.logoUrl ?? undefined;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };

  if (ogImageUrl) {
    metadata.twitter = {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    };
  }

  if (baseUrl) {
    metadata.alternates = {
      canonical: `${baseUrl}/${slug}`,
    };
  }

  if (siteConfig.seo.keywords?.length) {
    metadata.keywords = siteConfig.seo.keywords;
  }

  return metadata;
}

export default async function PublicLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPublicLandingBySlug(slug);

  if (result.kind === "not_found") {
    notFound();
  }

  if (result.kind === "blocked") {
    return <UnavailablePage status={result.status} name={result.name} />;
  }

  const { pageData, entitlements, drawerActions } = result;

  return (
    <ProductDetailProvider
      tenantSlug={slug}
      whatsapp={pageData.whatsapp}
      drawerActions={drawerActions}
      categories={pageData.categoriesWithItems}
    >
      <PublicTheme tenant={pageData.tenant} siteConfig={pageData.siteConfig} />
      {renderLandingSections(pageData, entitlements)}
    </ProductDetailProvider>
  );
}
