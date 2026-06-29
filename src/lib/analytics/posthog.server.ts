import { getPostHogServerConfig } from "@/lib/analytics/posthog-config";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

function sanitizeTenantId(tenantId: string): string {
  return tenantId.replace(/[^a-zA-Z0-9_-]/g, "");
}

interface HogQLQueryResult {
  results?: unknown[];
}

async function runHogQLQuery(query: string): Promise<unknown[] | null> {
  const config = getPostHogServerConfig();
  if (!config) return null;

  const response = await fetch(
    `${config.host}/api/projects/${config.projectId}/query/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.personalApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query,
        },
      }),
    },
  );

  if (!response.ok) {
    console.error(
      "[posthog] query failed",
      response.status,
      await response.text(),
    );
    return null;
  }

  const data = (await response.json()) as HogQLQueryResult;
  return data.results ?? null;
}

function parseCount(results: unknown[] | null): number | null {
  if (!results?.length) return 0;
  const row = results[0];
  if (Array.isArray(row)) {
    const value = row[0];
    return typeof value === "number" ? value : Number(value) || 0;
  }
  return null;
}

export async function countEventsForTenant(
  event: string,
  tenantId: string,
  days: number,
): Promise<number | null> {
  const safeTenantId = sanitizeTenantId(tenantId);
  const safeEvent = event.replace(/'/g, "");

  const query = `
    SELECT count() AS c
    FROM events
    WHERE event = '${safeEvent}'
      AND properties.tenant_id = '${safeTenantId}'
      AND timestamp >= now() - INTERVAL ${days} DAY
  `;

  return parseCount(await runHogQLQuery(query));
}

export async function countPlatformPageViews(days: number): Promise<number | null> {
  const query = `
    SELECT count() AS c
    FROM events
    WHERE event = '${ANALYTICS_EVENTS.PAGE_VIEW}'
      AND timestamp >= now() - INTERVAL ${days} DAY
  `;

  return parseCount(await runHogQLQuery(query));
}

export async function topProductsForTenant(
  tenantId: string,
  days: number,
  limit = 5,
): Promise<Array<{ productId: string; count: number }>> {
  const safeTenantId = sanitizeTenantId(tenantId);

  const query = `
    SELECT properties.product_id AS product_id, count() AS c
    FROM events
    WHERE event = '${ANALYTICS_EVENTS.PRODUCT_OPEN}'
      AND properties.tenant_id = '${safeTenantId}'
      AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY product_id
    ORDER BY c DESC
    LIMIT ${limit}
  `;

  const results = await runHogQLQuery(query);
  if (!results) return [];

  return results
    .map((row) => {
      if (!Array.isArray(row) || row.length < 2) return null;
      const productId = String(row[0] ?? "");
      const count = typeof row[1] === "number" ? row[1] : Number(row[1]) || 0;
      if (!productId) return null;
      return { productId, count };
    })
    .filter((row): row is { productId: string; count: number } => row !== null);
}
