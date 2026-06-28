import { adminDb } from "@/lib/firebase/admin";
import { parseConfigurationGroups } from "@/lib/catalog/parse-configuration";
import { resolveMenuItemsWithComplements } from "@/lib/catalog/resolve-complements";
import { isMenuItemBadge } from "@/types/menu-item-badge";
import type { Complement, MenuItem, AvailabilitySchedule } from "@/types";

function parseAvailability(
  data: FirebaseFirestore.DocumentData,
): AvailabilitySchedule | undefined {
  const raw = data.availability as AvailabilitySchedule | undefined;
  if (!raw?.enabled) return undefined;
  return raw;
}

function parseComplementIds(
  data: FirebaseFirestore.DocumentData,
): string[] | undefined {
  const raw = data.complementIds;
  if (!Array.isArray(raw)) return undefined;
  const ids = raw.filter((id): id is string => typeof id === "string" && id.length > 0);
  return ids.length > 0 ? ids : undefined;
}

function docToMenuItem(
  id: string,
  data: FirebaseFirestore.DocumentData,
): MenuItem {
  return {
    id,
    name: data.name as string,
    description: data.description ?? undefined,
    price: data.price as number,
    imageUrl: data.imageUrl ?? undefined,
    available: data.available as boolean,
    availability: parseAvailability(data),
    configurationGroups: parseConfigurationGroups(data.configurationGroups),
    complementIds: parseComplementIds(data),
    badge: isMenuItemBadge(data.badge) ? data.badge : undefined,
    order: data.order as number,
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
    updatedAt: (data.updatedAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export interface GetItemsOptions {
  availableOnly?: boolean;
  resolveComplements?: boolean;
  complementsCatalog?: Complement[];
}

export async function getItemsByCategoryServer(
  tenantId: string,
  categoryId: string,
  {
    availableOnly = false,
    resolveComplements = false,
    complementsCatalog,
  }: GetItemsOptions = {},
): Promise<MenuItem[]> {
  let query = adminDb
    .collection(`tenants/${tenantId}/categories/${categoryId}/items`)
    .orderBy("order", "asc") as FirebaseFirestore.Query;

  if (availableOnly) {
    query = query.where("available", "==", true);
  }

  const snap = await query.get();
  const items = snap.docs.map((d) => docToMenuItem(d.id, d.data()));

  if (!resolveComplements || !complementsCatalog) {
    return items;
  }

  return resolveMenuItemsWithComplements(items, complementsCatalog, {
    publicOnly: availableOnly,
  });
}

/** Fetches items for multiple categories in parallel (one query per category). */
export async function getItemsByCategoriesServer(
  tenantId: string,
  categoryIds: string[],
  options: GetItemsOptions = {},
): Promise<Map<string, MenuItem[]>> {
  if (categoryIds.length === 0) return new Map();

  const entries = await Promise.all(
    categoryIds.map(async (categoryId) => {
      const items = await getItemsByCategoryServer(tenantId, categoryId, options);
      return [categoryId, items] as const;
    }),
  );

  return new Map(entries);
}
