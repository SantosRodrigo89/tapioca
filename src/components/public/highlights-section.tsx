import { LandingHeading } from "@/components/public/landing";
import { HighlightsCarousel } from "@/components/public/highlights-carousel";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { Category, MenuItem } from "@/types";

export interface HighlightEntry {
  item: MenuItem;
  category: Category;
}

interface HighlightsSectionProps {
  entries: HighlightEntry[];
}

export function HighlightsSection({ entries }: HighlightsSectionProps) {
  if (entries.length === 0) return null;

  return (
    <section
      id="destaques"
      aria-labelledby="highlights-heading"
      className="landing-section"
    >
      <ScrollReveal>
        <LandingHeading
          title="Destaques da Casa"
          titleId="highlights-heading"
          subtitle="Os favoritos dos nossos clientes"
        />
      </ScrollReveal>

      <div className="mt-8 sm:mt-10">
        <HighlightsCarousel entries={entries} />
      </div>
    </section>
  );
}
