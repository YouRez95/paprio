import { Home, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

export default function ProjectDetailError({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  const handleGoToProjects = () => {
    window.location.href = "/dashboard/projects";
  };

  const handleRefresh = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The project you're looking for doesn't exist or you don't have
            permission to access it.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleGoToProjects}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            All Projects
          </Button>

          <Button
            onClick={handleRefresh}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            If you believe this is an error, please contact your administrator
            or check your permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
