import { CategoryNav } from "@/components/public/category-nav";
import { CategorySection } from "@/components/public/category-section";
import type { LandingPageData } from "@/lib/site/landing-types";

interface MenuSectionProps {
  data: LandingPageData;
}

export function MenuSection({ data }: MenuSectionProps) {
  const { visibleCategories, whatsapp } = data;

  return (
    <>
      {visibleCategories.length > 0 && (
        <CategoryNav
          categories={visibleCategories.map((c) => ({
            id: c.id,
            name: c.name,
          }))}
        />
      )}

      <section
        id="cardapio"
        aria-label="Cardápio"
        className="landing-section mx-auto max-w-3xl space-y-10 px-4 py-6 sm:py-8"
      >
        {visibleCategories.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#777]">
            Nenhum item disponível no momento.
          </p>
        ) : (
          visibleCategories.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              items={cat.items}
              whatsapp={whatsapp}
            />
          ))
        )}
      </section>
    </>
  );
}
