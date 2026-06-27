import { ScrollReveal } from "@/components/public/scroll-reveal";
import { HighlightsCarousel } from "@/components/public/highlights-carousel";
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
    <div className="space-y-8">
      <ScrollReveal>
        <div className="space-y-2">
          <h2 className="landing-heading">Destaques da Casa</h2>
          <p className="landing-subheading">
            Os favoritos dos nossos clientes
          </p>
        </div>
      </ScrollReveal>

      <HighlightsCarousel entries={entries} />
    </div>
  );
}
