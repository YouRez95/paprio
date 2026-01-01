export const FileEditorSkeleton = () => {
  return (
    <div className="h-full">
      {/* Header Skeleton */}
      <div className="h-[60px] bg-white border-b border-gray-200 px-4 flex items-center gap-4">
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="ml-auto flex gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="flex items-start h-[calc(100%-60px)]">
        {/* Sidebar Skeleton */}
        <aside className="flex h-full">
          <div className="w-64 bg-white border-r border-gray-200 p-4">
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 flex-1 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 flex h-full p-4">
          <div className="w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 space-y-4">
              {/* PDF Viewer Skeleton */}
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                    style={{ width: `${Math.random() * 30 + 70}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
