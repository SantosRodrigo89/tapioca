import type { Metadata } from "next";
import { listPlansServer } from "@/lib/repositories/server/platform/plan.server";
import { SuperPageHeader } from "@/components/super/super-page-header";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Planos — Super Admin" };

export default async function SuperPlansPage() {
  const plans = await listPlansServer();

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Planos"
        description="Gerencie os planos da plataforma. Cobrança ainda não implementada."
      />

      {plans.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum plano cadastrado. Execute a inicialização da plataforma no
          Dashboard.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: plan.color }}
                />
                <h2 className="font-semibold">{plan.name}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <p className="text-sm">
                Preço:{" "}
                {plan.priceCents > 0
                  ? formatPrice(plan.priceCents)
                  : "Sob consulta"}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                Status: {plan.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
