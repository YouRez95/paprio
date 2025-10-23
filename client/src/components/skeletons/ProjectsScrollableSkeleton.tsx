import { Skeleton } from "../ui/skeleton";

export const ProjectsScrollableSkeleton = () => {
  return (
    <div className="flex gap-4 h-full overflow-x-auto scrollbar-hide">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[280px] h-full rounded-xl overflow-hidden"
        >
          <Skeleton className="w-full h-full bg-secondary/50" />
        </div>
      ))}
    </div>
  );
};
