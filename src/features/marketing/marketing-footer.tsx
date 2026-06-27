import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { BRAND_TAGLINE } from "@/lib/brand";
import {
  MARKETING_CONTACT_EMAIL,
  MARKETING_FOOTER_LINKS,
  MARKETING_SOCIAL,
} from "@/features/marketing/marketing-content";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo size="sm" href="/" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {BRAND_TAGLINE} Site, cardápio digital e gestão simples para
              restaurantes que querem crescer online.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={MARKETING_SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                aria-label="Instagram da Mesio"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-4 fill-none stroke-current stroke-2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={MARKETING_SOCIAL.linkedin}
                className="inline-flex size-9 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                aria-label="LinkedIn da Mesio (em breve)"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-4 fill-current"
                >
                  <path d="M6.5 8.5h3v10h-3v-10zm1.5-4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zm4 4.5h2.9v1.4h.04c.4-.75 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6v5.55h-3v-4.9c0-1.17-.02-2.68-1.63-2.68-1.63 0-1.88 1.27-1.88 2.58v4.99h-3v-10z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Produto</h3>
            <ul className="mt-3 space-y-2">
              {MARKETING_FOOTER_LINKS.produto.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Empresa</h3>
            <ul className="mt-3 space-y-2">
              {MARKETING_FOOTER_LINKS.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contato</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${MARKETING_CONTACT_EMAIL}`}
                  className="transition-colors hover:text-foreground"
                >
                  {MARKETING_CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Mesio. Todos os direitos reservados.</p>
          <p>Feito para restaurantes brasileiros.</p>
        </div>
      </div>
    </footer>
  );
}
