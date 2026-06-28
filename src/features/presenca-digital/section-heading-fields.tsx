"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SectionHeadingFieldsProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  titleLabel?: string;
  subtitleLabel?: string;
  eyebrowLabel?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showEyebrow?: boolean;
  disabled?: boolean;
  titlePlaceholder?: string;
  subtitlePlaceholder?: string;
  eyebrowPlaceholder?: string;
  onTitleChange?: (value: string) => void;
  onSubtitleChange?: (value: string) => void;
  onEyebrowChange?: (value: string) => void;
}

export function SectionHeadingFields({
  title = "",
  subtitle = "",
  eyebrow = "",
  titleLabel = "Título da seção",
  subtitleLabel = "Subtítulo",
  eyebrowLabel = "Destaque acima do título",
  showTitle = true,
  showSubtitle = true,
  showEyebrow = false,
  disabled = false,
  titlePlaceholder,
  subtitlePlaceholder,
  eyebrowPlaceholder,
  onTitleChange,
  onSubtitleChange,
  onEyebrowChange,
}: SectionHeadingFieldsProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
      <div>
        <p className="text-sm font-medium">Textos da seção</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Personalize os títulos exibidos na landing page. Deixe em branco para
          usar o padrão.
        </p>
      </div>

      {showEyebrow && (
        <div className="space-y-1">
          <Label htmlFor="section-eyebrow">{eyebrowLabel}</Label>
          <Input
            id="section-eyebrow"
            value={eyebrow}
            disabled={disabled}
            placeholder={eyebrowPlaceholder}
            onChange={(e) => onEyebrowChange?.(e.target.value)}
          />
        </div>
      )}

      {showTitle && (
        <div className="space-y-1">
          <Label htmlFor="section-title">{titleLabel}</Label>
          <Input
            id="section-title"
            value={title}
            disabled={disabled}
            placeholder={titlePlaceholder}
            onChange={(e) => onTitleChange?.(e.target.value)}
          />
        </div>
      )}

      {showSubtitle && (
        <div className="space-y-1">
          <Label htmlFor="section-subtitle">{subtitleLabel}</Label>
          <Textarea
            id="section-subtitle"
            rows={2}
            value={subtitle}
            disabled={disabled}
            placeholder={subtitlePlaceholder}
            onChange={(e) => onSubtitleChange?.(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
