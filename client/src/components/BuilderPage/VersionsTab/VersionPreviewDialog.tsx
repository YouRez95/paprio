import { Download, RotateCcw, X, StickyNote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DocumentVersion } from "@/types/document.types";
import PDFViewer from "../PdfViewer";
import { formatTimeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VersionPreviewDialogProps {
  version: DocumentVersion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore: (version: DocumentVersion) => void;
  onDownload: (version: DocumentVersion) => void;
}

export function VersionPreviewDialog({
  version,
  open,
  onOpenChange,
  onRestore,
  onDownload,
}: VersionPreviewDialogProps) {
  if (!version) return null;

  const handleRestore = () => {
    onRestore(version);
    onOpenChange(false);
  };

  const handleDownload = () => {
    onDownload(version);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] min-w-[50vw] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base">
                Version {version.version}
              </DialogTitle>
              <DialogDescription className="text-xs mt-1">
                Created {formatTimeAgo(version.createdAt)}
                {version.user && (
                  <span className="text-muted-foreground/70">
                    {" · "}
                    {version.isCurrentUser
                      ? "You"
                      : version.user.firstName || version.user.lastName
                      ? `${version.user.firstName || ""}${
                          version.user.lastName
                            ? ` ${version.user.lastName}`
                            : ""
                        }`.trim()
                      : version.user.email.split("@")[0]}
                  </span>
                )}
              </DialogDescription>
              {version.note && (
                <div className="mt-3 p-3 bg-muted/50 rounded-md border">
                  <div className="flex items-start gap-2">
                    <StickyNote className="w-4 h-4 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground italic">
                      "{version.note}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* PDF Viewer */}
        <div className="flex-1 min-h-0 bg-muted/20">
          {version.pdfUrl ? (
            <PDFViewer
              pdfData={{
                url: version.pdfUrl,
                compiled: false,
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                PDF preview not available
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t bg-background flex-shrink-0">
          <Button
            variant="ghost"
            className="border"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>

          <div className="flex items-center gap-2">
            {version.pdfUrl && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}

            <Button size="sm" onClick={handleRestore}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restore This Version
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
