import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useDocumentStore } from "@/store/documentStore";
import { GripVertical, PlusCircle, Trash } from "lucide-react";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import BlockForm from "./BlockForm";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { DeleteBlockModal } from "./DeleteBlockModal";

export default function FileEditorDocumentBlocks() {
  const [deleteBlock, setDeleteBlock] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const {
    blocks,
    setSelectedBlock,
    selectedBlock,
    reorderBlocks,
    lastChangedBlockId,
    clearLastChangedBlock,
  } = useDocumentStore();

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);

    reorderBlocks(arrayMove(blocks, oldIndex, newIndex));
  };

  useEffect(() => {
    if (!lastChangedBlockId) return;
    const t = setTimeout(clearLastChangedBlock, 1200);
    return () => clearTimeout(t);
  }, [lastChangedBlockId]);

  return (
    <>
      <div
        className={`overflow-y-auto h-full scrollbar-hide ${
          selectedBlock ? "px-0" : "px-4"
        }`}
      >
        {/* Header when no block selected */}
        {!selectedBlock && (
          <>
            <div className="mb-5">
              <h1 className="font-semibold text-xl tracking-tight">Blocks</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Click a block to edit or drag to reorder
              </p>
            </div>
            <Separator className="mb-4" />
          </>
        )}

        {/* Block List */}
        {!selectedBlock && (
          <>
            {blocks.length === 0 && (
              <div className="text-sm text-muted-foreground p-4 rounded-lg bg-muted/40 border-2 border-dashed border-muted-foreground/20 flex items-center gap-3 transition-colors hover:bg-muted/60 hover:border-muted-foreground/30">
                <PlusCircle size={18} className="text-muted-foreground/60" />
                <span>Add your first block to get started</span>
              </div>
            )}

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {blocks.map((block) => {
                    const isChanged = lastChangedBlockId === block.id;
                    // console.log(
                    //   "lastChangedBlockId:",
                    //   lastChangedBlockId,
                    //   "block.id:",
                    //   block.id,
                    //   "isChanged:",
                    //   isChanged
                    // );

                    return (
                      <SortableItem key={block.id} id={block.id}>
                        {({ setNodeRef, style, listeners, attributes }) => (
                          <div ref={setNodeRef} style={style}>
                            <div
                              className={`
                                flex items-center justify-between group w-full text-left px-3 py-1.5 rounded-lg cursor-pointer 
                                bg-primary text-primary-foreground transition-all duration-300
                                ${
                                  isChanged
                                    ? "animate-pulse-scale ring-2 ring-yellow-400 shadow-lg"
                                    : ""
                                }
                              `}
                              onClick={() => setSelectedBlock(block)}
                            >
                              <span className="flex items-center gap-2 text-sm font-medium">
                                {block.name}
                              </span>

                              <div className="flex items-center justify-end gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 hover:bg-primary-foreground rounded-md transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteBlock({
                                      id: block.id,
                                      name: block.name,
                                    });
                                  }}
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  {...listeners}
                                  {...attributes}
                                  className="h-7 w-7 p-0 hover:bg-primary-foreground rounded-md transition-colors cursor-grab active:cursor-grabbing"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <GripVertical className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </SortableItem>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}

        {/* Block Edit Form */}
        {selectedBlock && <BlockForm />}
      </div>

      {/* Delete Block Confirmation Modal */}
      <DeleteBlockModal
        deleteBlock={deleteBlock}
        setDeleteBlock={setDeleteBlock}
      />

      {/* CSS for pulse-scale animation */}
      <style>{`
        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        .animate-pulse-scale {
          animation: pulse-scale 0.6s ease-in-out 2;
        }
      `}</style>
    </>
  );
}

type SortableHelpers = ReturnType<typeof useSortable>;

interface SortableItemProps {
  id: string;
  children: (props: {
    setNodeRef: SortableHelpers["setNodeRef"];
    style: CSSProperties;
    attributes: SortableHelpers["attributes"];
    listeners: SortableHelpers["listeners"];
  }) => ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <>{children({ setNodeRef, style, attributes, listeners })}</>;
}
