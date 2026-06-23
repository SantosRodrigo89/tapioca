import { Skeleton } from "@/components/ui/skeleton";

export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="flex flex-col items-center gap-3 py-8 px-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Nav skeleton */}
      <div className="border-b px-4 py-2">
        <div className="flex gap-2 max-w-2xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>
      </div>

      {/* Items skeleton */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {[1, 2].map((cat) => (
          <div key={cat} className="space-y-3">
            <Skeleton className="h-6 w-36" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border p-3">
                  <Skeleton className="h-20 w-20 rounded-md shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
