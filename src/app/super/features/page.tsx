import type { Metadata } from "next";
import { listFeaturesServer } from "@/lib/repositories/server/platform/feature.server";
import { SuperPageHeader } from "@/components/super/super-page-header";

export const metadata: Metadata = { title: "Recursos — Super Admin" };

export default async function SuperFeaturesPage() {
  const features = await listFeaturesServer();

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Recursos"
        description="Feature flags globais, por plano e por restaurante."
      />

      {features.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum recurso cadastrado. Execute a inicialização da plataforma no
          Dashboard.
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Recurso</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Global</th>
                <th className="px-4 py-3 font-medium">Default</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{feature.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {feature.category}
                  </td>
                  <td className="px-4 py-3">
                    {feature.globalEnabled ? "Ativo" : "Inativo"}
                  </td>
                  <td className="px-4 py-3">
                    {feature.defaultEnabled ? "Sim" : "Não"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
