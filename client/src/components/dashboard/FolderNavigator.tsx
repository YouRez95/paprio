import type { ProjectType } from "@/types/project.types";
import { Separator } from "../ui/separator";
import { Folder } from "lucide-react";

type FolderNavigatorProps = {
  currentProject?: ProjectType;
  path: { id: string; name: string }[];
  setPath: React.Dispatch<React.SetStateAction<{ id: string; name: string }[]>>;
};

export default function FolderNavigator({
  path,
  setPath,
  currentProject,
}: FolderNavigatorProps) {
  let currentFolders = currentProject?.folders || [];
  path.forEach((level) => {
    const next = currentFolders.find((f) => f.id === level.id);
    currentFolders = next?.folders || [];
  });

  if (!currentProject) return null;
  return (
    <div>
      <Separator className="my-4" />
      <p className="font-medium">Browse existing folders</p>

      {/* Breadcrumbs */}
      <div className="flex gap-2 text-sm text-muted-foreground mb-2">
        <button onClick={() => setPath([])} className="hover:underline">
          {currentProject.name} /
        </button>
        {path.map((level, index) => (
          <span key={level.id} className="flex items-center gap-1">
            <button
              onClick={() => setPath(path.slice(0, index + 1))}
              className="hover:underline"
            >
              {level.name}
            </button>
            {index < path.length - 1 && "/"}
          </span>
        ))}
      </div>

      {/* Folder list */}
      <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
        {currentFolders.map((folder) => (
          <li
            key={folder.id}
            onClick={() =>
              setPath((prev) => [...prev, { id: folder.id, name: folder.name }])
            }
            className="min-h-10 flex items-center p-3 rounded-lg hover:text-primary text-muted-foreground hover:bg-muted cursor-pointer"
          >
            <Folder className="inline mr-2 h-4 w-4" />
            {folder.name}
          </li>
        ))}

        {currentFolders.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No subfolders here. You can create the new one.
          </p>
        )}
      </ul>
    </div>
  );
}
