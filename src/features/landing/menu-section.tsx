import { MenuCatalog } from "@/components/public/menu-catalog";
import { LandingHeading } from "@/components/public/landing";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { resolveSectionCopy } from "@/lib/site/section-copy";
import type { LandingPageData } from "@/lib/site/landing-types";

interface MenuSectionProps {
  data: LandingPageData;
}

export function MenuSection({ data }: MenuSectionProps) {
  const { visibleCategories } = data;
  const copy = resolveSectionCopy(data.siteConfig.sectionCopy).menu;

  return (
    <section
      id="cardapio"
      aria-label="Cardápio"
      className="landing-section space-y-8 lg:space-y-10"
    >
      <ScrollReveal>
        <LandingHeading
          align="center"
          title={copy.title}
          subtitle={copy.subtitle}
        />
      </ScrollReveal>

      {visibleCategories.length === 0 ? (
        <p className="py-16 text-center text-base text-[var(--menu-text-muted)]">
          Nenhum item disponível no momento.
        </p>
      ) : (
        <MenuCatalog categories={visibleCategories} />
      )}
    </section>
  );
}
