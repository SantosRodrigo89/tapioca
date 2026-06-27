import { MarketingFooter } from "@/features/marketing/marketing-footer";
import { MarketingHeader } from "@/features/marketing/marketing-header";
import { MarketingBenefitsSection } from "@/features/marketing/sections/benefits-section";
import { MarketingComparisonSection } from "@/features/marketing/sections/comparison-section";
import {
  MarketingContactSection,
  MarketingPricingSection,
} from "@/features/marketing/sections/contact-section";
import { MarketingCtaSection } from "@/features/marketing/sections/cta-section";
import { MarketingDemoSection } from "@/features/marketing/sections/demo-section";
import { MarketingFeaturesSection } from "@/features/marketing/sections/features-section";
import { MarketingHeroSection } from "@/features/marketing/sections/hero-section";
import { MarketingHowItWorksSection } from "@/features/marketing/sections/how-it-works-section";
import { MarketingSocialProofSection } from "@/features/marketing/sections/social-proof-section";

export function MarketingPage() {
  return (
    <>
      <MarketingHeader />
      <main>
        <MarketingHeroSection />
        <MarketingSocialProofSection />
        <MarketingHowItWorksSection />
        <MarketingFeaturesSection />
        <MarketingDemoSection />
        <MarketingBenefitsSection />
        <MarketingComparisonSection />
        <MarketingPricingSection />
        <MarketingCtaSection />
        <MarketingContactSection />
      </main>
      <MarketingFooter />
    </>
  );
}
