import { MenuItemCard } from "@/components/public/menu-item-card";
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
    <div className="space-y-8">
      <ScrollReveal>
        <div className="space-y-2">
          <h2 className="landing-heading">Destaques da Casa</h2>
          <p className="landing-subheading">
            Os favoritos dos nossos clientes
          </p>
        </div>
      </ScrollReveal>

      <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-5 sm:px-6">
        {entries.map(({ item, category }, index) => (
          <ScrollReveal key={item.id} delay={index * 80} className="shrink-0">
            <MenuItemCard
              item={item}
              category={category}
              variant="featured"
            />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
