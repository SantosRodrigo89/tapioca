import type { Metadata } from "next";
import { listTemplatesServer } from "@/lib/repositories/server/platform/template.server";
import { SuperPageHeader } from "@/components/super/super-page-header";

export const metadata: Metadata = { title: "Templates — Super Admin" };

export default async function SuperTemplatesPage() {
  const templates = await listTemplatesServer();

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Templates"
        description="Templates de identidade visual para novos restaurantes."
      />

      {templates.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum template cadastrado. Execute a inicialização da plataforma no
          Dashboard.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div key={template.id} className="rounded-lg border p-4 space-y-2">
              <h2 className="font-semibold">{template.name}</h2>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {template.category} · {template.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
