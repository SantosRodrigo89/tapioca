"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { formatWhatsAppOrderLink } from "@/lib/utils";
import { getProductShareUrl } from "@/lib/site/product-experience";
import type { MenuItem } from "@/types";
import type { ProductDrawerActionId } from "@/types/site";

interface ProductDrawerActionsProps {
  item: MenuItem;
  tenantSlug: string;
  whatsapp?: string;
  actions: ProductDrawerActionId[];
}

const ACTION_LABELS: Record<ProductDrawerActionId, string> = {
  share: "Compartilhar produto",
  "copy-link": "Copiar link",
  whatsapp: "Falar no WhatsApp",
};

export function ProductDrawerActions({
  item,
  tenantSlug,
  whatsapp,
  actions,
}: ProductDrawerActionsProps) {
  const [copied, setCopied] = useState(false);

  if (actions.length === 0) return null;

  async function handleShare() {
    const url = getProductShareUrl(tenantSlug, item.id);
    const shareData = {
      title: item.name,
      text: item.description ?? item.name,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }

    await handleCopyLink();
  }

  async function handleCopyLink() {
    const url = getProductShareUrl(tenantSlug, item.id);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  }

  function handleWhatsApp() {
    if (!whatsapp) return;
    const message = `Olá! Gostaria de saber mais sobre: ${item.name}`;
    window.open(
      formatWhatsAppOrderLink(whatsapp, message),
      "_blank",
      "noopener",
    );
  }

  function handleAction(action: ProductDrawerActionId) {
    switch (action) {
      case "share":
        void handleShare();
        break;
      case "copy-link":
        void handleCopyLink();
        break;
      case "whatsapp":
        handleWhatsApp();
        break;
    }
  }

  function iconFor(action: ProductDrawerActionId) {
    switch (action) {
      case "share":
        return <Share2 className="h-4 w-4" />;
      case "copy-link":
        return copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        );
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />;
    }
  }

  return (
    <div className="border-t border-[var(--menu-border)] bg-white px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => handleAction(action)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--menu-border)] px-4 py-3 text-sm font-medium text-[var(--menu-secondary)] transition-colors hover:border-[var(--menu-primary)] hover:bg-[var(--menu-primary)]/8 sm:flex-none sm:min-w-[160px]"
          >
            {iconFor(action)}
            {ACTION_LABELS[action]}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Reserved for future commerce actions (quantity, cart, checkout).
 * Mount inside ProductDetailDrawer below institutional actions when ready.
 */
export function ProductDrawerCommerceSlot({
  children,
}: {
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <div className="border-t border-[var(--menu-border)] bg-[var(--menu-surface)] px-5 py-4 sm:px-6">
      {children}
    </div>
  );
}
