import { useState } from "react";

import { useParams } from "react-router";
import { useGetProjectById } from "@/hooks/useProjects";
import ProjectDetailsHeader from "@/components/projectDetails/ProjectDetailsHeader";
import ProjectDetailToolbar from "@/components/projectDetails/ProjectDetailToolbar";
import { TreeItemSkeleton } from "@/components/skeletons/ProjectDetailTreeSkeleton";
import { ProjectDetailTreeItem } from "@/components/projectDetails/ProjectDetailTreeItem";
import ProjectDetailError from "@/components/projectDetails/ProjectDetailError";
import ProjectDetailsEmpty from "@/components/projectDetails/ProjectDetailsEmpty";

export type SelectedItem = {
  id: string;
  name: string;
  type: "folder" | "file";
};

const ProjectDetailPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { projectId } = useParams();

  const { data: projectData, isPending, error } = useGetProjectById(projectId);
  const project = projectData?.project;
  const projectTree = projectData?.projectTree || [];

  if (error) <ProjectDetailError />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-screen bg-gray-50">
      {/* Header */}
      {project && (
        <ProjectDetailsHeader
          isPending={isPending}
          project={project}
          projectTree={projectTree}
        />
      )}

      {/* Toolbar */}
      {projectData?.project && (
        <ProjectDetailToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          projectName={projectData?.project.name}
        />
      )}

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden">
          {isPending ? (
            <div className="p-4 space-y-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <TreeItemSkeleton key={i} level={i % 3} />
              ))}
            </div>
          ) : projectTree.length === 0 ? (
            <ProjectDetailsEmpty />
          ) : (
            <div
              className="divide-y divide-gray-100"
              role="tree"
              aria-label="Project file tree"
            >
              {projectTree.map((node) => (
                <ProjectDetailTreeItem
                  level={0}
                  key={node.id}
                  node={node}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
