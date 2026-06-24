import { MenuItemCard } from "./menu-item-card";
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
    <section
      id={`cat-${category.id}`}
      className="menu-animate-in scroll-mt-[52px] space-y-4"
      aria-labelledby={`heading-${category.id}`}
    >
      <h2
        id={`heading-${category.id}`}
        className="px-1 text-xl font-semibold text-[var(--menu-secondary)] sm:text-2xl"
      >
        {category.name}
      </h2>
      <div className="flex flex-col gap-3 sm:gap-4">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            category={category}
            whatsapp={whatsapp}
          />
        ))}
      </div>
    </section>
  );
}
