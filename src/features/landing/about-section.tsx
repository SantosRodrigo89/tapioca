import Image from "next/image";
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
    <section
      aria-labelledby="about-heading"
      className="landing-section menu-animate-in mx-auto max-w-3xl px-4"
    >
      <div className="space-y-6">
        <h2
          id="about-heading"
          className="text-2xl font-semibold text-[var(--menu-secondary)] sm:text-3xl"
        >
          {title}
        </h2>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {about.imageUrl && (
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl sm:w-2/5">
              <Image
                src={about.imageUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover"
              />
            </div>
          )}
          {description && (
            <p className="flex-1 text-base leading-relaxed text-[#666] whitespace-pre-line">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
