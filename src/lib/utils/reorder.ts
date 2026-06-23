export interface Orderable {
  id: string;
  order: number;
}

export function getReorderUpdates<T extends Orderable>(
  items: T[],
  id: string,
  direction: "up" | "down",
): { id: string; order: number }[] | null {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const neighborIdx = direction === "up" ? idx - 1 : idx + 1;
  if (neighborIdx < 0 || neighborIdx >= sorted.length) return null;

  const current = sorted[idx]!;
  const neighbor = sorted[neighborIdx]!;

  return [
    { id: current.id, order: neighbor.order },
    { id: neighbor.id, order: current.order },
  ];
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
