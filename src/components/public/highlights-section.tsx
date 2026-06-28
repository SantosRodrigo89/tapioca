import { LandingHeading } from "@/components/public/landing";
import { HighlightsCarousel } from "@/components/public/highlights-carousel";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { sectionLayoutProps } from "@/lib/site/section-layout-props";
import type { SiteSectionHeadingCopy } from "@/types/site";
import type { Category, MenuItem } from "@/types";

export interface HighlightEntry {
  item: MenuItem;
  category: Category;
}

interface HighlightsSectionProps {
  entries: HighlightEntry[];
  copy?: SiteSectionHeadingCopy;
  layoutVariant?: string;
}

export function HighlightsSection({
  entries,
  copy,
  layoutVariant = "carousel-hero",
}: HighlightsSectionProps) {
  if (entries.length === 0) return null;

  const title = copy?.title ?? "Destaques da Casa";
  const subtitle = copy?.subtitle ?? "Os favoritos dos nossos clientes";

  return (
    <section
      id="destaques"
      aria-labelledby="highlights-heading"
      className="landing-section"
      {...sectionLayoutProps("featured", layoutVariant)}
    >
      <ScrollReveal>
        <LandingHeading
          title={title}
          titleId="highlights-heading"
          subtitle={subtitle}
        />
      </ScrollReveal>

      <div className="mt-8 sm:mt-10">
        <HighlightsCarousel entries={entries} />
      </div>
    </section>
  );
}
