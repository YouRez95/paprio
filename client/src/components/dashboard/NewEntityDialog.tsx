import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { DialogDescription } from "../ui/dialog";
import CreateFolderPart from "./CreateFolderPart";
import type { ProjectType } from "@/types/project.types";
import FolderNavigator from "./FolderNavigator";
import ChooseProject from "./ChooseProject";
import { useGetFiveProjects } from "@/hooks/useProjects";

type NewEntityProps = {
  onClose: () => void;
  typeDialog: "Folder" | "Document";
};

export const NewEntityDialog = ({ onClose, typeDialog }: NewEntityProps) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data: projects, isPending } = useGetFiveProjects(debouncedSearchTerm);
  const [path, setPath] = useState<{ id: string; name: string }[]>([]);

  console.log("project five", projects);

  const currentProject = projects?.find((p) => p.id === selectedProject) as
    | ProjectType
    | undefined;

  return (
    <>
      <DialogDescription className="sr-only">
        Create New Folder
      </DialogDescription>
      <div className="flex flex-col gap-4">
        <p>Choose a project</p>
        <div className="">
          <ChooseProject
            isPending={isPending}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedProject={selectedProject}
            setPath={setPath}
            setSelectedProject={setSelectedProject}
            projects={projects}
          />
          <FolderNavigator
            path={path}
            setPath={setPath}
            currentProject={currentProject}
          />
        </div>
      </div>

      {currentProject && typeDialog === "Folder" && (
        <CreateFolderPart
          onClose={onClose}
          path={path}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          setPath={setPath}
          currentProject={currentProject}
        />
      )}
      {currentProject && typeDialog === "Document" && (
        // <CreateDocumentPart
        //   onClose={onClose}
        //   path={path}
        //   selectedProject={selectedProject}
        //   setSelectedProject={setSelectedProject}
        //   setPath={setPath}
        //   currentProject={currentProject}
        // />
        <div></div>
      )}
    </>
  );
};
