import { formatTimeAgo } from "@/lib/utils";
import type { Project } from "@/types/project.types";
import { ArrowRight, Calendar, Folder, Users } from "lucide-react";
import { Link } from "react-router";

export const ProjectCard = ({ project }: { project: Project }) => {
  const memberCount = project._count.members;
  const displayMembers = project.members.slice(0, 3);
  const remainingCount = Math.max(0, memberCount - 3);
  const timeAgo = formatTimeAgo(project.updatedAt);

  console.log("Rendering ProjectCard for project:", project);

  return (
    <Link
      to={`/dashboard/projects/${project.id}`}
      className="group flex-shrink-0 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
    >
      <div className="h-full rounded-xl bg-gradient-to-br from-secondary to-secondary/80 w-[280px] p-4 flex flex-col justify-between border shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-primary/50 group-hover:scale-[1.02]">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Folder className="w-5 h-5 text-primary" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                by {project.owner.firstName} {project.owner.lastName}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">
            {project.description ||
              "No description available for this project."}
          </p>
        </div>

        {/* Footer */}
        <div className="space-y-2">
          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {project.tags.slice(0, 2).map((tag: any) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                >
                  {tag.name}
                </span>
              ))}
              {project.tags.length > 2 && (
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            {/* Date */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>

            {/* Members */}
            <div className="flex items-center gap-1">
              {memberCount > 0 ? (
                <>
                  <div className="flex -space-x-2">
                    {displayMembers.map((member) => (
                      <div
                        key={member.id}
                        className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white ring-1 ring-border"
                        title={`${member.user.firstName} ${member.user.lastName}`}
                      >
                        {member.user.imageUrl ? (
                          <img
                            src={member.user.imageUrl}
                            alt={`${member.user.firstName} ${member.user.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[10px] font-semibold text-primary">
                            {member.user.firstName[0]}
                            {member.user.lastName[0]}
                          </div>
                        )}
                      </div>
                    ))}
                    {remainingCount > 0 && (
                      <div className="relative w-6 h-6 rounded-full bg-primary border-2 border-white ring-1 ring-border flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-white">
                          +{remainingCount}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span className="text-[10px]">No members</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const SeeMoreCard = ({ totalProjects }: { totalProjects: number }) => {
  return (
    <Link
      to="/dashboard/projects"
      className="group flex-shrink-0 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
    >
      <div className="h-full rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 w-[160px] border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-3 hover:border-primary/60 hover:bg-primary/15 transition-all duration-200 group-hover:scale-[1.02]">
        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
        <div className="text-center px-4">
          <p className="text-sm font-semibold text-primary">View All</p>
          <p className="text-xs text-muted-foreground mt-1">
            {totalProjects} project{totalProjects !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </Link>
  );
};
