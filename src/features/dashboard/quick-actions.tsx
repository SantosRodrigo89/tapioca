"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ExternalLink,
  Copy,
  Check,
  Globe,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuQrCode } from "@/components/admin/menu-qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuickActionsProps {
  publicUrl: string;
  slug: string;
}

export function QuickActions({ publicUrl, slug }: QuickActionsProps) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Link copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">Ações rápidas</h2>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={publicUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir site
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => setQrOpen(true)}>
          <QrCode className="mr-2 h-4 w-4" />
          Compartilhar QR Code
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-600" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          Copiar link
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/site">
            <Globe className="mr-2 h-4 w-4" />
            Editar landing page
          </Link>
        </Button>
      </div>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code do seu site</DialogTitle>
          </DialogHeader>
          <MenuQrCode url={publicUrl} slug={slug} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
