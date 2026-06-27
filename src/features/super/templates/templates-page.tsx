"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { SuperPageHeader } from "@/components/super/super-page-header";
import { TemplateStatusBadge } from "@/components/super/template-status-badge";
import { Button } from "@/components/ui/button";
import { TemplateEditDialog } from "@/features/super/templates/template-edit-dialog";
import {
  TEMPLATE_CATEGORY_LABELS,
  type TemplateListItem,
} from "@/features/super/templates/template-types";

interface TemplatesPageProps {
  initialTemplates: TemplateListItem[];
}

export function TemplatesPage({ initialTemplates }: TemplatesPageProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [editing, setEditing] = useState<TemplateListItem | null>(null);

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Templates"
        description="Templates de identidade visual aplicados na criação de restaurantes."
      />

      {templates.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum template cadastrado. Execute a inicialização da plataforma no
          Dashboard.
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium w-12" />
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Ordem</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium w-20">Ações</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div
                      className="h-9 w-9 rounded-md border"
                      style={{
                        background: `linear-gradient(135deg, ${template.themePreset?.primaryColor ?? "#64748b"} 50%, ${template.themePreset?.secondaryColor ?? "#94a3b8"} 50%)`,
                      }}
                      title="Preview de cores"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">
                      {template.description}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {TEMPLATE_CATEGORY_LABELS[template.category]}
                  </td>
                  <td className="px-4 py-3 text-center">{template.order}</td>
                  <td className="px-4 py-3">
                    <TemplateStatusBadge status={template.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditing(template)}
                      aria-label={`Editar ${template.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Templates fixos nesta fase. Presets de seções (`siteConfig`) serão
        expandidos quando a identidade visual evoluir.
      </p>

      <TemplateEditDialog
        template={editing}
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        onSaved={(updated) => {
          setTemplates((current) =>
            [...current.map((t) => (t.id === updated.id ? updated : t))].sort(
              (a, b) => a.order - b.order,
            ),
          );
        }}
      />
    </div>
  );
}
