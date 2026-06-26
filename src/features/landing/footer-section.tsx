import { Logo } from "@/components/brand/logo";
import { BRAND_TAGLINE } from "@/lib/brand";
import type { LandingPageData } from "@/lib/site/landing-types";

interface FooterSectionProps {
  data: LandingPageData;
}

export function FooterSection({ data }: FooterSectionProps) {
  return (
    <footer className="border-t border-[var(--menu-border)] bg-[var(--menu-surface)] py-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 text-center">
        <p className="text-sm font-medium text-[var(--menu-secondary)]">
          {data.tenant.name}
        </p>
        <Logo size="xs" href="/" showWordmark={false} className="opacity-70" />
        <p className="text-xs text-[#999]">{BRAND_TAGLINE}</p>
      </div>
    </footer>
  );
}
