import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingTask } from "@/services/onboarding.service";

interface OnboardingCardsProps {
  tasks: OnboardingTask[];
}

export function OnboardingCards({ tasks }: OnboardingCardsProps) {
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Continue configurando seu restaurante
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {completedCount} de {tasks.length} concluídos
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={task.href}
            className={cn(
              "group flex items-start gap-3 rounded-xl border p-4 transition-colors",
              task.completed
                ? "border-border/60 bg-muted/20"
                : "border-border hover:border-primary/30 hover:bg-accent/30",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                task.completed
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {task.completed ? (
                <Check className="h-3 w-3" />
              ) : (
                <Circle className="h-3 w-3" />
              )}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                task.completed && "text-muted-foreground",
              )}
            >
              {task.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
