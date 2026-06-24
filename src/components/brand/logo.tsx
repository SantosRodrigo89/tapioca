import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/brand/logo.png";

const sizeClasses = {
  xs: "h-7",
  sm: "h-9",
  md: "h-14",
  lg: "h-32",
} as const;

interface LogoProps {
  size?: keyof typeof sizeClasses;
  href?: string;
  className?: string;
  priority?: boolean;
}

export function Logo({
  size = "md",
  href,
  className,
  priority,
}: LogoProps) {
  const image = (
    <Image
      src={logoImage}
      alt="Tapioca — Cardápio Digital"
      priority={priority}
      className={cn("w-auto object-contain", sizeClasses[size], className)}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0">
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0">{image}</span>;
}
