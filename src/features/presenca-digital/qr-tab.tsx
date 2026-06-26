"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { MenuQrCode } from "@/components/admin/menu-qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QrTabProps {
  publicUrl: string;
  slug: string;
}

export function QrTab({ publicUrl, slug }: QrTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">QR Code</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Compartilhe o link do seu site com clientes.
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

      <MenuQrCode url={publicUrl} slug={slug} />
    </div>
  );
}
