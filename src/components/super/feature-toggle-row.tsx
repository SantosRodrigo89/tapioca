"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FEATURE_CATEGORY_LABELS,
  type FeatureListItem,
} from "@/features/super/features/feature-types";

interface FeatureToggleRowProps {
  feature: FeatureListItem;
  enabled: boolean;
  disabled?: boolean;
  onToggle: (enabled: boolean) => void;
  hint?: string;
  extra?: React.ReactNode;
}

export function FeatureToggleRow({
  feature,
  enabled,
  disabled,
  onToggle,
  hint,
  extra,
}: FeatureToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b last:border-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-sm">{feature.name}</p>
          <Badge variant="outline" className="text-xs font-normal capitalize">
            {FEATURE_CATEGORY_LABELS[feature.category]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
        {hint ? (
          <p className="text-xs text-muted-foreground mt-1">{hint}</p>
        ) : null}
        {extra}
      </div>

      <label className="inline-flex items-center gap-2 shrink-0 cursor-pointer">
        <span className="text-xs text-muted-foreground sr-only">
          {enabled ? "Ativo" : "Inativo"}
        </span>
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-input accent-primary cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          checked={enabled}
          disabled={disabled}
          onChange={(e) => onToggle(e.target.checked)}
          aria-label={`${feature.name} ${enabled ? "ativo" : "inativo"}`}
        />
      </label>
    </div>
  );
}
