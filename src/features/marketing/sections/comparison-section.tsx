import { Check, X } from "lucide-react";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { MARKETING_COMPARISON } from "@/features/marketing/marketing-content";

export function MarketingComparisonSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Comparação"
            title="O que muda quando você usa a Mesio"
            description="Veja a diferença entre improvisar sua presença online e ter uma plataforma feita para restaurantes."
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <ScrollReveal delay={0}>
            <article className="h-full rounded-xl border border-border/60 bg-muted/30 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-muted-foreground">
                Sem Mesio
              </h3>
              <ul className="mt-6 space-y-4">
                {MARKETING_COMPARISON.without.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm sm:text-base">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                      <X className="size-3 text-muted-foreground" />
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <article className="relative h-full overflow-hidden rounded-xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl"
              />
              <h3 className="relative text-lg font-semibold">Com Mesio</h3>
              <ul className="relative mt-6 space-y-4">
                {MARKETING_COMPARISON.with.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm sm:text-base">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <Check className="size-3 text-primary" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
