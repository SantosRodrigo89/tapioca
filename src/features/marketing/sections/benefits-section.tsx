import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { MARKETING_BENEFITS } from "@/features/marketing/marketing-content";

export function MarketingBenefitsSection() {
  return (
    <section className="bg-[#18181B] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Benefícios"
            title="Resultados que importam para o seu negócio"
            description="Não falamos só de funcionalidades — falamos do impacto na percepção dos clientes e na operação do seu restaurante."
            className="[&_h2]:text-white [&_p]:text-white/70 [&_.text-primary]:text-primary"
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MARKETING_BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <ScrollReveal key={benefit.title} delay={(index % 3) * 50}>
                <article className="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-primary/30 hover:bg-white/[0.07]">
                  <Icon className="mb-4 size-6 text-primary" />
                  <h3 className="font-semibold tracking-tight">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {benefit.description}
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
