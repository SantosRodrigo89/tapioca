"use client";

import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { resolveFieldDisplay } from "@/lib/site/section-copy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface CopyFieldConfig {
  id: string;
  label: string;
  value: string;
  defaultValue?: string;
  placeholder?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
  onReset?: () => void;
}

interface SectionCopyBlockProps {
  blockTitle?: string;
  blockDescription?: string;
  disabled?: boolean;
  preview?: ReactNode;
  fields: CopyFieldConfig[];
  className?: string;
}

function CopyFieldRow({
  field,
  disabled,
}: {
  field: CopyFieldConfig;
  disabled?: boolean;
}) {
  const { isDefault } = resolveFieldDisplay(
    field.value,
    field.defaultValue ?? "",
  );

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <Label htmlFor={field.id}>{field.label}</Label>
        {field.defaultValue !== undefined && (
          <Badge variant={isDefault ? "secondary" : "outline"} className="font-normal">
            {isDefault ? "Padrão" : "Personalizado"}
          </Badge>
        )}
        {!isDefault && field.onReset && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground"
            disabled={disabled}
            onClick={field.onReset}
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Restaurar padrão
          </Button>
        )}
      </div>
      {field.multiline ? (
        <Textarea
          id={field.id}
          rows={2}
          value={field.value}
          disabled={disabled}
          placeholder={field.placeholder}
          onChange={(e) => field.onChange(e.target.value)}
        />
      ) : (
        <Input
          id={field.id}
          value={field.value}
          disabled={disabled}
          placeholder={field.placeholder}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function SectionCopyBlock({
  blockTitle = "Cabeçalho da seção",
  blockDescription = "Veja a pré-visualização mobile ao lado. Campos vazios usam o texto padrão.",
  disabled = false,
  preview,
  fields,
  className,
}: SectionCopyBlockProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-muted/20 p-4",
        className,
      )}
    >
      <div className="mb-4">
        <p className="text-sm font-medium">{blockTitle}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{blockDescription}</p>
      </div>

      <div
        className={cn(
          preview
            ? "flex flex-col gap-6 xl:flex-row xl:items-start"
            : "space-y-4",
        )}
      >
        <div className="min-w-0 flex-1 space-y-4">{fields.map((field) => (
          <CopyFieldRow key={field.id} field={field} disabled={disabled} />
        ))}</div>

        {preview ? (
          <div className="min-w-0 xl:w-[min(100%,390px)] xl:shrink-0">
            {preview}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function buildTitleSubtitleFields({
  idPrefix,
  title,
  subtitle,
  titleLabel = "Título da seção",
  subtitleLabel = "Subtítulo",
  titleDefault,
  subtitleDefault,
  onTitleChange,
  onSubtitleChange,
}: {
  idPrefix: string;
  title: string;
  subtitle: string;
  titleLabel?: string;
  subtitleLabel?: string;
  titleDefault?: string;
  subtitleDefault?: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
}): CopyFieldConfig[] {
  return [
    {
      id: `${idPrefix}-title`,
      label: titleLabel,
      value: title,
      defaultValue: titleDefault,
      placeholder: titleDefault,
      onChange: onTitleChange,
      onReset: titleDefault ? () => onTitleChange("") : undefined,
    },
    {
      id: `${idPrefix}-subtitle`,
      label: subtitleLabel,
      value: subtitle,
      defaultValue: subtitleDefault,
      placeholder: subtitleDefault,
      multiline: true,
      onChange: onSubtitleChange,
      onReset: subtitleDefault ? () => onSubtitleChange("") : undefined,
    },
  ];
}
