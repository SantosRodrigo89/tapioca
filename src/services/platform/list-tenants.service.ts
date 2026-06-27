import type { Tenant, TenantStatus } from "@/types";
import type { ListTenantsQuery } from "@/lib/schemas/platform/list-tenants.schema";
import {
  listTenantsServer,
  queryTenantsPaginatedServer,
} from "@/lib/repositories/server/tenant.server";
import { getPlatformSettingsServer } from "@/lib/repositories/server/platform/platform-settings.server";

export interface TenantListRow {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  planId: string;
  status: TenantStatus;
  domain: string;
  createdAt: Date;
  lastAccessAt?: Date;
  userCount: number;
}

export interface ListTenantsResult {
  items: TenantListRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

function matchesSearch(tenant: Tenant, query: string): boolean {
  const q = normalizeSearch(query);
  if (!q) return true;

  return (
    tenant.name.toLowerCase().includes(q) ||
    tenant.slug.toLowerCase().includes(q) ||
    (tenant.customDomain?.toLowerCase().includes(q) ?? false) ||
    (tenant.planId?.toLowerCase().includes(q) ?? false)
  );
}

function compareTenants(
  a: Tenant,
  b: Tenant,
  sort: ListTenantsQuery["sort"],
  order: ListTenantsQuery["order"],
): number {
  let result = 0;

  switch (sort) {
    case "name":
      result = a.name.localeCompare(b.name, "pt-BR");
      break;
    case "slug":
      result = a.slug.localeCompare(b.slug, "pt-BR");
      break;
    case "lastAccessAt": {
      const aTime = a.lastAccessAt?.getTime() ?? 0;
      const bTime = b.lastAccessAt?.getTime() ?? 0;
      result = aTime - bTime;
      break;
    }
    case "createdAt":
    default:
      result = a.createdAt.getTime() - b.createdAt.getTime();
      break;
  }

  return order === "asc" ? result : -result;
}

function toListRow(tenant: Tenant, platformDomain: string): TenantListRow {
  const domain = tenant.customDomain ?? `${platformDomain}/${tenant.slug}`;

  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    logoUrl: tenant.logoUrl,
    planId: tenant.planId ?? "starter",
    status: tenant.status,
    domain,
    createdAt: tenant.createdAt,
    lastAccessAt: tenant.lastAccessAt,
    userCount: tenant.ownerUid ? 1 : 0,
  };
}

function buildResult(
  tenants: Tenant[],
  total: number,
  query: ListTenantsQuery,
  platformDomain: string,
): ListTenantsResult {
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);

  return {
    items: tenants.map((t) => toListRow(t, platformDomain)),
    total,
    page,
    pageSize: query.pageSize,
    totalPages,
  };
}

async function listTenantsWithSearch(query: ListTenantsQuery): Promise<ListTenantsResult> {
  const [tenants, settings] = await Promise.all([
    listTenantsServer(),
    getPlatformSettingsServer(),
  ]);

  let filtered = tenants;

  if (query.status && query.status !== "all") {
    filtered = filtered.filter((t) => t.status === query.status);
  }

  if (query.q) {
    filtered = filtered.filter((t) => matchesSearch(t, query.q!));
  }

  filtered.sort((a, b) => compareTenants(a, b, query.sort, query.order));

  const total = filtered.length;
  const start = (query.page - 1) * query.pageSize;
  const slice = filtered.slice(start, start + query.pageSize);

  return buildResult(slice, total, query, settings.domain);
}

export async function listTenantsPaginatedServer(
  query: ListTenantsQuery,
): Promise<ListTenantsResult> {
  const settings = await getPlatformSettingsServer();

  if (query.q?.trim()) {
    return listTenantsWithSearch(query);
  }

  const { items, total } = await queryTenantsPaginatedServer({
    status: query.status ?? "all",
    sort: query.sort ?? "createdAt",
    order: query.order ?? "desc",
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
  });

  return buildResult(items, total, query, settings.domain);
}
