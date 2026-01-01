import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useCreateDocumentVersion } from "@/hooks/useDocuments";

interface SaveVersionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
}

export function SaveVersionConfirmDialog({
  open,
  onOpenChange,
  fileId,
}: SaveVersionConfirmDialogProps) {
  const [note, setNote] = useState("");
  const { mutate: createDocumentVersionMutation, isPending } =
    useCreateDocumentVersion();

  const handleConfirm = () => {
    createDocumentVersionMutation(
      { note, documentId: fileId },
      {
        onSuccess: () => {
          onOpenChange(false);
          setNote("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save version snapshot</DialogTitle>
          <DialogDescription>
            This will create a new version of your document that you can restore
            later. Your current changes will be saved.
          </DialogDescription>
        </DialogHeader>

        <input
          type="text"
          placeholder="Optional note (e.g. Before refactor)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-3 w-full rounded-md border px-3 py-2 text-sm"
          maxLength={120}
        />

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save version"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
