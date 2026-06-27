import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { MARKETING_FEATURES } from "@/features/marketing/marketing-content";

export function MarketingFeaturesSection() {
  return (
    <section id="recursos" className="bg-muted/20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Recursos"
            title="Tudo que seu restaurante precisa online"
            description="Funcionalidades pensadas para fortalecer sua presença digital — do site ao cardápio, da galeria ao painel de gestão."
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MARKETING_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} delay={(index % 3) * 50}>
                <article
                  className={cn(
                    "group relative h-full rounded-xl border border-border/60 bg-background p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                    feature.comingSoon && "opacity-90",
                  )}
                >
                  <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <Icon className="size-5" />
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-semibold tracking-tight">{feature.title}</h3>
                    {feature.comingSoon ? (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Em breve
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
