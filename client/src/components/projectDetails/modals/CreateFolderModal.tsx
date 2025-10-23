import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCreateFolder } from "@/hooks/useFolders";
import { useParams } from "react-router";
import { checkFolderExists } from "@/lib/utils";
// import { useQueryClient } from "@tanstack/react-query";
// import type { GetProjectById } from "@/types/project.types";
import { useGetProjectById } from "@/hooks/useProjects";

type CreateFolderModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  parentFolderId?: string | null;
  parentFolderName?: string | null;
  projectName: string;
};

export default function CreateFolderModal({
  isOpen,
  setIsOpen,
  parentFolderId,
  parentFolderName,
  projectName,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const { projectId } = useParams();
  const { mutate: createFolderMutation, isPending } = useCreateFolder();
  const { data: cachedData } = useGetProjectById(projectId);

  const handleCreateFolder = () => {
    const trimmedName = folderName.trim();

    if (!trimmedName) {
      setError("Folder name cannot be empty");
      return;
    }

    if (!cachedData) return;

    const { projectTree } = cachedData;

    // Check if folder already exists
    console.log("cached Data", cachedData);
    if (checkFolderExists(projectTree, trimmedName, parentFolderId || null)) {
      setError("A folder with this name already exists in this location");
      return;
    }

    createFolderMutation(
      {
        folderName: trimmedName,
        parentFolderId: parentFolderId || null,
        projectId: projectId!,
      },
      {
        onSuccess: () => {
          setFolderName("");
          setError("");
          setIsOpen(false);
        },
        onError: () => {
          setError("Failed to create folder. Please try again.");
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateFolder();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
    if (error) setError("");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setFolderName("");
      setError("");
    }
  };

  const locationText = parentFolderName
    ? `in ${parentFolderName}`
    : `in ${projectName}`;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!parentFolderId && parentFolderId === null && (
        <DialogTrigger asChild>
          <Button className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 transition-colors font-medium text-sm">
            <FolderPlus className="w-4 h-4" />
            Create Folder
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            Create New Folder
          </DialogTitle>
          <DialogDescription className="text-base pt-1">
            Create a new folder {locationText}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label
              htmlFor="folderName"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Folder Name
            </Label>
            <Input
              id="folderName"
              type="text"
              value={folderName}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter folder name..."
              className={`w-full ${
                error ? "border-red-500 focus:ring-red-500" : ""
              }`}
              autoFocus
              disabled={isPending}
            />
            {error && (
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!folderName.trim() || isPending}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Folder"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
