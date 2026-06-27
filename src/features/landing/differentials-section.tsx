import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { LandingPageData } from "@/lib/site/landing-types";

interface DifferentialsSectionProps {
  data: LandingPageData;
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
        <h2
          id="differentials-heading"
          className="landing-heading mb-10 text-center sm:mb-12"
        >
          Por que escolher a gente
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {differentials.map((diff, index) => (
          <ScrollReveal
            key={diff.id}
            delay={index * 80}
            as="article"
            className="menu-card flex h-full min-h-[220px] flex-col items-center gap-4 p-6 text-center sm:items-start sm:p-8 sm:text-left"
          >
            {diff.icon && (
              <span className="text-4xl leading-none" role="img" aria-hidden>
                {diff.icon}
              </span>
            )}
            <h3 className="text-lg font-semibold text-[var(--menu-secondary)] sm:text-xl">
              {diff.title}
            </h3>
            {diff.description && (
              <p className="flex-1 text-sm leading-relaxed text-[#666] sm:text-base">
                {diff.description}
              </p>
            )}
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
