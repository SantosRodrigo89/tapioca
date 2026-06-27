import { MenuItemCard } from "./menu-item-card";
import { ScrollReveal } from "./scroll-reveal";
import type { Category, MenuItem } from "@/types";

interface CategorySectionProps {
  category: Category;
  items: MenuItem[];
  whatsapp?: string;
}

export function CategorySection({
  category,
  items,
  whatsapp,
}: CategorySectionProps) {
  if (items.length === 0) return null;

  return (
    <ScrollReveal
      as="section"
      id={`cat-${category.id}`}
      className="scroll-mt-16 space-y-5"
      aria-labelledby={`heading-${category.id}`}
    >
      <h2
        id={`heading-${category.id}`}
        className="text-2xl font-semibold text-[var(--menu-secondary)] sm:text-3xl"
      >
        {category.name}
      </h2>
      <div className="flex flex-col gap-4 sm:gap-5">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            category={category}
            whatsapp={whatsapp}
          />
        ))}
      </div>
    </ScrollReveal>
  );
}
