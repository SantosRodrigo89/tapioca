import Image from "next/image";
import { ReadMoreText } from "@/components/public/read-more-text";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { LandingPageData } from "@/lib/site/landing-types";

interface AboutSectionProps {
  data: LandingPageData;
}

export function AboutSection({ data }: AboutSectionProps) {
  const about = data.siteConfig.about;
  const title = about.title ?? "Sobre nós";
  const description = about.description;

  if (!description && !about.imageUrl) return null;

  return (
    <section aria-labelledby="about-heading" id="sobre" className="landing-section">
      <ScrollReveal>
        <h2 id="about-heading" className="landing-heading mb-10 sm:mb-12">
          {title}
        </h2>
      </ScrollReveal>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
        {about.imageUrl && (
          <ScrollReveal className="sm:w-2/5" delay={100}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={about.imageUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        )}
        {description && (
          <ScrollReveal className="flex-1" delay={200}>
            <ReadMoreText text={description} />
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
