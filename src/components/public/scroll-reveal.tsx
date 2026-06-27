"use client";

import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps<T extends ElementType = "div"> = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function ScrollReveal<T extends ElementType = "div">({
  children,
  className,
  delay = 0,
  as,
  ...rest
}: ScrollRevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("scroll-reveal", className)}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
