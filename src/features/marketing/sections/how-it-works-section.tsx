import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { MARKETING_STEPS } from "@/features/marketing/marketing-content";

export function MarketingHowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Como funciona"
            title="Do cadastro ao QR Code em cinco passos"
            description="Um fluxo pensado para quem gerencia restaurante — simples, direto e sem curva de aprendizado."
          />
        </ScrollReveal>

        <ol className="relative mt-14 space-y-0">
          {MARKETING_STEPS.map((step, index) => (
            <ScrollReveal key={step.step} delay={index * 60}>
              <li className="relative flex gap-5 pb-10 last:pb-0 sm:gap-8">
                {index < MARKETING_STEPS.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute left-[1.125rem] top-10 h-[calc(100%-1.5rem)] w-px bg-border sm:left-5"
                  />
                ) : null}

                <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary sm:size-10">
                  {step.step}
                </span>

                <div className="space-y-1 pt-0.5">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {step.description}
                  </p>
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
