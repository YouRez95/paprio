import type { ProjectRole, ProjectTreeNode } from "@/types/project.types";
import { Download, Settings, Star, Users } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../ui/button";

type ProjectDetailsHeaderProps = {
  isPending: boolean;
  project: {
    id: string;
    name: string;
    description: string | null;
    deletedAt: null;
    updatedAt: string;
    createdAt: string;
    role: ProjectRole;
    isFavorite: boolean;
  };

  projectTree: ProjectTreeNode[];
};

export default function ProjectDetailsHeader({
  isPending,
  project,
  projectTree,
}: ProjectDetailsHeaderProps) {
  const { flattenTree } = useTreeOperations();
  const formatDate = (date: Date | string) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadge = (role: ProjectRole) => {
    const badges = {
      ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
      EDITOR: "bg-blue-100 text-blue-700 border-blue-200",
      VIEWER: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return badges[role] || badges.VIEWER;
  };

  const handleToggleStar = (id: string) => {
    console.log("Toggling star for project ID:", id);
  };

  const treeStats = useMemo(() => {
    const allNodes = flattenTree(projectTree);
    const files = allNodes.filter((node) => node.type === "file");
    const folders = allNodes.filter((node) => node.type === "folder");

    return {
      totalFiles: files.length,
      totalFolders: folders.length,
    };
  }, [projectTree, flattenTree]);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {project?.name}
                <button
                  onClick={() => project && handleToggleStar(project.id)}
                  className="p-1 hover:bg-yellow-50 rounded transition-colors"
                >
                  <Star
                    className={`w-5 h-5 ${
                      project?.isFavorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadge(
                  project.role
                )}`}
              >
                {project.role}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border"
          >
            <Settings className="w-4 h-4" /> Settings
          </Button>

          <Button
            variant={"outline"}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border"
          >
            <Download className="w-4 h-4" /> Download
          </Button>
        </div>
      </div>

      {isPending ? (
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3 max-w-2xl leading-relaxed">
            {project?.description || "No description provided."}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Created {project && formatDate(project.createdAt)}
            </span>
            <span>•</span>
            <span>{treeStats.totalFiles} files</span>
            <span>•</span>
            <span>{treeStats.totalFolders} folders</span>

            {project?.updatedAt && (
              <>
                <span>•</span>
                <span>Updated {formatDate(project.updatedAt)}</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Custom hook for tree operations
const useTreeOperations = () => {
  const flattenTree = (nodes: ProjectTreeNode[]): ProjectTreeNode[] => {
    return nodes.reduce<ProjectTreeNode[]>((acc, node) => {
      acc.push(node);
      if (node.subChild && node.expanded) {
        acc.push(...flattenTree(node.subChild));
      }
      return acc;
    }, []);
  };
  return { flattenTree };
};
