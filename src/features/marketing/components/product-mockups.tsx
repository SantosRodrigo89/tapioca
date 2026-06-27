import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  QrCode,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const SCREENSHOTS = {
  landingDesktop: "/marketing/landing-desktop.png",
  landingMobile: "/marketing/landing-mobile.png",
  dashboard: "/marketing/dashboard.png",
} as const;

function BrowserChrome({
  children,
  className,
  url = "mesio.com.br/spetim",
}: {
  children: React.ReactNode;
  className?: string;
  url?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl shadow-black/10",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-3 py-2">
        <span className="size-2 rounded-full bg-red-400/80" />
        <span className="size-2 rounded-full bg-amber-400/80" />
        <span className="size-2 rounded-full bg-emerald-400/80" />
        <span className="ml-2 truncate text-[10px] text-muted-foreground">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

function PhoneChrome({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border-[3px] border-[#18181B]/90 bg-[#18181B] p-1.5 shadow-2xl shadow-black/20",
        className,
      )}
    >
      <div className="absolute left-1/2 top-2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-black/40" />
      <div className="overflow-hidden rounded-[1.35rem] bg-background">{children}</div>
    </div>
  );
}

function Screenshot({
  src,
  alt,
  priority = false,
  className,
  aspectClass = "aspect-[16/10]",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  aspectClass?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden bg-muted", aspectClass, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        className="object-cover object-top"
      />
    </div>
  );
}

function FloatingBadge({
  icon: Icon,
  label,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute flex items-center gap-1.5 rounded-full border border-border/80 bg-background/95 px-2.5 py-1.5 text-[10px] font-medium shadow-lg backdrop-blur-sm sm:text-xs",
        className,
      )}
    >
      <Icon className="size-3 text-primary sm:size-3.5" />
      {label}
    </div>
  );
}

export function HeroMockups({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full max-w-xl lg:max-w-none", className)}>
      <div className="relative pb-8 sm:pb-12">
        <BrowserChrome className="relative z-10" url="mesio.com.br/spetim">
          <Screenshot
            src={SCREENSHOTS.landingDesktop}
            alt="Landing page do restaurante Spetim Churrasco e Cia na Mesio"
            priority
            aspectClass="aspect-[16/9]"
          />
        </BrowserChrome>

        <div className="absolute -bottom-2 -left-4 z-20 w-[42%] sm:-bottom-4 sm:-left-8 sm:w-[44%]">
          <BrowserChrome url="mesio.com.br/dashboard">
            <Screenshot
              src={SCREENSHOTS.dashboard}
              alt="Painel administrativo da Mesio com resumo e ações rápidas"
              aspectClass="aspect-[4/3]"
            />
          </BrowserChrome>
        </div>

        <div className="absolute -right-2 top-10 z-20 w-[30%] sm:-right-6 sm:top-14 sm:w-[32%]">
          <PhoneChrome>
            <Screenshot
              src={SCREENSHOTS.landingMobile}
              alt="Landing page mobile do restaurante Spetim na Mesio"
              aspectClass="aspect-[9/19]"
            />
          </PhoneChrome>
        </div>

        <FloatingBadge
          icon={QrCode}
          label="QR Code"
          className="left-[8%] top-[18%] animate-[float_4s_ease-in-out_infinite] motion-reduce:animate-none"
        />
        <FloatingBadge
          icon={ShoppingBag}
          label="Cardápio"
          className="right-[4%] top-[42%] animate-[float_5s_ease-in-out_infinite_0.5s] motion-reduce:animate-none"
        />
        <FloatingBadge
          icon={LayoutDashboard}
          label="Painel"
          className="bottom-[28%] right-[18%] animate-[float_4.5s_ease-in-out_infinite_1s] motion-reduce:animate-none"
        />
        <FloatingBadge
          icon={Sparkles}
          label="Sua marca"
          className="bottom-[12%] left-[22%] animate-[float_5.5s_ease-in-out_infinite_0.25s] motion-reduce:animate-none"
        />
      </div>
    </div>
  );
}

export function DemoMockups({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12",
        className,
      )}
    >
      <BrowserChrome className="w-full" url="mesio.com.br/dashboard">
        <Screenshot
          src={SCREENSHOTS.dashboard}
          alt="Painel da Mesio — gerencie site, cardápio e presença digital"
          aspectClass="aspect-[16/10]"
        />
      </BrowserChrome>

      <div className="mx-auto w-full max-w-[240px] sm:max-w-[260px]">
        <PhoneChrome>
          <Screenshot
            src={SCREENSHOTS.landingMobile}
            alt="Experiência mobile da landing page na Mesio"
            aspectClass="aspect-[9/19]"
          />
        </PhoneChrome>
      </div>
    </div>
  );
}
