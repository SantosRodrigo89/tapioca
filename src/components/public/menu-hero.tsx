import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { formatWhatsAppLink } from "@/lib/utils";
import type { Tenant } from "@/types";

interface MenuHeroProps {
  tenant: Tenant;
}

export function MenuHero({ tenant }: MenuHeroProps) {
  const isOpen = tenant.status === "trial" || tenant.status === "active";
  const coverImage = tenant.logoUrl;

  return (
    <header className="relative">
      {/* Cover banner */}
      <div className="relative h-[240px] w-full overflow-hidden sm:h-[280px] md:h-[300px]">
        {coverImage ? (
          <Image
            src={coverImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover scale-105"
            aria-hidden
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, var(--menu-primary) 0%, #e8a234 50%, var(--menu-secondary) 100%)`,
            }}
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* Profile card overlapping banner */}
      <div className="relative mx-auto max-w-3xl px-4">
        <div className="-mt-14 flex flex-col gap-4 sm:-mt-16">
          <div className="flex items-end gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg sm:h-28 sm:w-28">
              {tenant.logoUrl ? (
                <Image
                  src={tenant.logoUrl}
                  alt={`Logo ${tenant.name}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--menu-secondary)]"
                  style={{ background: "var(--menu-primary)" }}
                >
                  {tenant.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="mb-1 flex flex-1 flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: isOpen
                    ? "color-mix(in srgb, var(--menu-success) 15%, white)"
                    : "color-mix(in srgb, var(--menu-danger) 15%, white)",
                  color: isOpen ? "var(--menu-success)" : "var(--menu-danger)",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: isOpen
                      ? "var(--menu-success)"
                      : "var(--menu-danger)",
                  }}
                />
                {isOpen ? "Aberto agora" : "Fechado"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[var(--menu-secondary)] sm:text-[32px]">
              {tenant.name}
            </h1>
            {tenant.description && (
              <p className="max-w-xl text-sm leading-relaxed text-[#666]">
                {tenant.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm text-[#666]">
            {tenant.address && (
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--menu-primary)]" />
                <span>{tenant.address}</span>
              </p>
            )}
            {tenant.whatsapp && (
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-[var(--menu-primary)]" />
                <span>Horário: consulte pelo WhatsApp</span>
              </p>
            )}
          </div>

          {tenant.whatsapp && (
            <Link
              href={formatWhatsAppLink(tenant.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-[var(--menu-secondary)] shadow-md transition-transform active:scale-[0.98] sm:w-auto"
              style={{ backgroundColor: "var(--menu-primary)" }}
            >
              <MessageCircle className="h-5 w-5" />
              Pedir pelo WhatsApp
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
