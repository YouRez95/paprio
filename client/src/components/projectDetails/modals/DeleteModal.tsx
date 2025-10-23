import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useSoftDeleteFolderOrFile } from "@/hooks/useFolders";
import { useParams } from "react-router";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  type: "file" | "folder";
  itemId: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  itemName,
  type,
  itemId,
}: DeleteModalProps) {
  const [itemNameToDelete, setItemNameToDelete] = useState("");
  const [error, setError] = useState<string | null>(null);
  const {
    mutate: softDeleteFolderOrFileMutation,
    isPending,
    error: errorApi,
  } = useSoftDeleteFolderOrFile();
  const { projectId } = useParams();

  const handleDeleteItem = () => {
    softDeleteFolderOrFileMutation(
      {
        name: itemName,
        itemId,
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
    if (!open && !isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="py-5 px-0">
        <DialogHeader className="gap-0">
          <DialogTitle className="px-5 pb-2.5">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Are you sure ?
            </div>
          </DialogTitle>
          <Separator />

          <DialogDescription className="px-5 pt-2.5 pb-2.5 text-destructive bg-destructive/10 flex items-start gap-2">
            This {type === "file" ? "file " : "folder "} will be moved to the
            trash and can be restored within 30 days.
          </DialogDescription>
          <div className="px-5 pt-5 text-sm space-y-5">
            <p className="">
              After 30 days, the {type === "file" ? "file " : "folder "}
              <b>{itemName}</b> will be permanently deleted. This action will
              also remove the project from the team until it's restored.
            </p>

            <div className="space-y-2">
              <Label className="font-medium flex items-center gap-1 select-text">
                Please type <b className="underline">{itemName}</b> to confirm
                deletion:
              </Label>
              <Input
                type="text"
                value={itemNameToDelete}
                onChange={(e) => {
                  setItemNameToDelete(e.target.value);
                  setError(null);
                }}
              />
            </div>
          </div>
        </DialogHeader>
        {(error || errorApi) && (
          <div className="px-5 text-destructive text-sm">
            {error || errorApi?.message}
          </div>
        )}
        <DialogFooter className="flex items-center justify-end gap-2 px-5">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            disabled={
              isPending ||
              !itemNameToDelete.trim() ||
              itemNameToDelete.trim() !== itemName
            }
            onClick={handleDeleteItem}
          >
            {isPending
              ? "Deleting..."
              : type === "file"
              ? "Delete File"
              : "Delete Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
