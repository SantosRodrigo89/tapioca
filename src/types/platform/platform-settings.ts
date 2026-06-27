export interface PlatformSettings {
  platformName: string;
  logoUrl?: string;
  contactEmail: string;
  domain: string;
  supportUrl?: string;
  theme?: { primaryColor?: string };
  timezone: string;
  defaultPlanId: string;
  trialDays: number;
  inviteExpiryDays: number;
  updatedAt: Date;
}
