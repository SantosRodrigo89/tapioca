import { formatWhatsAppLink } from "@/lib/utils";
import { getHeroLocationLabel } from "@/lib/utils/address";
import {
  formatTodayClosingLabel,
  isOpenNow,
} from "@/lib/utils/opening-hours";
import type { LandingPageData } from "@/lib/site/landing-types";
import type { SiteButton } from "@/types/site";
import { sectionLayoutProps } from "@/lib/site/section-layout-props";
import { HeroSectionCompact } from "./hero-section-compact";
import { HeroSectionImmersive } from "./hero-section-immersive";

interface HeroSectionProps {
  data: LandingPageData;
  variant?: string;
}

function resolveHeroButtons(
  configured: SiteButton[],
  whatsapp?: string,
): SiteButton[] {
  const hasMenuButton = configured.some(
    (b) =>
      b.href === "#cardapio" || b.label.toLowerCase().includes("cardápio"),
  );

  const defaults: SiteButton[] = [
    ...(hasMenuButton
      ? []
      : [
          {
            label: "Ver Cardápio",
            href: "#cardapio",
            variant: "outline" as const,
          },
        ]),
    ...(whatsapp
      ? [
          {
            label: "WhatsApp",
            href: formatWhatsAppLink(whatsapp),
            variant: "primary" as const,
          },
        ]
      : []),
  ];

  return configured.length > 0 ? configured : defaults;
}

function mapButtonVariant(
  variant?: SiteButton["variant"],
): "primary" | "secondary" | "hero-outline" {
  if (variant === "secondary") return "secondary";
  if (variant === "outline") return "hero-outline";
  return "primary";
}

export function HeroSection({ data, variant = "immersive" }: HeroSectionProps) {
  const { tenant, siteConfig, whatsapp } = data;
  const hero = siteConfig.hero;

  const coverImage = hero.imageUrl ?? tenant.bannerUrl ?? tenant.logoUrl;
  const title = hero.title ?? tenant.name;
  const subtitle = hero.subtitle ?? tenant.description;
  const specialties = hero.specialties?.filter(Boolean) ?? [];

  const address = siteConfig.location.address ?? tenant.address;
  const locationLabel = getHeroLocationLabel(address);

  const hoursOpen = isOpenNow(tenant.openingHours);
  const isOpen =
    hoursOpen !== null
      ? hoursOpen
      : tenant.status === "trial" || tenant.status === "active";
  const closingLabel = formatTodayClosingLabel(tenant.openingHours);

  const buttons = resolveHeroButtons(hero.buttons ?? [], whatsapp);
  const isCompact = variant === "compact";

  const contentProps = {
    coverImage,
    title,
    subtitle,
    specialties,
    locationLabel,
    closingLabel,
    isOpen,
    buttons,
    mapButtonVariant,
  };

  return (
    <section
      id="landing-hero"
      aria-label="Apresentação"
      className={`landing-hero relative${isCompact ? " landing-hero--compact" : ""}`}
      {...sectionLayoutProps("hero", variant)}
    >
      {isCompact ? (
        <HeroSectionCompact {...contentProps} />
      ) : (
        <HeroSectionImmersive {...contentProps} />
      )}
    </section>
  );
}
