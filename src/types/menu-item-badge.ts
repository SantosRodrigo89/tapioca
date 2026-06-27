export type MenuItemBadge =
  | "new"
  | "bestseller"
  | "house_special"
  | "gluten_free"
  | "vegetarian";

export const MENU_ITEM_BADGE_LABELS: Record<MenuItemBadge, string> = {
  new: "Novo",
  bestseller: "Mais Vendido",
  house_special: "Especial da Casa",
  gluten_free: "Sem Glúten",
  vegetarian: "Vegetariano",
};

export const MENU_ITEM_BADGES = Object.keys(
  MENU_ITEM_BADGE_LABELS,
) as MenuItemBadge[];

export function isMenuItemBadge(value: unknown): value is MenuItemBadge {
  return (
    typeof value === "string" &&
    MENU_ITEM_BADGES.includes(value as MenuItemBadge)
  );
}
