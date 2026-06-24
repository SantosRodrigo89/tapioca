import { Skeleton } from "@/components/ui/skeleton";

export default function MenuLoading() {
  return (
    <>
      <div className="relative h-[260px] w-full bg-[var(--menu-surface)]">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      <div className="mx-auto max-w-3xl px-4">
        <div className="-mt-12 space-y-4">
          <Skeleton className="h-24 w-24 rounded-2xl" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-12 w-full rounded-xl sm:w-48" />
        </div>
      </div>

      <div className="border-b border-[var(--menu-border)] px-4 py-3">
        <div className="mx-auto flex max-w-3xl gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full" />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-6">
        <div className="space-y-3">
          <Skeleton className="h-7 w-40" />
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 w-[200px] shrink-0 rounded-2xl" />
            ))}
          </div>
        </div>

        {[1, 2].map((cat) => (
          <div key={cat} className="space-y-3">
            <Skeleton className="h-7 w-36" />
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-[var(--menu-border)] p-4"
              >
                <Skeleton className="h-[104px] w-[104px] shrink-0 rounded-xl" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
