import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { Clock, Download, Eye, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useGetDocumentVersions } from "@/hooks/useDocuments";
import { useParams } from "react-router";
import type { DocumentVersion } from "@/types/document.types";
import { VersionPreviewDialog } from "./VersionPreviewDialog";
import { formatTimeAgo } from "@/lib/utils";

export default function FileEditorDocumentVersions() {
  const { fileId } = useParams();
  const {
    data: versions,
    isPending,
    error,
  } = useGetDocumentVersions(fileId || "");

  const [selectedVersion, setSelectedVersion] =
    useState<DocumentVersion | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  const handlePreview = (version: DocumentVersion) => {
    setSelectedVersion(version);
    setShowPreviewDialog(true);
  };

  const handleRestore = async (version: DocumentVersion) => {
    // TODO: Implement restore logic with API call
    console.log("Restoring to version:", version.version);
    // Example: await restoreDocumentVersion(fileId, version.id);
  };

  const handleDownload = (version: DocumentVersion) => {
    if (!version.pdfUrl) return;

    // Open PDF in new tab for download
    window.open(version.pdfUrl, "_blank");
  };

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2 animate-pulse" />
          <p className="text-xs text-muted-foreground">Loading versions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-sm text-destructive mb-2">
            Failed to load versions
          </p>
          <p className="text-xs text-muted-foreground">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  const hasVersions = versions && versions.length > 0;

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 flex-shrink-0">
          <h2 className="text-sm font-semibold tracking-tight">
            Version History
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {hasVersions
              ? `${versions.length} version${
                  versions.length === 1 ? "" : "s"
                } available`
              : "No versions saved yet"}
          </p>
        </div>

        <Separator />

        {/* Versions list */}
        <div className="flex-1 overflow-y-auto">
          {!hasVersions ? (
            <div className="py-12 px-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 mb-3">
                <Clock className="w-6 h-6 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium mb-1">No versions yet</p>
              <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                Versions are automatically saved as you make changes to your
                document
              </p>
            </div>
          ) : (
            <div className="px-2 py-2 space-y-1">
              {versions.map((version) => (
                <VersionItem
                  key={version.id}
                  version={version}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                  onRestore={handleRestore}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PDF Preview Dialog */}
      <VersionPreviewDialog
        version={selectedVersion}
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        onRestore={handleRestore}
        onDownload={handleDownload}
      />
    </>
  );
}

interface VersionItemProps {
  version: DocumentVersion;
  onPreview: (version: DocumentVersion) => void;
  onDownload: (version: DocumentVersion) => void;
  onRestore: (version: DocumentVersion) => void;
}

function VersionItem({
  version,
  onPreview,
  onDownload,
  onRestore,
}: VersionItemProps) {
  return (
    <div className="group relative rounded-lg px-3 py-2.5 transition-all hover:bg-muted/60 border border-transparent hover:border-border">
      <div className="flex items-start justify-between gap-3">
        {/* Meta */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              Version {version.version}
            </span>
          </div>

          <p className="text-xs text-muted-foreground truncate">
            {formatTimeAgo(version.createdAt)}
            {version.user && (
              <span className="text-muted-foreground/70">
                {" · "}
                {version.isCurrentUser
                  ? "You"
                  : version.user.firstName || version.user.lastName
                  ? `${version.user.firstName || ""}${
                      version.user.lastName ? ` ${version.user.lastName}` : ""
                    }`.trim()
                  : version.user.email.split("@")[0]}
              </span>
            )}
          </p>

          {version.note && (
            <p className="text-xs text-muted-foreground/70 mt-1 truncate italic">
              "{version.note}"
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPreview(version)}
            title="Preview version"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>

          {version.pdfUrl && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onDownload(version)}
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs ml-1"
            onClick={() => onRestore(version)}
          >
            <RotateCcw className="w-3 h-3 mr-1.5" />
            Restore
          </Button>
        </div>
      </div>
    </div>
  );
}
