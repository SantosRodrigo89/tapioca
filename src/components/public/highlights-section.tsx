import { LandingHeading } from "@/components/public/landing";
import { HighlightsCarousel } from "@/components/public/highlights-carousel";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { SiteSectionHeadingCopy } from "@/types/site";
import type { Category, MenuItem } from "@/types";

export interface HighlightEntry {
  item: MenuItem;
  category: Category;
}

interface HighlightsSectionProps {
  entries: HighlightEntry[];
  copy?: SiteSectionHeadingCopy;
}

export function HighlightsSection({ entries, copy }: HighlightsSectionProps) {
  if (entries.length === 0) return null;

  const title = copy?.title ?? "Destaques da Casa";
  const subtitle = copy?.subtitle ?? "Os favoritos dos nossos clientes";

  return (
    <section
      id="destaques"
      aria-labelledby="highlights-heading"
      className="landing-section"
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
