import type { Metadata } from "next";
import { Suspense } from "react";
import { ListTenantsQuerySchema } from "@/lib/schemas/platform/list-tenants.schema";
import { listTenantsPaginatedServer } from "@/services/platform/list-tenants.service";
import { RestaurantsPage } from "@/features/super/restaurants/restaurants-page";

export const metadata: Metadata = { title: "Restaurantes — Super Admin" };

interface SuperRestaurantsRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SuperRestaurantsRoute({
  searchParams,
}: SuperRestaurantsRouteProps) {
  const params = await searchParams;

  const parsed = ListTenantsQuerySchema.parse({
    q: typeof params.q === "string" ? params.q : undefined,
    status: typeof params.status === "string" ? params.status : undefined,
    sort: typeof params.sort === "string" ? params.sort : undefined,
    order: typeof params.order === "string" ? params.order : undefined,
    page: typeof params.page === "string" ? params.page : undefined,
    pageSize: typeof params.pageSize === "string" ? params.pageSize : undefined,
  });

  const data = await listTenantsPaginatedServer(parsed);

  const listKey = [
    parsed.q ?? "",
    parsed.status,
    parsed.sort,
    parsed.order,
    parsed.page,
  ].join("-");

  return (
    <Suspense>
      <RestaurantsPage key={listKey} data={data} />
    </Suspense>
  );
}
