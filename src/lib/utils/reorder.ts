export interface Orderable {
  id: string;
  order: number;
}

export const CATEGORY_DND_PREFIX = "category::";
export const ITEM_DND_PREFIX = "item::";

export function categoryDndId(categoryId: string): string {
  return `${CATEGORY_DND_PREFIX}${categoryId}`;
}

export function itemDndId(categoryId: string, itemId: string): string {
  return `${ITEM_DND_PREFIX}${categoryId}::${itemId}`;
}

export function parseDndId(
  dndId: string,
):
  | { type: "category"; categoryId: string }
  | { type: "item"; categoryId: string; itemId: string }
  | null {
  if (dndId.startsWith(CATEGORY_DND_PREFIX)) {
    return {
      type: "category",
      categoryId: dndId.slice(CATEGORY_DND_PREFIX.length),
    };
  }

  if (dndId.startsWith(ITEM_DND_PREFIX)) {
    const rest = dndId.slice(ITEM_DND_PREFIX.length);
    const separator = rest.indexOf("::");
    if (separator === -1) return null;

    return {
      type: "item",
      categoryId: rest.slice(0, separator),
      itemId: rest.slice(separator + 2),
    };
  }

  return null;
}

export function getDragReorderUpdates<T extends Orderable>(
  items: T[],
  activeId: string,
  overId: string,
): { id: string; order: number }[] | null {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const oldIndex = sorted.findIndex((item) => item.id === activeId);
  const newIndex = sorted.findIndex((item) => item.id === overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return null;
  }

  const reordered = [...sorted];
  const [moved] = reordered.splice(oldIndex, 1);
  reordered.splice(newIndex, 0, moved!);

  const updates = reordered
    .map((item, index) => ({ id: item.id, order: index }))
    .filter((update) => {
      const original = sorted.find((item) => item.id === update.id)!;
      return original.order !== update.order;
    });

  return updates.length > 0 ? updates : null;
}

export function applyOrderUpdates<T extends Orderable>(
  items: T[],
  updates: { id: string; order: number }[],
): T[] {
  const orderMap = new Map(updates.map((u) => [u.id, u.order]));
  return [...items]
    .map((item) =>
      orderMap.has(item.id)
        ? { ...item, order: orderMap.get(item.id)! }
        : item,
    )
    .sort((a, b) => a.order - b.order);
}
