"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  FEATURE_CATEGORY_LABELS,
  type FeatureListItem,
} from "@/features/super/features/feature-types";

interface FeaturesGlobalTabProps {
  features: FeatureListItem[];
  onUpdateFeature: (featureId: string, patch: Partial<FeatureListItem>) => void;
}

export function FeaturesGlobalTab({
  features,
  onUpdateFeature,
}: FeaturesGlobalTabProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const patchFeature = async (
    featureId: string,
    patch: { globalEnabled?: boolean; defaultEnabled?: boolean },
  ) => {
    setUpdatingId(featureId);
    try {
      const res = await fetch(`/api/super/features/${featureId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = (await res.json()) as { error?: string; feature?: FeatureListItem };
      if (!res.ok) throw new Error(body.error ?? "Falha ao atualizar");

      onUpdateFeature(featureId, body.feature ?? patch);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="rounded-lg border overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium">Recurso</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 font-medium text-center">Global</th>
            <th className="px-4 py-3 font-medium text-center">Default</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.id} className="border-b last:border-0">
              <td className="px-4 py-3">
                <p className="font-medium">{feature.name}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="capitalize font-normal">
                  {FEATURE_CATEGORY_LABELS[feature.category]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-primary"
                  checked={feature.globalEnabled}
                  disabled={updatingId === feature.id}
                  onChange={(e) =>
                    patchFeature(feature.id, { globalEnabled: e.target.checked })
                  }
                  aria-label={`Global ${feature.name}`}
                />
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-primary"
                  checked={feature.defaultEnabled}
                  disabled={updatingId === feature.id}
                  onChange={(e) =>
                    patchFeature(feature.id, { defaultEnabled: e.target.checked })
                  }
                  aria-label={`Default ${feature.name}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
