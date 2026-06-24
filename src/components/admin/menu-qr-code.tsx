"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuQrCodeProps {
  url: string;
  slug: string;
}

export function MenuQrCode({ url, slug }: MenuQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;
    setError(false);

    QRCode.toDataURL(url, { width: 256, margin: 2, errorCorrectionLevel: "M" })
      .then((result) => {
        if (!cancelled) setDataUrl(result);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  const handleDownload = () => {
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `cardapio-${slug}.png`;
    link.click();
  };

  if (!url) return null;

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <div className="rounded-lg border bg-white p-3">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="QR Code do cardápio"
            width={256}
            height={256}
            className="size-48"
          />
        ) : error ? (
          <div className="flex size-48 items-center justify-center text-center text-xs text-muted-foreground">
            Não foi possível gerar o QR Code
          </div>
        ) : (
          <div className="size-48 animate-pulse rounded bg-muted" />
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Escaneie ou imprima para disponibilizar o cardápio na mesa.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={!dataUrl}
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar QR Code
        </Button>
      </div>
    </div>
  );
}
