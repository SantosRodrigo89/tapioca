import Image from "next/image";
import { MapPin, MessageCircle } from "lucide-react";
import { formatWhatsAppLink } from "@/lib/utils";
import type { Tenant } from "@/types";

interface MenuHeaderProps {
  tenant: Tenant;
}

export function MenuHeader({ tenant }: MenuHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-3 text-center py-8 px-4">
      {tenant.logoUrl && (
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-border shadow-sm">
          <Image
            src={tenant.logoUrl}
            alt={`Logo ${tenant.name}`}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      )}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{tenant.name}</h1>
        {tenant.description && (
          <p className="text-sm text-muted-foreground max-w-md">
            {tenant.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 flex-wrap justify-center text-sm text-muted-foreground">
        {tenant.address && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {tenant.address}
          </span>
        )}
        {tenant.whatsapp && (
          <a
            href={formatWhatsAppLink(tenant.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            WhatsApp
          </a>
        )}
      </div>
    </header>
  );
}
