import { FolderRoot, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import type { NestedProjects } from "@/types/project.types";

type ChooseProjectProps = {
  projects?: NestedProjects[];
  isPending: boolean;
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
  setPath: (path: { id: string; name: string }[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export default function ChooseProject({
  selectedProject,
  setPath,
  setSelectedProject,
  searchTerm,
  setSearchTerm,
  projects = [],
  isPending = false,
}: ChooseProjectProps) {
  return (
    <>
      <div className="flex w-full items-center border border-gray-300 rounded-xl pr-0.5 pl-2.5 py-0.5">
        <SearchIcon className="h-4 w-4 mr-1.5" />
        <Input
          type="search"
          autoFocus
          placeholder="Search..."
          className="w-full border-0 rounded-lg outline-none py-1  focus-visible:ring-1"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedProject(null); // Reset selected project on new search
            setPath([]); // Reset path on new search
          }}
        />
      </div>

      <div>
        {isPending && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        )}
        {!projects || projects.length === 0 ? (
          <div className="flex items-center justify-center h-full my-5">
            <p className="text-sm text-muted-foreground">
              No projects found, Please create a project first.
            </p>
          </div>
        ) : (
          <ul className="mt-2 max-h-40 overflow-y-auto">
            {projects.map((project) => (
              <li
                className={`min-h-10 flex items-center p-3 rounded-lg hover:text-primary text-muted-foreground hover:bg-muted cursor-pointer ${
                  selectedProject === project.id ? "bg-muted text-primary" : ""
                }`}
                key={project.id}
                onClick={() => {
                  setSelectedProject(project.id);
                  setPath([]);
                }}
              >
                <FolderRoot className="inline mr-2 h-4 w-4" />
                <span className="">{project.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
