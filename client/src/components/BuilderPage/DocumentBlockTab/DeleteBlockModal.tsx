import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDocumentStore } from "@/store/documentStore";
import { AlertTriangle, X } from "lucide-react";

type DeleteBlockModalProps = {
  deleteBlock: { id: string; name: string } | null;
  setDeleteBlock: (block: { id: string; name: string } | null) => void;
};

export const DeleteBlockModal = ({
  deleteBlock,
  setDeleteBlock,
}: DeleteBlockModalProps) => {
  const { removeBlock } = useDocumentStore();

  const handleDeleteBlock = (blockId: string) => {
    removeBlock(blockId);
    setDeleteBlock(null);
  };

  return (
    <AlertDialog open={!!deleteBlock} onOpenChange={() => setDeleteBlock(null)}>
      <AlertDialogContent className="max-w-md p-0 gap-0 border-border animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <AlertDialogHeader className="flex-row items-start justify-between p-6 pb-4 space-y-0">
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold">
                Delete Block
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground mt-1 sr-only">
                delete block {deleteBlock?.name}
              </AlertDialogDescription>
            </div>
          </div>
          <button
            onClick={() => setDeleteBlock(null)}
            className="p-1 rounded-md hover:bg-secondary transition-colors -mt-1"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </AlertDialogHeader>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-sm text-foreground/80 text-center">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              "{deleteBlock?.name}" ?
            </span>
          </p>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="flex-row items-center justify-center  gap-3 px-6 py-4 bg-muted/30 rounded-b-xl border-t sm:space-x-0">
          <AlertDialogCancel className="mt-0 flex-1 cursor-pointer hover:bg-secondary">
            No, Keep It
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteBlock && handleDeleteBlock(deleteBlock.id)}
            className="mt-0 flex-1 bg-destructive text-primary-foreground cursor-pointer hover:bg-destructive/90"
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
