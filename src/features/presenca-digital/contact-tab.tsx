"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  formatPhoneInputValue,
  normalizePhoneInput,
} from "@/lib/utils";
import { updateTenant, updateSiteConfig } from "@/lib/repositories/tenant.repository";
import { UpdateSiteContactSchema } from "@/lib/schemas/site.schema";
import {
  buildSectionCopyPatch,
  DEFAULT_SECTION_COPY,
  mergeSectionCopyPatch,
  resolveSectionCopy,
} from "@/lib/site/section-copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactCtaFields } from "@/features/presenca-digital/contact-cta-fields";
import {
  SectionCopyBlock,
  buildTitleSubtitleFields,
} from "@/features/presenca-digital/section-copy-block";
import { LandingMobilePreviewShell } from "@/features/presenca-digital/landing-mobile-preview-shell";
import { ContactPreviewContent } from "@/features/presenca-digital/landing-section-preview-content";
import { buildPreviewLandingData } from "@/lib/site/landing-preview";
import type { SiteConfig } from "@/types/site";
import type { Tenant } from "@/types";

interface ContactTabProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  onTenantChange: (patch: Partial<Tenant>) => void;
  onSiteConfigChange: (config: SiteConfig) => void;
}

export function ContactTab({
  tenant,
  siteConfig,
  onTenantChange,
  onSiteConfigChange,
}: ContactTabProps) {
  const contact = siteConfig.contact;
  const location = siteConfig.location;
  const resolvedCopy = resolveSectionCopy(siteConfig.sectionCopy);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [whatsapp, setWhatsapp] = useState(
    contact.whatsapp ?? tenant.whatsapp ?? "",
  );
  const [phone, setPhone] = useState(contact.phone ?? "");
  const [instagram, setInstagram] = useState(contact.instagram ?? "");
  const [facebook, setFacebook] = useState(contact.facebook ?? "");
  const [tiktok, setTiktok] = useState(contact.tiktok ?? "");
  const [email, setEmail] = useState(contact.email ?? "");
  const [address, setAddress] = useState(
    location.address ?? tenant.address ?? "",
  );
  const [sectionTitle, setSectionTitle] = useState<string>(
    resolvedCopy.contact.title ?? "",
  );
  const [sectionSubtitle, setSectionSubtitle] = useState<string>(
    resolvedCopy.contact.subtitle ?? "",
  );
  const [ctaEyebrow, setCtaEyebrow] = useState<string>(
    resolvedCopy.contact.ctaEyebrow ?? "",
  );
  const [ctaTitle, setCtaTitle] = useState<string>(resolvedCopy.contact.ctaTitle ?? "");
  const [ctaSubtitle, setCtaSubtitle] = useState<string>(
    resolvedCopy.contact.ctaSubtitle ?? "",
  );
  const [locationTitle, setLocationTitle] = useState<string>(
    resolvedCopy.location.title ?? "",
  );
  const [locationSubtitle, setLocationSubtitle] = useState<string>(
    resolvedCopy.location.subtitle ?? "",
  );

  const previewData = useMemo(() => {
    const contactCopyPatch = buildSectionCopyPatch("contact", {
      title: sectionTitle,
      subtitle: sectionSubtitle,
      ctaEyebrow,
      ctaTitle,
      ctaSubtitle,
    });
    const locationCopyPatch = buildSectionCopyPatch("location", {
      title: locationTitle,
      subtitle: locationSubtitle,
    });
    const whatsappValue = whatsapp.trim() || undefined;
    const addressValue = address.trim() || undefined;

    return buildPreviewLandingData(tenant, siteConfig, {
      siteConfigPatch: {
        contact: {
          ...siteConfig.contact,
          whatsapp: whatsappValue,
          phone: phone.trim() || undefined,
          instagram: instagram.trim() || undefined,
          facebook: facebook.trim() || undefined,
          tiktok: tiktok.trim() || undefined,
          email: email.trim() || undefined,
        },
        location: {
          ...siteConfig.location,
          address: addressValue,
        },
      },
      sectionCopyPatches: [
        { ...contactCopyPatch, ...locationCopyPatch },
      ],
      whatsapp: whatsappValue,
    });
  }, [
    tenant,
    siteConfig,
    sectionTitle,
    sectionSubtitle,
    ctaEyebrow,
    ctaTitle,
    ctaSubtitle,
    locationTitle,
    locationSubtitle,
    whatsapp,
    phone,
    instagram,
    facebook,
    tiktok,
    email,
    address,
  ]);

  const hasChanges =
    whatsapp !== (contact.whatsapp ?? tenant.whatsapp ?? "") ||
    phone !== (contact.phone ?? "") ||
    instagram !== (contact.instagram ?? "") ||
    facebook !== (contact.facebook ?? "") ||
    tiktok !== (contact.tiktok ?? "") ||
    email !== (contact.email ?? "") ||
    address !== (location.address ?? tenant.address ?? "") ||
    sectionTitle !== (resolvedCopy.contact.title ?? "") ||
    sectionSubtitle !== (resolvedCopy.contact.subtitle ?? "") ||
    ctaEyebrow !== (resolvedCopy.contact.ctaEyebrow ?? "") ||
    ctaTitle !== (resolvedCopy.contact.ctaTitle ?? "") ||
    ctaSubtitle !== (resolvedCopy.contact.ctaSubtitle ?? "") ||
    locationTitle !== (resolvedCopy.location.title ?? "") ||
    locationSubtitle !== (resolvedCopy.location.subtitle ?? "");

  const handleSave = async () => {
    const parsed = UpdateSiteContactSchema.safeParse({
      whatsapp: whatsapp.trim() || "",
      phone: phone.trim() || undefined,
      instagram: instagram.trim() || undefined,
      facebook: facebook.trim() || undefined,
      tiktok: tiktok.trim() || undefined,
      email: email.trim() || "",
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dados de contato inválidos");
      return;
    }

    setIsSubmitting(true);
    try {
      const whatsappValue = parsed.data.whatsapp || undefined;
      const addressValue = address.trim() || undefined;

      await updateTenant(tenant.id, {
        whatsapp: whatsappValue,
        address: addressValue,
      });

      const contactPatch = {
        whatsapp: whatsappValue,
        phone: parsed.data.phone,
        instagram: parsed.data.instagram,
        facebook: parsed.data.facebook,
        tiktok: parsed.data.tiktok,
        email: parsed.data.email || undefined,
      };

      const locationPatch = {
        address: addressValue,
      };

      const contactCopyPatch = buildSectionCopyPatch("contact", {
        title: sectionTitle,
        subtitle: sectionSubtitle,
        ctaEyebrow,
        ctaTitle,
        ctaSubtitle,
      });
      const locationCopyPatch = buildSectionCopyPatch("location", {
        title: locationTitle,
        subtitle: locationSubtitle,
      });
      const sectionCopyPatch = {
        ...contactCopyPatch,
        ...locationCopyPatch,
      };

      await updateSiteConfig(
        tenant.id,
        { contact: contactPatch, location: locationPatch, sectionCopy: sectionCopyPatch },
        siteConfig,
      );

      onTenantChange({ whatsapp: whatsappValue, address: addressValue });
      onSiteConfigChange({
        ...siteConfig,
        contact: { ...siteConfig.contact, ...contactPatch },
        location: { ...siteConfig.location, ...locationPatch },
        sectionCopy: mergeSectionCopyPatch(
          siteConfig.sectionCopy ?? {},
          sectionCopyPatch,
        ),
      });

      toast.success("Contato salvo");
    } catch (err) {
      console.error("[contact-tab]", err);
      toast.error("Erro ao salvar contato");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Contato</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Canais de comunicação e endereço do restaurante.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_min(390px,100%)] xl:items-start">
        <div className="min-w-0 space-y-6">
          <SectionCopyBlock
            blockTitle="Cabeçalho da seção Contato"
            blockDescription="Campos vazios usam o texto padrão."
            disabled={isSubmitting}
            fields={buildTitleSubtitleFields({
              idPrefix: "contact",
              title: sectionTitle,
              subtitle: sectionSubtitle,
              titleDefault: DEFAULT_SECTION_COPY.contact.title,
              subtitleDefault: DEFAULT_SECTION_COPY.contact.subtitle,
              onTitleChange: setSectionTitle,
              onSubtitleChange: setSectionSubtitle,
            })}
          />

          <ContactCtaFields
            ctaEyebrow={ctaEyebrow}
            ctaTitle={ctaTitle}
            ctaSubtitle={ctaSubtitle}
            disabled={isSubmitting}
            eyebrowPlaceholder={DEFAULT_SECTION_COPY.contact.ctaEyebrow}
            titlePlaceholder={DEFAULT_SECTION_COPY.contact.ctaTitle}
            subtitlePlaceholder={DEFAULT_SECTION_COPY.contact.ctaSubtitle}
            onCtaEyebrowChange={setCtaEyebrow}
            onCtaTitleChange={setCtaTitle}
            onCtaSubtitleChange={setCtaSubtitle}
          />

          <SectionCopyBlock
            blockTitle="Cabeçalho da seção Localização"
            blockDescription="Campos vazios usam o texto padrão."
            disabled={isSubmitting}
            fields={buildTitleSubtitleFields({
              idPrefix: "location",
              title: locationTitle,
              subtitle: locationSubtitle,
              titleLabel: "Título da seção Localização",
              subtitleLabel: "Subtítulo da Localização",
              titleDefault: DEFAULT_SECTION_COPY.location.title,
              subtitleDefault: DEFAULT_SECTION_COPY.location.subtitle,
              onTitleChange: setLocationTitle,
              onSubtitleChange: setLocationSubtitle,
            })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            type="tel"
            inputMode="numeric"
            value={formatPhoneInputValue(whatsapp)}
            disabled={isSubmitting}
            onChange={(e) =>
              setWhatsapp(normalizePhoneInput(e.target.value, 13))
            }
            placeholder="+55 (31) 99999-9999"
          />
          <p className="text-xs text-muted-foreground">
            Com DDI do Brasil, ex: +55 (31) 99999-9999
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={formatPhoneInputValue(phone)}
            disabled={isSubmitting}
            onChange={(e) =>
              setPhone(normalizePhoneInput(e.target.value, 11))
            }
            placeholder="(31) 99999-9999"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={instagram}
            disabled={isSubmitting}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@seurestaurante"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            value={facebook}
            disabled={isSubmitting}
            onChange={(e) => setFacebook(e.target.value)}
            placeholder="facebook.com/seurestaurante"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="tiktok">TikTok</Label>
          <Input
            id="tiktok"
            value={tiktok}
            disabled={isSubmitting}
            onChange={(e) => setTiktok(e.target.value)}
            placeholder="@seurestaurante"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled={isSubmitting}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@restaurante.com"
          />
        </div>
      </div>

          <div className="space-y-1">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={address}
              disabled={isSubmitting}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua Exemplo, 123 — Bairro, Cidade/UF"
            />
          </div>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || !hasChanges}
          >
            {isSubmitting ? "Salvando…" : "Salvar contato"}
          </Button>
        </div>

        <div className="xl:sticky xl:top-6">
          <LandingMobilePreviewShell
            tenant={tenant}
            siteConfig={previewData.siteConfig}
          >
            <ContactPreviewContent data={previewData} />
          </LandingMobilePreviewShell>
        </div>
      </div>
    </div>
  );
}
