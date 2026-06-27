import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import {
  getDemoMailtoUrl,
  MARKETING_CONTACT_EMAIL,
} from "@/features/marketing/marketing-content";

export function MarketingPricingSection() {
  return (
    <section id="precos" className="border-y border-border/60 bg-muted/20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Preços"
            title="Planos sob medida para o seu restaurante"
            description="Estamos finalizando nossos planos. Entre em contato para conhecer condições e solicitar uma demonstração personalizada."
          />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="mx-auto mt-10 max-w-md rounded-xl border border-dashed border-border bg-background p-8 text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Em breve
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight">
              Planos flexíveis
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Período de teste e opções pensadas para diferentes portes de
              restaurante.
            </p>
            <Button className="mt-6" asChild>
              <a href={getDemoMailtoUrl()}>Falar com a equipe</a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function MarketingContactSection() {
  return (
    <section id="contato" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Contato"
            title="Vamos conversar sobre o seu restaurante"
            description="Solicite uma demonstração e descubra como a Mesio pode fortalecer sua presença digital."
          />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="mx-auto mt-10 flex max-w-lg flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <a href={getDemoMailtoUrl()}>
                <MessageCircle className="size-4" />
                Solicitar demonstração
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <a href={`mailto:${MARKETING_CONTACT_EMAIL}`}>
                <Mail className="size-4" />
                {MARKETING_CONTACT_EMAIL}
              </a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
