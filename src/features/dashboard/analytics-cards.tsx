import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TenantAnalyticsSummary } from "@/lib/analytics/events";

interface AnalyticsCardsProps {
  analytics: TenantAnalyticsSummary;
  productNames: Record<string, string>;
}

function formatMetric(value: number | null): string {
  if (value === null) return "—";
  return value.toLocaleString("pt-BR");
}

export function AnalyticsCards({ analytics, productNames }: AnalyticsCardsProps) {
  if (!analytics.configured) {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Analytics</h2>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Métricas de visitas ainda não configuradas na plataforma.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">Analytics</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visitas (7 dias)</CardDescription>
            <CardTitle className="text-3xl">
              {formatMetric(analytics.views7d)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Visualizações da sua landing page
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visitas (30 dias)</CardDescription>
            <CardTitle className="text-3xl">
              {formatMetric(analytics.views30d)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>WhatsApp (30 dias)</CardDescription>
            <CardTitle className="text-3xl">
              {formatMetric(analytics.whatsappClicks30d)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Cliques em links do WhatsApp
            </p>
          </CardContent>
        </Card>
      </div>

      {analytics.topProducts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Produtos mais abertos (30 dias)</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {analytics.topProducts.map((row) => (
                <li
                  key={row.productId}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="truncate">
                    {productNames[row.productId] ?? row.productId}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {row.count.toLocaleString("pt-BR")}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              <Link href="/menu/products" className="underline underline-offset-2">
                Ver produtos
              </Link>
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
