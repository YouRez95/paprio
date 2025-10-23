import { useParams, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, File, Folder } from "lucide-react";

interface ProjectDetailItemMenuProps {
  id: string;
  type: "file" | "folder";
  name: string;
  onRename?: (id: string, type: "file" | "folder", currentName: string) => void;
  onDelete?: (id: string, type: "file" | "folder", currentName: string) => void;
  onCreateFolder?: (id: string, currentName: string) => void;
  onCreateDocument?: (id: string, currentName: string) => void;
}

export default function ProjectDetailItemMenu({
  id,
  type,
  name,
  onRename,
  onCreateFolder,
  onCreateDocument,
  onDelete,
}: ProjectDetailItemMenuProps) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const handleAction = (action: string) => {
    const handlers: Record<string, () => void> = {
      rename: () => onRename?.(id, type, name),
      createFolder: () => onCreateFolder?.(id, name),
      createDocument: () => onCreateDocument?.(id, name),
      delete: () => onDelete?.(id, type, name),
    };

    handlers[action]?.();
  };

  const Icon = type === "folder" ? Folder : File;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1 rounded hover:bg-primary/15 cursor-pointer transition-colors">
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="truncate">{name}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Conditional Actions */}
        {type === "folder" ? (
          <>
            <DropdownMenuItem onClick={() => handleAction("createFolder")}>
              Create folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("createDocument")}>
              Create File
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => handleAction("preview")}>
              Preview file
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/projects/${projectId}/file/${id}`)}
            >
              Open file
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                window.open(`/projects/${projectId}/file/${id}`, "_blank")
              }
            >
              Open in new tab
            </DropdownMenuItem>
          </>
        )}

        {/* Core Actions */}
        <DropdownMenuItem onClick={() => handleAction("rename")}>
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("move")}>
          Move to...
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("copy")}>
          Make a copy
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Share & Download */}
        <DropdownMenuItem onClick={() => handleAction("share")}>
          Share...
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("download")}>
          Download
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Dangerous Action */}
        <DropdownMenuItem
          onClick={() => handleAction("delete")}
          className="text-red-600 focus:text-red-700"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
