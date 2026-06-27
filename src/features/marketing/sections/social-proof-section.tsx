import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { MARKETING_SEGMENTS } from "@/features/marketing/marketing-content";

export function MarketingSocialProofSection() {
  return (
    <section
      id="segmentos"
      className="border-y border-border/60 bg-muted/20 py-10 sm:py-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
            Ideal para
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            {MARKETING_SEGMENTS.map((segment, index) => (
              <li
                key={segment.label}
                className="flex items-center gap-2 text-sm font-medium text-foreground sm:text-base"
              >
                <span aria-hidden className="text-lg">
                  {segment.emoji}
                </span>
                {segment.label}
                {index < MARKETING_SEGMENTS.length - 1 ? (
                  <span
                    aria-hidden
                    className="ml-4 hidden h-4 w-px bg-border sm:inline-block"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
