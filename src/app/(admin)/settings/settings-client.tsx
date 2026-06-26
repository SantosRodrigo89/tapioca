"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink } from "lucide-react";
import { refreshAuthToken } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tenant } from "@/types";

interface SettingsClientProps {
  tenant: Tenant;
}

export function SettingsClient({ tenant }: SettingsClientProps) {
  const [copied, setCopied] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      window.location.origin;
    setPublicUrl(`${base}/${tenant.slug}`);
  }, [tenant.slug]);

  useEffect(() => {
    void refreshAuthToken().catch(console.error);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Informações gerais e link do seu restaurante.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Link do cardápio</h2>
        <div className="space-y-1">
          <Label>Slug (imutável)</Label>
          <p className="text-sm font-mono bg-muted rounded-md px-3 py-2">
            {tenant.slug}
          </p>
        </div>
        <div className="space-y-1">
          <Label>URL pública</Label>
          <div className="flex items-center gap-2">
            <Input value={publicUrl} readOnly className="font-mono text-xs" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Copiar URL"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Presença Digital</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Aparência, banner, galeria, contato, horários, SEO e QR Code estão
            em Presença Digital.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/site">
            Editar Presença Digital
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
