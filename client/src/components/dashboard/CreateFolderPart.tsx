import { Button } from "../ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { resolveNestedFolder } from "@/lib/utils";
import { useCreateFolder } from "@/hooks/useFolders";
import type { ProjectType } from "@/types/project.types";

type CreateFolderPartProps = {
  onClose: () => void;
  selectedProject: string | null;
  setSelectedProject: (projectId: string | null) => void;
  path: { id: string; name: string }[];
  setPath: (path: { id: string; name: string }[]) => void;
  currentProject: ProjectType;
};

export default function CreateFolderPart({
  onClose,
  selectedProject,
  path,
  currentProject,
  setPath,
  setSelectedProject,
}: CreateFolderPartProps) {
  const [error, setError] = useState<string | null>(null);
  const [folderName, setFolderName] = useState("");
  const { mutate: createFolderMutation, isPending } = useCreateFolder();
  const handleCreateFolder = () => {
    if (!selectedProject) {
      setError("Please select a project first.");
      return;
    }
    if (!folderName.trim()) {
      setError("Folder name cannot be empty.");
      return;
    }
    setError(null);
    const target = resolveNestedFolder(currentProject, path);

    const existingFolder = target?.folders?.find(
      (folder) => folder.name === folderName
    );
    if (existingFolder) {
      setError("A folder with this name already exists in this location.");
      return;
    }
    const payloadData = {
      folderName: folderName,
      projectId: selectedProject,
      parentFolderId: path.length > 0 ? path[path.length - 1].id : null,
    };

    // Call API to create folder here
    createFolderMutation(payloadData, {
      onSuccess: () => {
        onClose();
        setFolderName("");
        setSelectedProject(null);
        setPath([]);
      },
    });
  };

  return (
    <>
      <div>
        <Separator className="my-4" />
        <p className="font-medium">Create new folder</p>
        <p className="text-sm text-muted-foreground mb-2">
          The new folder will be created at the selected path.
        </p>
        <Input
          type="text"
          placeholder="Folder name"
          className="w-full"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <DialogFooter className="flex items-center justify-end gap-2">
        <DialogClose asChild>
          <Button
            variant={"outline"}
            className=""
            onClick={() => {
              setSelectedProject(null);
              setPath([]);
            }}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          variant={"default"}
          className="font-semibold"
          onClick={handleCreateFolder}
          disabled={isPending}
        >
          Create here
        </Button>
      </DialogFooter>
    </>
  );
}
