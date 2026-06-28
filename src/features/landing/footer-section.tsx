import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LandingButton } from "@/components/public/landing";
import { SafeExternalLink } from "@/components/public/safe-external-link";
import { BRAND_TAGLINE } from "@/lib/brand";
import { formatWhatsAppLink } from "@/lib/utils";
import { sectionLayoutProps } from "@/lib/site/section-layout-props";
import type { LandingPageData } from "@/lib/site/landing-types";

interface FooterSectionProps {
  data: LandingPageData;
  variant?: string;
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
    <SafeExternalLink href={href} ariaLabel={label} className="landing-footer__social">
      {children}
    </SafeExternalLink>
  );
}

export function FooterSection({ data, variant = "full" }: FooterSectionProps) {
  const { tenant, siteConfig } = data;
  const contact = siteConfig.contact;
  const whatsapp = contact.whatsapp ?? data.whatsapp;
  const tagline =
    siteConfig.hero.subtitle ??
    tenant.description?.slice(0, 100) ??
    null;

  const hasAbout =
    siteConfig.about.description || siteConfig.about.imageUrl;
  const hasGallery = data.gallery.length > 0;
  const hasContact =
    contact.whatsapp ||
    contact.phone ||
    contact.email ||
    siteConfig.location.address ||
    tenant.address;

  const location = siteConfig.location;
  const hasLocation =
    location.address ||
    tenant.address ||
    location.directionsUrl ||
    (location.lat != null && location.lng != null);

  const anchorLinks = [
    { href: "#cardapio", label: "Cardápio" },
    ...(hasAbout ? [{ href: "#sobre", label: "Sobre" }] : []),
    ...(data.highlights.length > 0
      ? [{ href: "#destaques", label: "Destaques" }]
      : []),
    ...(hasGallery ? [{ href: "#galeria", label: "Galeria" }] : []),
    ...(hasContact ? [{ href: "#contato", label: "Contato" }] : []),
    ...(hasLocation ? [{ href: "#localizacao", label: "Localização" }] : []),
  ];

  return (
    <footer className="landing-footer" {...sectionLayoutProps("footer", variant)}>
      <div className="landing-container landing-footer__inner">
        <div className="landing-footer__brand">
          {tenant.logoUrl ? (
            <div className="landing-footer__logo">
              <Image
                src={tenant.logoUrl}
                alt={`Logo ${tenant.name}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="landing-footer__logo landing-footer__logo--fallback"
              aria-hidden
            >
              {tenant.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="landing-footer__identity">
            <p className="landing-footer__name">{tenant.name}</p>
            {tagline && <p className="landing-footer__tagline">{tagline}</p>}
          </div>
        </div>

        <div className="landing-footer__middle">
          {anchorLinks.length > 0 && (
            <nav aria-label="Links do site" className="landing-footer__nav">
              {anchorLinks.map((link) => (
                <Link key={link.href} href={link.href} className="landing-footer__nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {(contact.instagram || contact.facebook || contact.tiktok) && (
            <div className="landing-footer__socials">
              {contact.instagram && (
                <FooterSocialLink href={contact.instagram} label="Instagram">
                  <svg
                    className="h-5 w-5"
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
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </FooterSocialLink>
              )}
              {contact.tiktok && (
                <FooterSocialLink href={contact.tiktok} label="TikTok">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                  </svg>
                </FooterSocialLink>
              )}
            </div>
          )}
        </div>

        {whatsapp && (
          <div className="landing-footer__cta">
            <LandingButton
              href={formatWhatsAppLink(whatsapp)}
              variant="primary"
              size="md"
              icon={<MessageCircle className="h-4 w-4 shrink-0" aria-hidden />}
              className="landing-footer__whatsapp w-full sm:w-auto"
              ariaLabel="Pedir pelo WhatsApp"
            >
              WhatsApp
            </LandingButton>
          </div>
        )}

        <div className="landing-footer__bottom">
          <p className="landing-footer__copyright">
            © {new Date().getFullYear()} {tenant.name}. Todos os direitos reservados.
          </p>
          <div className="landing-footer__mesio">
            <span>Feito com</span>
            <Logo size="xs" href="/" showWordmark={false} className="opacity-70" />
            <span>{BRAND_TAGLINE}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
