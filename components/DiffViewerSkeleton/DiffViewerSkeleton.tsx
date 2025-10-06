import { Skeleton } from "@/components/ui/skeleton";

export default function DiffViewerSkeleton() {
  return (
    <div className="flex w-full gap-4">
      <div className="flex w-full flex-col items-end gap-3">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-10/12 rounded" />
        <Skeleton className="h-3 w-10/12 rounded" />
        <Skeleton className="h-3 w-10/12 rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-full rounded" />
      </div>
      <div className="flex w-full flex-col items-end gap-3">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-10/12 rounded" />
        <Skeleton className="h-3 w-10/12 rounded" />
        <Skeleton className="h-3 w-10/12 rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-full rounded" />
      </div>
    </div>
  );
}
