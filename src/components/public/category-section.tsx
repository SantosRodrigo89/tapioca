import { MenuItemCard } from "./menu-item-card";
import type { Category, MenuItem } from "@/types";

interface CategorySectionProps {
  category: Category;
  items: MenuItem[];
}

export function CategorySection({ category, items }: CategorySectionProps) {
  if (items.length === 0) return null;

  return (
    <section id={`cat-${category.id}`} className="space-y-3 scroll-mt-16">
      <h2 className="text-lg font-semibold px-1">{category.name}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
