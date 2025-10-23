import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRenameFolderOrFile } from "@/hooks/useFolders";
import { useParams } from "react-router";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  type: "file" | "folder";
  itemId: string;
}

export function RenameModal({
  isOpen,
  onClose,
  currentName,
  type,
  itemId,
}: RenameModalProps) {
  const [newName, setNewName] = useState(currentName);
  const { mutate: renameFolderOrFileMutation, isPending } =
    useRenameFolderOrFile();
  const { projectId } = useParams();

  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  const handleRenameItem = (e: React.FormEvent) => {
    e.preventDefault();
    renameFolderOrFileMutation(
      {
        itemId,
        newName,
        type,
        projectId: projectId!,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Rename {type === "folder" ? "Folder" : "File"}
          </DialogTitle>
          <DialogDescription>
            Enter a new name for {type === "folder" ? "the folder" : "the file"}
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleRenameItem}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newName.trim() || newName === currentName || isPending}
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
                  Renaming...
                </>
              ) : type === "folder" ? (
                "Rename Folder"
              ) : (
                "Rename File"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
