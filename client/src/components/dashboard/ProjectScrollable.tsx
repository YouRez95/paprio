import { Folder, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetProjects } from "@/hooks/useProjects";

import { ProjectCard, SeeMoreCard } from "./ProjectCard";
import { ProjectsScrollableSkeleton } from "../skeletons/ProjectsScrollableSkeleton";

export default function ProjectsScrollable() {
  const {
    data: projectsData,
    isPending,
    error,
  } = useGetProjects({ limit: 10, page: 1, search: "", tag: "" });

  console.log("projectsData for the dashboard", projectsData);

  if (isPending) return <ProjectsScrollableSkeleton />;
  if (error) return <ProjectsScrollableError error={error} />;
  if (!projectsData?.projects?.length) return <ProjectsScrollableEmpty />;

  const { projects, pagination } = projectsData;
  const hasMore = pagination.pages > 1;

  return (
    <div className="relative h-full">
      <div className="flex h-full overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {hasMore && <SeeMoreCard totalProjects={pagination.total} />}
      </div>
    </div>
  );
}

// Empty State
const ProjectsScrollableEmpty = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/20 px-8">
      <Folder className="w-12 h-12 text-muted-foreground/50 mb-3" />
      <p className="text-sm font-medium text-foreground mb-1">
        No projects yet
      </p>
      <p className="text-xs text-muted-foreground text-center max-w-[250px] mb-4">
        Create your first project to start collaborating with your team
      </p>
    </div>
  );
};

// Error State
const ProjectsScrollableError = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full rounded-xl border border-destructive/20 bg-destructive/5 px-8">
      <div className="p-3 rounded-full bg-destructive/10 mb-3">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">
        Failed to load projects
      </p>
      <p className="text-xs text-muted-foreground text-center max-w-[300px] mb-4">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  );
};
