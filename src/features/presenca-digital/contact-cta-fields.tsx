"use client";

import { DEFAULT_SECTION_COPY } from "@/lib/site/section-copy";
import { SectionCopyBlock } from "@/features/presenca-digital/section-copy-block";

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
  eyebrowPlaceholder = DEFAULT_SECTION_COPY.contact.ctaEyebrow,
  titlePlaceholder = DEFAULT_SECTION_COPY.contact.ctaTitle,
  subtitlePlaceholder = DEFAULT_SECTION_COPY.contact.ctaSubtitle,
  onCtaEyebrowChange,
  onCtaTitleChange,
  onCtaSubtitleChange,
}: ContactCtaFieldsProps) {
  return (
    <SectionCopyBlock
      blockTitle="Bloco de pedido WhatsApp"
      blockDescription="Textos do destaque de pedido exibido na seção de contato."
      disabled={disabled}
      fields={[
        {
          id: "contact-cta-eyebrow",
          label: "Destaque",
          value: ctaEyebrow,
          defaultValue: eyebrowPlaceholder,
          placeholder: eyebrowPlaceholder,
          onChange: onCtaEyebrowChange,
          onReset: () => onCtaEyebrowChange(""),
        },
        {
          id: "contact-cta-title",
          label: "Título",
          value: ctaTitle,
          defaultValue: titlePlaceholder,
          placeholder: titlePlaceholder,
          onChange: onCtaTitleChange,
          onReset: () => onCtaTitleChange(""),
        },
        {
          id: "contact-cta-subtitle",
          label: "Subtítulo",
          value: ctaSubtitle,
          defaultValue: subtitlePlaceholder,
          placeholder: subtitlePlaceholder,
          multiline: true,
          onChange: onCtaSubtitleChange,
          onReset: () => onCtaSubtitleChange(""),
        },
      ]}
    />
  );
}

export { SectionCopyBlock } from "@/features/presenca-digital/section-copy-block";
