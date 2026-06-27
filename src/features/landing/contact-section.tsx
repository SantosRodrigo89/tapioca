import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { formatPhoneNumber, formatWhatsAppLink } from "@/lib/utils";
import { formatDaySchedule } from "@/lib/utils/opening-hours";
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
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--menu-border)] text-[var(--menu-secondary)] transition-all hover:border-[var(--menu-primary)] hover:bg-[var(--menu-primary)]/10 hover:text-[var(--menu-primary-dark)]"
    >
      {children}
    </Link>
  );
}

function ContactChannel({
  href,
  icon,
  label,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="menu-card flex items-center gap-4 p-4 transition-all hover:scale-[1.01] sm:p-5"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--menu-primary)]/15 text-[var(--menu-primary-dark)]">
        {icon}
      </span>
      <span className="text-sm font-medium text-[var(--menu-secondary)] sm:text-base">
        {label}
      </span>
    </Link>
  );
}

export function ContactSection({ data }: ContactSectionProps) {
  const contact = data.siteConfig.contact;
  const location = data.siteConfig.location;
  const whatsapp = contact.whatsapp ?? data.whatsapp;
  const address = location.address ?? data.tenant.address;
  const openingHours = data.tenant.openingHours;

  const hasContact =
    whatsapp ||
    contact.phone ||
    contact.email ||
    contact.instagram ||
    contact.facebook ||
    contact.tiktok ||
    address ||
    openingHours;

  if (!hasContact) return null;

  return (
    <section
      aria-labelledby="contact-heading"
      id="contato"
      className="landing-section"
    >
      <ScrollReveal>
        <h2 id="contact-heading" className="landing-heading mb-10 sm:mb-12">
          Contato
        </h2>
      </ScrollReveal>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Channels */}
        <ScrollReveal className="space-y-3" delay={100}>
          {whatsapp && (
            <ContactChannel
              href={formatWhatsAppLink(whatsapp)}
              icon={<MessageCircle className="h-5 w-5" />}
              label={formatPhoneNumber(whatsapp)}
              external
            />
          )}
          {contact.phone && (
            <ContactChannel
              href={`tel:${contact.phone.replace(/\D/g, "")}`}
              icon={<Phone className="h-5 w-5" />}
              label={formatPhoneNumber(contact.phone)}
            />
          )}
          {contact.email && (
            <ContactChannel
              href={`mailto:${contact.email}`}
              icon={<Mail className="h-5 w-5" />}
              label={contact.email}
            />
          )}
          {contact.instagram && (
            <ContactChannel
              href={contact.instagram}
              icon={
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
              }
              label="Instagram"
              external
            />
          )}

          {(contact.facebook || contact.tiktok) && (
            <div className="flex gap-3 pt-2">
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
        </ScrollReveal>

        {/* Address & hours */}
        <ScrollReveal delay={200}>
          <div className="menu-card space-y-6 p-6 sm:p-8">
            {address && (
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--menu-primary-dark)]" />
                <p className="text-sm leading-relaxed text-[#666] sm:text-base">
                  {address}
                </p>
              </div>
            )}

            {openingHours && openingHours.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--menu-secondary)] sm:text-base">
                  <Clock className="h-5 w-5 text-[var(--menu-primary-dark)]" />
                  Horários de funcionamento
                </div>
                <ul className="space-y-1.5 pl-7">
                  {openingHours.map((day) => (
                    <li
                      key={day.day}
                      className="text-sm text-[#666] sm:text-base"
                    >
                      {formatDaySchedule(day)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
