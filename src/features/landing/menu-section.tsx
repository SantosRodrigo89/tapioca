import { CategoryAccordion } from "@/components/public/category-accordion";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { LandingPageData } from "@/lib/site/landing-types";

interface MenuSectionProps {
  data: LandingPageData;
}

export function MenuSection({ data }: MenuSectionProps) {
  const { visibleCategories } = data;

  return (
    <section
      id="cardapio"
      aria-label="Cardápio"
      className="landing-section space-y-10 lg:space-y-14"
    >
      <ScrollReveal>
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h2 className="landing-heading">Nosso Cardápio</h2>
          <p className="landing-subheading">
            Conheça nossas especialidades preparadas com ingredientes
            selecionados.
          </p>
        </div>
      </ScrollReveal>

      {visibleCategories.length === 0 ? (
        <p className="py-16 text-center text-base text-[#777]">
          Nenhum item disponível no momento.
        </p>
      ) : (
        <CategoryAccordion categories={visibleCategories} />
      )}
    </section>
  );
}
