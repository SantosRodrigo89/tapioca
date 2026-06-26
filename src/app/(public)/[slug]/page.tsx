import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicTheme } from "@/components/public/public-theme";
import { UnavailablePage } from "@/components/public/unavailable-page";
import type { LandingPageData } from "@/lib/site/landing-types";
import { resolveHighlights } from "@/lib/site/resolve-highlights";
import { renderLandingSections } from "@/lib/site/sections";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getGalleryByTenantServer } from "@/lib/repositories/server/gallery.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import { getTenantBySlugServer } from "@/lib/repositories/server/tenant.server";
import { getResolvedSiteConfig } from "@/services/site.service";
import type { Category, MenuItem } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenantBySlugServer(slug);

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
  const tenant = await getTenantBySlugServer(slug);

  if (!tenant) {
    notFound();
  }

  if (tenant.status === "suspended" || tenant.status === "cancelled") {
    return <UnavailablePage status={tenant.status} name={tenant.name} />;
  }

  const siteConfig = getResolvedSiteConfig(tenant);

  const [categories, gallery] = await Promise.all([
    getCategoriesByTenantServer(tenant.id, { activeOnly: true }),
    getGalleryByTenantServer(tenant.id),
  ]);

  const categoriesWithItems = await Promise.all(
    categories.map(async (cat: Category) => {
      const items: MenuItem[] = await getItemsByCategoryServer(
        tenant.id,
        cat.id,
        { availableOnly: true },
      );
      return { ...cat, items };
    }),
  );

  const visibleCategories = categoriesWithItems.filter(
    (c) => c.items.length > 0,
  );
  const highlights = resolveHighlights(
    siteConfig,
    tenant,
    visibleCategories,
  );
  const whatsapp = siteConfig.contact.whatsapp ?? tenant.whatsapp;

  const pageData: LandingPageData = {
    tenant,
    siteConfig,
    gallery,
    categoriesWithItems,
    visibleCategories,
    highlights,
    whatsapp,
  };

  return (
    <>
      <PublicTheme tenant={tenant} siteConfig={siteConfig} />
      {renderLandingSections(pageData)}
    </>
  );
}
