import {
  Award,
  ChefHat,
  Clock3,
  Flame,
  Heart,
  Leaf,
  MapPin,
  Sparkles,
  Star,
  Truck,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { LandingHeading } from "@/components/public/landing";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { LandingPageData } from "@/lib/site/landing-types";

interface DifferentialsSectionProps {
  data: LandingPageData;
}

const ICON_MAP: Record<string, LucideIcon> = {
  star: Star,
  heart: Heart,
  flame: Flame,
  leaf: Leaf,
  clock: Clock3,
  truck: Truck,
  users: Users,
  award: Award,
  chef: ChefHat,
  utensils: UtensilsCrossed,
  map: MapPin,
  sparkles: Sparkles,
};

function DifferentialIcon({ icon }: { icon?: string }) {
  if (!icon) {
    return <Sparkles className="h-6 w-6" aria-hidden />;
  }

  const key = icon.trim().toLowerCase();
  const Lucide = ICON_MAP[key];
  if (Lucide) {
    return <Lucide className="h-6 w-6" aria-hidden />;
  }

  return (
    <span className="text-2xl leading-none" role="img" aria-hidden>
      {icon}
    </span>
  );
}

export function DifferentialsSection({ data }: DifferentialsSectionProps) {
  const differentials = data.siteConfig.differentials;

  if (!differentials || differentials.length === 0) return null;

  return (
    <section
      aria-labelledby="differentials-heading"
      className="landing-section"
    >
      <ScrollReveal>
        <LandingHeading
          align="center"
          title="Por que escolher a gente"
          titleId="differentials-heading"
          subtitle="O que torna nossa experiência especial"
        />
      </ScrollReveal>

      <div className="differentials-grid mt-10 sm:mt-12">
        {differentials.map((diff, index) => (
          <ScrollReveal
            key={diff.id}
            delay={index * 80}
            as="article"
            className="differential-card"
          >
            <div className="differential-card__icon">
              <DifferentialIcon icon={diff.icon} />
            </div>
            <div className="differential-card__content">
              <h3 className="differential-card__title">{diff.title}</h3>
              {diff.description && (
                <p className="differential-card__description">
                  {diff.description}
                </p>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
