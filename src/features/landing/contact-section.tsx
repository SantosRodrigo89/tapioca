import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { formatWhatsAppLink } from "@/lib/utils";
import type { LandingPageData } from "@/lib/site/landing-types";

interface ContactSectionProps {
  data: LandingPageData;
}

function SocialLink({
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--menu-border)] text-[var(--menu-secondary)] transition-colors hover:border-[var(--menu-primary)] hover:text-[var(--menu-primary)]"
    >
      {children}
    </Link>
  );
}

export function ContactSection({ data }: ContactSectionProps) {
  const contact = data.siteConfig.contact;
  const location = data.siteConfig.location;
  const whatsapp = contact.whatsapp ?? data.whatsapp;
  const address = location.address ?? data.tenant.address;

  const hasContact =
    whatsapp ||
    contact.phone ||
    contact.email ||
    contact.instagram ||
    contact.facebook ||
    contact.tiktok ||
    address;

  if (!hasContact) return null;

  return (
    <section
      aria-labelledby="contact-heading"
      className="landing-section menu-animate-in mx-auto max-w-3xl px-4"
    >
      <h2
        id="contact-heading"
        className="mb-8 text-2xl font-semibold text-[var(--menu-secondary)] sm:text-3xl"
      >
        Contato
      </h2>

      <div className="menu-card space-y-6 p-6">
        <div className="flex flex-col gap-4">
          {whatsapp && (
            <Link
              href={formatWhatsAppLink(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm font-medium text-[var(--menu-secondary)] hover:text-[var(--menu-primary)]"
            >
              <MessageCircle className="h-5 w-5 shrink-0 text-[var(--menu-primary)]" />
              {whatsapp}
            </Link>
          )}
          {contact.phone && (
            <Link
              href={`tel:${contact.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-3 text-sm font-medium text-[var(--menu-secondary)] hover:text-[var(--menu-primary)]"
            >
              <Phone className="h-5 w-5 shrink-0 text-[var(--menu-primary)]" />
              {contact.phone}
            </Link>
          )}
          {contact.email && (
            <Link
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-3 text-sm font-medium text-[var(--menu-secondary)] hover:text-[var(--menu-primary)]"
            >
              <Mail className="h-5 w-5 shrink-0 text-[var(--menu-primary)]" />
              {contact.email}
            </Link>
          )}
          {address && (
            <p className="text-sm leading-relaxed text-[#666]">{address}</p>
          )}
        </div>

        {(contact.instagram || contact.facebook || contact.tiktok) && (
          <div className="flex gap-3 pt-2">
            {contact.instagram && (
              <SocialLink href={contact.instagram} label="Instagram">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </SocialLink>
            )}
            {contact.facebook && (
              <SocialLink href={contact.facebook} label="Facebook">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialLink>
            )}
            {contact.tiktok && (
              <SocialLink href={contact.tiktok} label="TikTok">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                </svg>
              </SocialLink>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
