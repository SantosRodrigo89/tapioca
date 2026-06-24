import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTenantBySlugServer } from "@/lib/repositories/server/tenant.server";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import { MenuHero } from "@/components/public/menu-hero";
import { PublicTheme } from "@/components/public/public-theme";
import { CategoryNav } from "@/components/public/category-nav";
import { HighlightsSection, type HighlightEntry } from "@/components/public/highlights-section";
import { CategorySection } from "@/components/public/category-section";
import { UnavailablePage } from "@/components/public/unavailable-page";
import { Logo } from "@/components/brand/logo";
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

  return {
    title: `${tenant.name} — Cardápio`,
    description:
      tenant.description ?? `Veja o cardápio completo de ${tenant.name}`,
    openGraph: {
      title: tenant.name,
      description: tenant.description,
      images: tenant.bannerUrl
        ? [tenant.bannerUrl]
        : tenant.logoUrl
          ? [tenant.logoUrl]
          : [],
    },
  };
}

type CategoryWithItems = Category & { items: MenuItem[] };

function resolveHighlights(
  highlightItemIds: string[] | undefined,
  categoriesWithItems: CategoryWithItems[],
): HighlightEntry[] {
  if (highlightItemIds && highlightItemIds.length > 0) {
    return highlightItemIds
      .map((id) => {
        for (const cat of categoriesWithItems) {
          const item = cat.items.find((i) => i.id === id);
          if (item) {
            const { items: _items, ...category } = cat;
            return { item, category };
          }
        }
        return null;
      })
      .filter((entry): entry is HighlightEntry => entry !== null);
  }

  return pickHighlights(categoriesWithItems);
}

function pickHighlights(
  categoriesWithItems: CategoryWithItems[],
  limit = 6,
): HighlightEntry[] {
  const withImage: HighlightEntry[] = [];

  for (const cat of categoriesWithItems) {
    const { items, ...category } = cat;
    for (const item of items) {
      if (item.imageUrl) {
        withImage.push({ item, category });
        if (withImage.length >= limit) return withImage;
      }
    }
  }

  if (withImage.length >= 2) return withImage;

  const fallback: HighlightEntry[] = [];
  for (const cat of categoriesWithItems) {
    const { items, ...category } = cat;
    for (const item of items) {
      fallback.push({ item, category });
      if (fallback.length >= limit) return fallback;
    }
  }

  return fallback.length >= 2 ? fallback : [];
}

export default async function PublicMenuPage({ params }: PageProps) {
  const { slug } = await params;
  const tenant = await getTenantBySlugServer(slug);

  if (!tenant) {
    notFound();
  }

  if (tenant.status === "suspended" || tenant.status === "cancelled") {
    return <UnavailablePage status={tenant.status} name={tenant.name} />;
  }

  const categories = await getCategoriesByTenantServer(tenant.id, {
    activeOnly: true,
  });

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

  const visibleCategories = categoriesWithItems.filter((c) => c.items.length > 0);
  const highlights = resolveHighlights(
    tenant.highlightItemIds,
    visibleCategories,
  );

  return (
    <>
      <PublicTheme tenant={tenant} />
      <MenuHero tenant={tenant} />

      {visibleCategories.length > 0 && (
        <CategoryNav
          categories={visibleCategories.map((c) => ({
            id: c.id,
            name: c.name,
          }))}
        />
      )}

      <main className="mx-auto max-w-3xl space-y-10 px-4 py-6 pb-10 sm:py-8">
        {visibleCategories.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#777]">
            Nenhum item disponível no momento.
          </p>
        ) : (
          <>
            <HighlightsSection entries={highlights} whatsapp={tenant.whatsapp} />

            {visibleCategories.map((cat) => (
              <CategorySection
                key={cat.id}
                category={cat}
                items={cat.items}
                whatsapp={tenant.whatsapp}
              />
            ))}
          </>
        )}
      </main>

      <footer className="border-t border-[var(--menu-border)] bg-[var(--menu-surface)] py-8">
        <div className="flex flex-col items-center gap-2 text-[#999]">
          <Logo size="xs" href="/" className="opacity-50" />
          <p className="text-xs">Cardápio digital</p>
        </div>
      </footer>
    </>
  );
}
