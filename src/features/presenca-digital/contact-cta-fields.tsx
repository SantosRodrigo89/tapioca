"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeadingFields } from "./section-heading-fields";

interface ContactCtaFieldsProps {
  ctaEyebrow: string;
  ctaTitle: string;
  ctaSubtitle: string;
  disabled?: boolean;
  eyebrowPlaceholder?: string;
  titlePlaceholder?: string;
  subtitlePlaceholder?: string;
  onCtaEyebrowChange: (value: string) => void;
  onCtaTitleChange: (value: string) => void;
  onCtaSubtitleChange: (value: string) => void;
}

export function ContactCtaFields({
  ctaEyebrow,
  ctaTitle,
  ctaSubtitle,
  disabled = false,
  eyebrowPlaceholder,
  titlePlaceholder,
  subtitlePlaceholder,
  onCtaEyebrowChange,
  onCtaTitleChange,
  onCtaSubtitleChange,
}: ContactCtaFieldsProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
      <div>
        <p className="text-sm font-medium">Bloco de pedido WhatsApp</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Textos do destaque de pedido exibido na seção de contato.
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="contact-cta-eyebrow">Destaque</Label>
        <Input
          id="contact-cta-eyebrow"
          value={ctaEyebrow}
          disabled={disabled}
          placeholder={eyebrowPlaceholder}
          onChange={(e) => onCtaEyebrowChange(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="contact-cta-title">Título</Label>
        <Input
          id="contact-cta-title"
          value={ctaTitle}
          disabled={disabled}
          placeholder={titlePlaceholder}
          onChange={(e) => onCtaTitleChange(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="contact-cta-subtitle">Subtítulo</Label>
        <Textarea
          id="contact-cta-subtitle"
          rows={2}
          value={ctaSubtitle}
          disabled={disabled}
          placeholder={subtitlePlaceholder}
          onChange={(e) => onCtaSubtitleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export { SectionHeadingFields };
