import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { DemoMockups } from "@/features/marketing/components/product-mockups";

export function MarketingDemoSection() {
  return (
    <section id="demonstracao" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Demonstração"
            title="Veja o produto em ação"
            description="Gerencie site, cardápio e aparência em um painel intuitivo. Seus clientes acessam uma experiência moderna no celular — landing page e cardápio integrados."
          />
        </ScrollReveal>

        <ScrollReveal delay={100} className="mt-14">
          <DemoMockups />
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Atualize banner, categorias, produtos e informações de contato em
            poucos cliques. Tudo reflete na sua página pública em tempo real —
            sem depender de designer ou desenvolvedor.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
