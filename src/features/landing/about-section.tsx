import Image from "next/image";
import { LandingHeading } from "@/components/public/landing";
import { ReadMoreText } from "@/components/public/read-more-text";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { resolveSectionCopy } from "@/lib/site/section-copy";
import { sectionLayoutProps } from "@/lib/site/section-layout-props";
import type { LandingPageData } from "@/lib/site/landing-types";

interface AboutSectionProps {
  data: LandingPageData;
  variant?: string;
}

export function AboutSection({ data, variant = "editorial" }: AboutSectionProps) {
  const about = data.siteConfig.about;
  const copy = resolveSectionCopy(data.siteConfig.sectionCopy).about;
  const title = about.title ?? "Sobre nós";
  const description = about.description;
  const hasImage = !!about.imageUrl;

  if (!description && !hasImage) return null;

  return (
    <section
      aria-labelledby="about-heading"
      id="sobre"
      className="landing-section"
      {...sectionLayoutProps("about", variant)}
    >
      <ScrollReveal>
        <LandingHeading
          title={title}
          titleId="about-heading"
          eyebrow={copy.eyebrow}
        />
      </ScrollReveal>

      <div
        className={`about-editorial mt-10 sm:mt-12 ${hasImage ? "about-editorial--with-image" : ""}`}
      >
        {hasImage && (
          <ScrollReveal className="about-editorial__media" delay={100}>
            <div className="about-editorial__image-wrap">
              <Image
                src={about.imageUrl!}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        )}

        {description && (
          <ScrollReveal className="about-editorial__content" delay={200}>
            <ReadMoreText text={description} maxLines={6} mobileOnly />
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
