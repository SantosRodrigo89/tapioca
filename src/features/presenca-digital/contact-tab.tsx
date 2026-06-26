"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateTenant, updateSiteConfig } from "@/lib/repositories/tenant.repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const hasChanges =
    whatsapp !== (contact.whatsapp ?? tenant.whatsapp ?? "") ||
    phone !== (contact.phone ?? "") ||
    instagram !== (contact.instagram ?? "") ||
    facebook !== (contact.facebook ?? "") ||
    tiktok !== (contact.tiktok ?? "") ||
    email !== (contact.email ?? "") ||
    address !== (location.address ?? tenant.address ?? "");

  const handleSave = async () => {
    if (whatsapp && !/^\d+$/.test(whatsapp)) {
      toast.error("WhatsApp deve conter apenas números");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("E-mail inválido");
      return;
    }

    setIsSubmitting(true);
    try {
      const whatsappValue = whatsapp.trim() || undefined;
      const addressValue = address.trim() || undefined;

      await updateTenant(tenant.id, {
        whatsapp: whatsappValue,
        address: addressValue,
      });

      const contactPatch = {
        whatsapp: whatsappValue,
        phone: phone.trim() || undefined,
        instagram: instagram.trim() || undefined,
        facebook: facebook.trim() || undefined,
        tiktok: tiktok.trim() || undefined,
        email: email.trim() || undefined,
      };

      const locationPatch = {
        address: addressValue,
      };

      await updateSiteConfig(
        tenant.id,
        { contact: contactPatch, location: locationPatch },
        siteConfig,
      );

      onTenantChange({ whatsapp: whatsappValue, address: addressValue });
      onSiteConfigChange({
        ...siteConfig,
        contact: { ...siteConfig.contact, ...contactPatch },
        location: { ...siteConfig.location, ...locationPatch },
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            type="tel"
            value={whatsapp}
            disabled={isSubmitting}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="5511999999999"
          />
          <p className="text-xs text-muted-foreground">
            Apenas números com DDI
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            disabled={isSubmitting}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
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
  );
}
