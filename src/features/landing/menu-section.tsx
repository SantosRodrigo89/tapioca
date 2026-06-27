import { CategoryNav } from "@/components/public/category-nav";
import { CategorySection } from "@/components/public/category-section";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { LandingPageData } from "@/lib/site/landing-types";

interface MenuSectionProps {
  data: LandingPageData;
}

export function MenuSection({ data }: MenuSectionProps) {
  const { visibleCategories, whatsapp } = data;

  return (
    <div className="relative">
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
        className="landing-section space-y-12"
      >
        <ScrollReveal>
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="landing-heading">Cardápio</h2>
            <p className="landing-subheading">
              Escolha seus pratos favoritos e peça pelo WhatsApp
            </p>
          </div>
        </ScrollReveal>

        {visibleCategories.length === 0 ? (
          <p className="py-16 text-center text-base text-[#777]">
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
    </div>
  );
}
