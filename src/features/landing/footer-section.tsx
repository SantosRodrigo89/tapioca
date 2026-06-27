import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { BRAND_TAGLINE } from "@/lib/brand";
import type { LandingPageData } from "@/lib/site/landing-types";

interface FooterSectionProps {
  data: LandingPageData;
}

function FooterSocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#999] transition-colors hover:bg-[var(--menu-surface)] hover:text-[var(--menu-secondary)]"
    >
      {children}
    </Link>
  );
}

export function FooterSection({ data }: FooterSectionProps) {
  const { tenant, siteConfig } = data;
  const contact = siteConfig.contact;
  const tagline =
    siteConfig.hero.subtitle ??
    tenant.description?.slice(0, 80) ??
    null;

  const hasAbout =
    siteConfig.about.description || siteConfig.about.imageUrl;
  const hasContact =
    contact.whatsapp ||
    contact.phone ||
    contact.email ||
    siteConfig.location.address ||
    tenant.address;

  const anchorLinks = [
    { href: "#cardapio", label: "Cardápio" },
    ...(hasAbout ? [{ href: "#sobre", label: "Sobre" }] : []),
    ...(hasContact ? [{ href: "#contato", label: "Contato" }] : []),
  ];

  return (
    <footer className="border-t border-[var(--menu-border)] bg-[var(--menu-surface)]">
      <div className="landing-container py-12 sm:py-16">
        {/* Top: brand identity */}
        <div className="flex flex-col items-center gap-4 text-center">
          {tenant.logoUrl ? (
            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[var(--menu-border)] bg-white shadow-sm">
              <Image
                src={tenant.logoUrl}
                alt={`Logo ${tenant.name}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-[var(--menu-secondary)] shadow-sm"
              style={{ background: "var(--menu-primary)" }}
            >
              {tenant.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <p className="text-lg font-semibold text-[var(--menu-secondary)]">
              {tenant.name}
            </p>
            {tagline && (
              <p className="max-w-sm text-sm text-[#888]">{tagline}</p>
            )}
          </div>
        </div>

        {/* Middle: nav + social */}
        <div className="mt-8 flex flex-col items-center gap-6">
          {anchorLinks.length > 0 && (
            <nav aria-label="Links do site" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {anchorLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#666] transition-colors hover:text-[var(--menu-secondary)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {(contact.instagram || contact.facebook || contact.tiktok) && (
            <div className="flex gap-2">
              {contact.instagram && (
                <FooterSocialLink href={contact.instagram} label="Instagram">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  </svg>
                </FooterSocialLink>
              )}
              {contact.facebook && (
                <FooterSocialLink href={contact.facebook} label="Facebook">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </FooterSocialLink>
              )}
              {contact.tiktok && (
                <FooterSocialLink href={contact.tiktok} label="TikTok">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                  </svg>
                </FooterSocialLink>
              )}
            </div>
          )}
        </div>

        {/* Bottom: copyright */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-[var(--menu-border)] pt-8 text-center">
          <p className="text-xs text-[#999]">
            © {new Date().getFullYear()} {tenant.name}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#bbb]">
            <span>Feito com</span>
            <Logo size="xs" href="/" showWordmark={false} className="opacity-60" />
            <span>{BRAND_TAGLINE}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
