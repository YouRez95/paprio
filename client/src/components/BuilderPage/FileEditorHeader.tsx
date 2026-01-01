import {
  Download,
  Save,
  Edit2,
  Check,
  Loader2,
  Redo,
  Undo,
  History,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LatexPageConfig from "./LatexPageConfig";
import { useState } from "react";
import { useDocumentStore } from "@/store/documentStore";
import { useUpdateDocumentName } from "@/hooks/useDocuments";
import { useParams } from "react-router";
import { SaveVersionConfirmDialog } from "./SaveVersionConfirmDialog";

interface FileEditorHeaderProps {
  data: {
    id: string;
    title: string;
    pdfUrl: string | null;
    blocks: any[];
    role: string;
    hasPermissionToEdit: boolean;
  };
  onSave?: () => void;
  onDownload?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export default function FileEditorHeader({
  data,
  onSave,
  onDownload,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: FileEditorHeaderProps) {
  const { fileId } = useParams();
  const [showSaveVersionDialog, setShowSaveVersionDialog] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(data.title);
  const { saveStatus, lastSaved } = useDocumentStore();
  const { mutate: updateDocumentNameMutation } = useUpdateDocumentName();

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (title !== data.title && fileId) {
      updateDocumentNameMutation(
        { documentId: fileId, newName: title },
        {
          onError: () => {
            setTitle(data.title);
          },
        }
      );
    }
  };

  const getSaveStatusText = () => {
    if (saveStatus === "saving") return "Saving changes…";
    if (saveStatus === "unsaved") return "Unsaved changes";

    if (lastSaved) {
      const diffMin = Math.floor((Date.now() - lastSaved.getTime()) / 60000);
      if (diffMin < 1) return "Saved just now";
      if (diffMin < 60) return `Saved ${diffMin}m ago`;
      return `Saved at ${lastSaved.toLocaleTimeString()}`;
    }
    return "Up to date";
  };

  if (!fileId) return null;

  return (
    <>
      <header className="h-[60px] bg-background border-b flex items-center px-6 justify-between">
        {/* LEFT SIDE — Document Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Title */}
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={title}
                maxLength={50}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSubmit();
                  if (e.key === "Escape") {
                    setIsEditingTitle(false);
                    setTitle(data.title);
                  }
                }}
                className="h-8 w-64"
                autoFocus
              />

              <Button
                size="sm"
                variant="ghost"
                onClick={handleTitleSubmit}
                className="h-8 w-8 p-0"
              >
                <Check size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-lg font-semibold truncate max-w-md">
                {title}
              </h1>

              {data.hasPermissionToEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                >
                  <Edit2 size={14} />
                </Button>
              )}
            </div>
          )}

          {/* Save Status */}
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            {saveStatus === "saving" && (
              <Loader2 className="animate-spin" size={12} />
            )}
            <span>{getSaveStatusText()}</span>
          </div>
        </div>

        {/* RIGHT SIDE — Controls */}
        <div className="flex items-center gap-4">
          {/* Page Config */}
          <LatexPageConfig />

          {/* Undo / Redo */}
          {data.hasPermissionToEdit && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className="h-8 w-8"
              >
                <Undo size={18} />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className="h-8 w-8"
              >
                <Redo size={18} />
              </Button>
            </div>
          )}

          {/* Save Version */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveVersionDialog(true)}
            title="Save Version Snapshot"
            className="flex items-center gap-2"
          >
            <History size={18} />
            Save Version
          </Button>

          {/* Save */}
          {data.hasPermissionToEdit && (
            <Button
              size="sm"
              onClick={onSave}
              disabled={saveStatus === "saved" || saveStatus === "saving"}
              title="Save (Ctrl+S)"
              className="flex items-center gap-2"
            >
              {saveStatus === "saving" ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save
                </>
              )}
            </Button>
          )}

          {/* Download */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onDownload}
            className="flex items-center gap-2"
          >
            <Download size={18} />
            Download
          </Button>
        </div>
      </header>

      <SaveVersionConfirmDialog
        open={showSaveVersionDialog}
        onOpenChange={setShowSaveVersionDialog}
        fileId={fileId}
      />
    </>
  );
}
