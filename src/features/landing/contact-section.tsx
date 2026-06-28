"use client";

import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { LandingButton, LandingHeading } from "@/components/public/landing";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { SafeExternalLink } from "@/components/public/safe-external-link";
import { formatPhoneNumber, formatWhatsAppLink } from "@/lib/utils";
import {
  formatDaySchedule,
  getCurrentWeekdayInBrazil,
  isOpenNow,
} from "@/lib/utils/opening-hours";
import { cn } from "@/lib/utils";
import type { LandingPageData } from "@/lib/site/landing-types";

interface ContactSectionProps {
  data: LandingPageData;
}

function InstagramIcon() {
  return (
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
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function ContactSocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <SafeExternalLink
      href={href}
      ariaLabel={label}
      className="contact-social-link"
    >
      {children}
    </SafeExternalLink>
  );
}

function ContactChannelLink({
  href,
  icon,
  label,
  sublabel,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="contact-channel"
    >
      <span className="contact-channel__icon">{icon}</span>
      <span className="contact-channel__text">
        <span className="contact-channel__label">{label}</span>
        {sublabel && (
          <span className="contact-channel__sublabel">{sublabel}</span>
        )}
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
  const todayKey = getCurrentWeekdayInBrazil();
  const hoursOpen = isOpenNow(openingHours);

  const hasSocial =
    contact.instagram || contact.facebook || contact.tiktok;

  const hasContact =
    whatsapp ||
    contact.phone ||
    contact.email ||
    hasSocial ||
    address ||
    openingHours;

  if (!hasContact) return null;

  const channels = [
    contact.phone && {
      href: `tel:${contact.phone.replace(/\D/g, "")}`,
      icon: <Phone className="h-5 w-5" />,
      label: "Telefone",
      sublabel: formatPhoneNumber(contact.phone),
    },
    contact.email && {
      href: `mailto:${contact.email}`,
      icon: <Mail className="h-5 w-5" />,
      label: "E-mail",
      sublabel: contact.email,
    },
  ].filter(Boolean) as Array<{
    href: string;
    icon: React.ReactNode;
    label: string;
    sublabel: string;
  }>;

  return (
    <section
      aria-labelledby="contact-heading"
      id="contato"
      className="landing-section"
    >
      <ScrollReveal>
        <LandingHeading
          align="center"
          title="Contato"
          titleId="contact-heading"
          subtitle="Estamos prontos para atender você"
        />
      </ScrollReveal>

      {whatsapp && (
        <ScrollReveal className="mt-8 sm:mt-10" delay={50}>
          <div className="contact-cta">
            <div className="contact-cta__copy">
              <p className="contact-cta__eyebrow">Peça agora</p>
              <h3 className="contact-cta__title">Faça seu pedido pelo WhatsApp</h3>
              <p className="contact-cta__subtitle">
                Resposta rápida e atendimento personalizado
              </p>
            </div>
            <LandingButton
              href={formatWhatsAppLink(whatsapp)}
              variant="primary"
              size="lg"
              icon={<MessageCircle className="h-5 w-5 shrink-0" aria-hidden />}
              className="contact-cta__button w-full sm:w-auto"
              ariaLabel="Pedir pelo WhatsApp"
            >
              Pedir pelo WhatsApp
            </LandingButton>
          </div>
        </ScrollReveal>
      )}

      <div className="contact-grid mt-8 sm:mt-10">
        {(channels.length > 0 || hasSocial) && (
          <ScrollReveal className="contact-grid__channels" delay={100}>
            {channels.length > 0 && (
              <div className="contact-channels">
                {channels.map((channel) => (
                  <ContactChannelLink
                    key={channel.href}
                    href={channel.href}
                    icon={channel.icon}
                    label={channel.label}
                    sublabel={channel.sublabel}
                  />
                ))}
              </div>
            )}

            {hasSocial && (
              <div className="contact-social">
                <p className="contact-social__label">Redes sociais</p>
                <div className="contact-social__links">
                  {contact.instagram && (
                    <ContactSocialLink
                      href={contact.instagram}
                      label="Instagram"
                    >
                      <InstagramIcon />
                    </ContactSocialLink>
                  )}
                  {contact.facebook && (
                    <ContactSocialLink href={contact.facebook} label="Facebook">
                      <FacebookIcon />
                    </ContactSocialLink>
                  )}
                  {contact.tiktok && (
                    <ContactSocialLink href={contact.tiktok} label="TikTok">
                      <TikTokIcon />
                    </ContactSocialLink>
                  )}
                </div>
              </div>
            )}
          </ScrollReveal>
        )}

        {(address || openingHours) && (
          <ScrollReveal className="contact-grid__info" delay={150}>
            <div className="contact-info-card">
              {address && (
                <div className="contact-info-block">
                  <MapPin
                    className="contact-info-block__icon"
                    aria-hidden
                  />
                  <div>
                    <p className="contact-info-block__title">Endereço</p>
                    <p className="contact-info-block__text">{address}</p>
                  </div>
                </div>
              )}

              {openingHours && openingHours.length > 0 && (
                <div className="contact-info-block">
                  <Clock className="contact-info-block__icon" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="contact-hours__header">
                      <p className="contact-info-block__title">
                        Horários de funcionamento
                      </p>
                      {hoursOpen !== null && (
                        <span
                          className={cn(
                            "contact-hours__status",
                            hoursOpen
                              ? "contact-hours__status--open"
                              : "contact-hours__status--closed",
                          )}
                        >
                          {hoursOpen ? "Aberto agora" : "Fechado agora"}
                        </span>
                      )}
                    </div>
                    <ul className="contact-hours__list">
                      {openingHours.map((day) => (
                        <li
                          key={day.day}
                          className={cn(
                            "contact-hours__row",
                            day.day === todayKey &&
                              "contact-hours__row--today",
                          )}
                        >
                          {formatDaySchedule(day)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
