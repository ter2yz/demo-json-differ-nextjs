import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function DiffViewerSkeleton() {
  const widths = [
    "w-full",
    "w-11/12",
    "w-11/12",
    "w-11/12",
    "w-full",
    "w-11/12",
    "w-10/12",
    "w-10/12",
    "w-10/12",
    "w-11/12",
    "w-full",
  ];

  return (
    <div className="flex w-full gap-6 px-4">
      <div className="flex w-full flex-col items-end gap-6 opacity-20">
        {widths.map((width, index) => (
          <Skeleton
            key={index}
            className={cn("h-3 rounded bg-rose-300", width)}
          />
        ))}
      </div>
      <div className="flex w-full flex-col items-end gap-6 opacity-20">
        {widths.map((width, index) => (
          <Skeleton
            key={index}
            className={cn("h-3 rounded bg-cyan-300", width)}
          />
        ))}
      </div>
    </div>
  );
}
