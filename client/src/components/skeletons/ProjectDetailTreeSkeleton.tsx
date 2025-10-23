export const TreeItemSkeleton = ({ level = 0 }: { level?: number }) => (
  <div
    className="flex items-center gap-2 px-3 py-2 my-0.5"
    style={{ paddingLeft: `${level * 20 + 12}px` }}
  >
    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
    <div className="h-4 bg-gray-200 rounded animate-pulse flex-1 max-w-[120px]" />
  </div>
);
