import { useCompileDocument, useGetDocumentById } from "@/hooks/useDocuments";
import FileEditorHeader from "./FileEditorHeader";
import FileEditorSidebar from "./FileEditorSidebar";
import { useParams, useNavigate } from "react-router";
import type { AxiosError } from "axios";
import { FileEditorSkeleton } from "../skeletons/FileEditorSkeleton";
import { Button } from "../ui/button";
import { AlertCircle, RefreshCw, FileX, Home } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useDocumentStore } from "@/store/documentStore";
import PDFViewer from "./PdfViewer";
import { toast } from "sonner";
import { useLatexConfigStore } from "@/store/latexPageConfigStore";

export default function FileEditor() {
  const { fileId, projectId } = useParams();
  const navigate = useNavigate();

  const {
    setBlocks,
    undo,
    redo,
    canUndo,
    canRedo,
    setSaveStatus,
    setLastSaved,
    addRecentlyUsedBlocks,
  } = useDocumentStore();

  const {
    mutate: compileDocumentMutation,
    isPending: pendingCompilation,
    isError: documentCompilationError,
  } = useCompileDocument();

  const [pdfData, setPdfData] = useState<{
    url: string;
    compiled: boolean;
  } | null>(null);

  const { loadConfig } = useLatexConfigStore();

  const {
    data: documentData,
    isPending,
    isError,
    error,
    refetch,
  } = useGetDocumentById(fileId || "");

  /**
   * Handle document save with compilation
   */
  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const hasChanges = useDocumentStore.getState().hasChanges();
      const changedBlocks = useDocumentStore.getState().getChangesPayload();
      const latexPageConfig = useLatexConfigStore.getState().config;
      const configChanged = useLatexConfigStore.getState().hasChanges();
      const saveConfig = useLatexConfigStore.getState().saveConfig;

      if (!hasChanges && !configChanged) {
        toast.info("No changes to save", { position: "top-center" });
        setSaveStatus("saved");
        return;
      }

      compileDocumentMutation(
        {
          documentId: fileId || "",
          ...changedBlocks,
          latexPageConfig: configChanged ? latexPageConfig : undefined,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              let url = data.pdfUrl || "";
              if (data.pdfBuffer) {
                // Convert base64 string -> bytes
                const byteChars = atob(data.pdfBuffer);
                const byteNumbers = Array.from(byteChars, (c) =>
                  c.charCodeAt(0)
                );
                const byteArray = new Uint8Array(byteNumbers);

                const blob = new Blob([byteArray], { type: "application/pdf" });
                url = URL.createObjectURL(blob);
              }
              setPdfData({ url, compiled: true });
              setSaveStatus("saved");
              setLastSaved(new Date());
              saveConfig();
              useDocumentStore.getState().clearChanges();
              // Create version history entry
            }
          },
          onError: (error) => {
            console.error("Save failed:", error);
            setSaveStatus("unsaved");
            toast.error("Failed to save document", {
              position: "top-center",
            });
          },
        }
      );
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("unsaved");
      toast.error("An unexpected error occurred", {
        position: "top-center",
      });
    }
  }, [fileId, compileDocumentMutation, setSaveStatus, setLastSaved]);

  /**
   * Handle PDF download
   */
  const handleDownload = useCallback(async () => {
    try {
      if (documentData?.pdfUrl) {
        const link = document.createElement("a");
        link.href = `${import.meta.env.VITE_API_URL}${
          documentData.pdfUrl
        }&download=true`;
        link.download = `${documentData.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Download started", { position: "top-center" });
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download PDF", { position: "top-center" });
    }
  }, [documentData?.pdfUrl, documentData?.title]);

  /**
   * Handle undo operation
   */
  const handleUndo = useCallback(() => {
    if (canUndo()) {
      undo();
      toast.info("Undo", { position: "top-center", duration: 1000 });
    }
  }, [undo, canUndo]);

  /**
   * Handle redo operation
   */
  const handleRedo = useCallback(() => {
    if (canRedo()) {
      redo();
      toast.info("Redo", { position: "top-center", duration: 1000 });
    }
  }, [redo, canRedo]);

  /**
   * Initialize document data on load
   */
  useEffect(() => {
    if (
      documentData &&
      documentData.role !== "VIEWER" &&
      documentData.blocks.length > 0
    ) {
      const existingBlocks = documentData.blocks.map((block) => ({
        id: block.id,
        blockDefId: block.blockDefId,
        order: block.order,
        name: block.name,
        config: block.config,
        blockDefiniton: block.blockDefinition,
      }));

      // console.log(existingBlocks);

      // Remove duplicates by blockDefId, keeping the most recent one (highest order)
      const uniqueBlocks = existingBlocks.reduce((acc, block) => {
        const existing = acc.find((b) => b.blockDefId === block.blockDefId);
        if (!existing || block.order > existing.order) {
          return [
            ...acc.filter((b) => b.blockDefId !== block.blockDefId),
            block,
          ];
        }
        return acc;
      }, [] as typeof existingBlocks);

      // Add blocks to already used store
      const instanceBlocks = uniqueBlocks
        .sort((a, b) => b.order - a.order)
        .slice(0, 10)
        .map((block) => ({
          id: block.blockDefId, // This is the key - block definition ID
          name: block.blockDefiniton.name,
          description: block.blockDefiniton.description,
          thumbnailUrl: block.blockDefiniton.thumbnailUrl,
          defaultConfig: block.blockDefiniton.defaultConfig,
          userConfig: block.config,
        }));

      addRecentlyUsedBlocks(instanceBlocks);

      // Check if we need to initialize blocks
      const currentBlocks = useDocumentStore.getState().blocks;
      const currentHistory = useDocumentStore.getState().history;

      // Only initialize if blocks are empty or history is empty
      if (currentBlocks.length === 0 || currentHistory.length === 0) {
        setBlocks(existingBlocks);
        loadConfig(documentData.latexConfig || null);
      }
    }
  }, [documentData, setBlocks, loadConfig]);

  /**
   * Initialize PDF viewer
   */
  useEffect(() => {
    if (documentData) {
      setPdfData(
        documentData.pdfUrl
          ? { url: documentData.pdfUrl, compiled: false }
          : null
      );
    }
  }, [documentData]);

  /**
   * Keyboard shortcuts
   * Ctrl+S: Save
   * Ctrl+Z: Undo
   * Ctrl+Y or Ctrl+Shift+Z: Redo
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (documentData?.hasPermissionToEdit) {
          handleSave();
        }
      }

      // Undo shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (documentData?.hasPermissionToEdit && canUndo()) {
          handleUndo();
        }
      }

      // Redo shortcuts
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        if (documentData?.hasPermissionToEdit && canRedo()) {
          handleRedo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleSave,
    handleUndo,
    handleRedo,
    documentData?.hasPermissionToEdit,
    canUndo,
    canRedo,
  ]);

  // Error handling
  if (!fileId) {
    return (
      <ErrorState
        title="No File Selected"
        message="Please select a file to view"
        onBack={() => navigate(`/projects/${projectId}`)}
        showRetry={false}
      />
    );
  }

  if (isError) {
    return (
      <ErrorState error={error} onRetry={refetch} onBack={() => navigate(-1)} />
    );
  }

  if (isPending) {
    return <FileEditorSkeleton />;
  }

  if (!documentData) {
    return (
      <ErrorState
        title="Document Not Found"
        message="The requested document could not be found"
        onBack={() => navigate(-1)}
        showRetry={false}
      />
    );
  }

  return (
    <div className="h-full">
      <FileEditorHeader
        data={documentData}
        onSave={handleSave}
        onDownload={handleDownload}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo()}
        canRedo={canRedo()}
      />
      <div className="flex items-start h-[calc(100%-60px)]">
        {documentData.role !== "VIEWER" && (
          <aside className="flex h-full">
            <FileEditorSidebar />
          </aside>
        )}
        <main className="flex-1 flex h-full p-4 overflow-auto">
          <div className="w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <PDFViewer
              pdfData={pdfData}
              isPending={pendingCompilation}
              isError={documentCompilationError}
              errorMessage="Failed to compile LaTeX document"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// Error State Component
// ============================================================================

interface ErrorStateProps {
  error?: unknown;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  showRetry?: boolean;
}

const ErrorState = ({
  error,
  title,
  message,
  onRetry,
  showRetry = true,
}: ErrorStateProps) => {
  const errorMessage = getErrorMessage(error);
  const displayTitle = title || "Error Loading Document";
  const displayMessage = message || errorMessage;
  const isNotFound =
    errorMessage.toLowerCase().includes("404") ||
    errorMessage.toLowerCase().includes("not found");

  const handleGoToProject = () => {
    // Extract project ID from current URL
    // Pattern: /projects/:projectId/file/:fileId
    const pathParts = window.location.pathname.split("/");
    const projectsIndex = pathParts.indexOf("projects");

    if (projectsIndex !== -1 && pathParts[projectsIndex + 1]) {
      const projectId = pathParts[projectsIndex + 1];
      window.location.href = `/projects/${projectId}`;
    } else {
      // Fallback to projects listing
      window.location.href = "/projects";
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            {isNotFound ? (
              <FileX className="w-8 h-8 text-red-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {displayTitle}
          </h2>

          <p className="text-gray-600 mb-6">{displayMessage}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoToProject}
              variant="outline"
              className="inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Project
            </Button>
            {showRetry && (
              <Button
                onClick={onRetry || handleRefresh}
                className="inline-flex items-center justify-center gap-2"
                variant="default"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Extract error message from various error types
 */
function getErrorMessage(error: unknown): string {
  if (!error) return "An unknown error occurred";

  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosErr = error as AxiosError<{ message?: string }>;

    if (axiosErr.response?.status === 404) {
      return "Document not found";
    }
    if (axiosErr.response?.status === 403) {
      return "You don't have permission to access this document";
    }
    if (axiosErr.response?.status === 401) {
      return "Please log in to access this document";
    }
    if (axiosErr.response?.status === 500) {
      return "Server error. Please try again later";
    }

    return (
      axiosErr.response?.data?.message ||
      axiosErr.message ||
      "Failed to load document"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}
