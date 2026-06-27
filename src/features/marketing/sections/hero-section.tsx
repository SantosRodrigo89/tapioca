import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroMockups } from "@/features/marketing/components/product-mockups";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { getDemoMailtoUrl } from "@/features/marketing/marketing-content";

export function MarketingHeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(244,180,0,0.12),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <ScrollReveal className="space-y-8 text-center lg:text-left">
          <div className="space-y-5">
            <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-[#18181B]">
              Plataforma SaaS para restaurantes
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              A presença digital completa para restaurantes.
            </h1>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Crie um site profissional, organize seu cardápio digital,
              compartilhe por QR Code e fortaleça sua marca em poucos minutos.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <a href={getDemoMailtoUrl()}>
                Solicitar demonstração
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/auth/login">Entrar</Link>
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <HeroMockups className="lg:pl-4" />
        </ScrollReveal>
      </div>
    </section>
  );
}
