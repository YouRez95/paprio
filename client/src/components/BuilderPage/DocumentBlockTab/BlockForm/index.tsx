import { ArrowLeft, Loader2 } from "lucide-react";
import {
  useDocumentStore,
  type DocumentBlock,
  type DocumentBlockConfig,
} from "@/store/documentStore";
import { useRef, useState, useEffect } from "react";
import { useGetBlockById } from "@/hooks/useBlocks";
import { Button } from "@/components/ui/button";
import DynamicFormRenderer from "./DynamicFormRenderer";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateUniqueName } from "@/lib/utils";

export default function BlockForm() {
  const { setSelectedBlock, selectedBlock, updateBlock, blocks } =
    useDocumentStore();
  const {
    data: blockData,
    isLoading,
    error: blockError,
    refetch,
  } = useGetBlockById(
    selectedBlock?.blockDefId ? selectedBlock.blockDefId : ""
  );

  const handleBack = () => {
    setSelectedBlock(null);
  };

  const handleDraftChange = (draft: DocumentBlockConfig) => {
    if (!selectedBlock) return;
    updateBlock(selectedBlock.id, { config: draft });
  };

  // CRITICAL: This effect ensures the form updates when undo/redo changes the selected block
  // Without this, the form would show stale data after undo/redo operations
  useEffect(() => {
    if (selectedBlock) {
      // Find the current version of the selected block from the blocks array
      const currentBlock = blocks.find((b) => b.id === selectedBlock.id);

      // If the block still exists but has different data, update selectedBlock
      if (
        currentBlock &&
        JSON.stringify(currentBlock) !== JSON.stringify(selectedBlock)
      ) {
        setSelectedBlock(currentBlock);
      }

      // If the block no longer exists (was removed via undo), close the form
      if (!currentBlock) {
        setSelectedBlock(null);
        toast.info("Block removed", { position: "top-center" });
      }
    }
  }, [blocks, selectedBlock, setSelectedBlock]);

  if (!selectedBlock) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <BlockFormHeader
          id={selectedBlock.id}
          onBack={handleBack}
          title="Configuration"
          updateBlockName={updateBlock}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="text-sm text-gray-500">
              Loading block configuration...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (blockError) {
    return (
      <div className="flex flex-col h-full">
        <BlockFormHeader
          id={selectedBlock.id}
          onBack={handleBack}
          title="Configuration"
          updateBlockName={updateBlock}
        />
        <div className="flex-1 p-4">
          <FormErrorBoundary
            error="Failed to load block configuration. Please try again."
            onRefetch={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!blockData?.configSchema) {
    return (
      <div className="flex flex-col h-full">
        <BlockFormHeader
          id={selectedBlock.id}
          onBack={handleBack}
          title="Configuration"
          updateBlockName={updateBlock}
        />
        <div className="flex-1 p-4">
          <EmptyFormState onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <BlockFormHeader
        onBack={handleBack}
        title={selectedBlock.name || "Block Configuration"}
        id={selectedBlock.id}
        updateBlockName={updateBlock}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {blockData.description && (
          <div className="p-4 border-b bg-blue-50/50">
            <p className="text-sm text-gray-700 leading-relaxed">
              {blockData.description}
            </p>
          </div>
        )}

        <div className="flex-1 p-4 pb-10">
          <DynamicFormRenderer
            schema={blockData.configSchema}
            initialValues={selectedBlock.config}
            onDraftChange={handleDraftChange}
            blockId={selectedBlock.id}
          />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 border-t px-4 py-5">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back
        </Button>
      </div>
    </div>
  );
}

const BlockFormHeader = ({
  onBack,
  title,
  id,
  updateBlockName,
}: {
  onBack: () => void;
  title: string;
  id: string;
  updateBlockName: (id: string, patch: Partial<DocumentBlock>) => void;
}) => {
  const [titleChanged, setTitleChanged] = useState(title);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { blocks, pushToHistory } = useDocumentStore();

  useEffect(() => {
    setTitleChanged(title);
  }, [title]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const saveChanges = () => {
    const trimmedTitle = titleChanged.trim();

    // Validation
    if (!trimmedTitle) {
      toast.error("Block name cannot be empty");
      setTitleChanged(title);
      setEditing(false);
      return;
    }

    // No changes made
    if (trimmedTitle === title) {
      setEditing(false);
      return;
    }

    // Check for duplicates (excluding current block)
    const nameExists = blocks.some(
      (block) => block.id !== id && block.name === trimmedTitle
    );

    if (nameExists) {
      const uniqueName = generateUniqueName(trimmedTitle, blocks, id);
      setTitleChanged(uniqueName);
      updateBlockName(id, { name: uniqueName });
      toast.info(`Name already exists. Renamed to "${uniqueName}"`);
    } else {
      updateBlockName(id, { name: trimmedTitle });
      toast.success("Block name updated");
    }
    pushToHistory(id);
    setEditing(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveChanges();
    } else if (e.key === "Escape") {
      setTitleChanged(title);
      setEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-white to-gray-50 sticky top-0 z-10 shadow-sm">
      <Button
        variant={"ghost"}
        onClick={onBack}
        className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
        aria-label="Back to blocks"
      >
        <ArrowLeft size={20} className="text-gray-600" />
      </Button>

      {editing ? (
        <Input
          ref={inputRef}
          value={titleChanged}
          onChange={(e) => setTitleChanged(e.target.value)}
          onBlur={saveChanges}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 text-base font-bold text-gray-900 px-2 py-1 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      ) : (
        <h2
          onClick={() => setEditing(true)}
          className="min-w-0 flex-1 text-base font-bold text-gray-900 truncate cursor-pointer hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-blue-50"
        >
          {titleChanged}
        </h2>
      )}
    </div>
  );
};

const FormErrorBoundary = ({
  error,
  onRefetch,
}: {
  error: string;
  onRefetch: () => void;
}) => (
  <div className="p-4 border border-red-200 bg-red-50 rounded-md">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm font-medium text-red-800">Form Error</span>
    </div>
    <p className="text-sm text-red-700 mb-3">{error}</p>
    {onRefetch && (
      <Button variant="outline" size="sm" onClick={onRefetch}>
        Try Again
      </Button>
    )}
  </div>
);

const EmptyFormState = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center p-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <ArrowLeft size={24} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No Configuration Available
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      This block doesn't have any configurable options.
    </p>
    <Button onClick={onBack} variant="outline">
      Back to Blocks
    </Button>
  </div>
);
