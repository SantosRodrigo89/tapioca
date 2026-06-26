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
      className="landing-section menu-animate-in mx-auto max-w-4xl px-4"
    >
      <h2
        id="differentials-heading"
        className="mb-8 text-center text-2xl font-semibold text-[var(--menu-secondary)] sm:text-3xl"
      >
        Por que escolher a gente
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {differentials.map((diff) => (
          <article
            key={diff.id}
            className="menu-card space-y-3 p-5 text-center sm:text-left"
          >
            {diff.icon && (
              <span className="text-3xl" role="img" aria-hidden>
                {diff.icon}
              </span>
            )}
            <h3 className="text-lg font-semibold text-[var(--menu-secondary)]">
              {diff.title}
            </h3>
            {diff.description && (
              <p className="text-sm leading-relaxed text-[#666]">
                {diff.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
