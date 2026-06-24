import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTenantBySlugServer } from "@/lib/repositories/server/tenant.server";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";

export const dynamic = "force-dynamic";
import { MenuHeader } from "@/components/public/menu-header";
import { CategorySection } from "@/components/public/category-section";
import { UnavailablePage } from "@/components/public/unavailable-page";
import { Logo } from "@/components/brand/logo";
import type { Category, MenuItem } from "@/types";

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
      images: tenant.logoUrl ? [tenant.logoUrl] : [],
    },
  };
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

  const categories = await getCategoriesByTenantServer(tenant.id, { activeOnly: true });

  const categoriesWithItems = await Promise.all(
    categories.map(async (cat: Category) => {
      const items: MenuItem[] = await getItemsByCategoryServer(tenant.id, cat.id, {
        availableOnly: true,
      });
      return { ...cat, items };
    }),
  );

  const visibleCategories = categoriesWithItems.filter((c) => c.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <MenuHeader tenant={tenant} />

      {/* Category nav */}
      {visibleCategories.length > 1 && (
        <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
          <div className="flex gap-1 overflow-x-auto px-4 py-2 max-w-2xl mx-auto">
            {visibleCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium hover:bg-accent transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </nav>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {visibleCategories.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-12">
            Nenhum item disponível no momento.
          </p>
        ) : (
          visibleCategories.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              items={cat.items}
            />
          ))
        )}
      </main>

      <footer className="flex flex-col items-center gap-2 py-6 text-muted-foreground/60">
        <Logo size="xs" href="/" className="opacity-60" />
      </footer>
    </div>
  );
}
