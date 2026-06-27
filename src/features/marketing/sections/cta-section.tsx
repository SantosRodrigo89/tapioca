import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { getDemoMailtoUrl } from "@/features/marketing/marketing-content";

export function MarketingCtaSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background px-6 py-14 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,180,0,0.15),transparent_60%)]"
            />
            <div className="relative mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Seu restaurante merece mais que um cardápio.
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Construa uma presença digital profissional com a Mesio.
              </p>
              <Button size="lg" asChild className="mt-2">
                <a href={getDemoMailtoUrl()}>
                  Solicitar demonstração
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
