import { Package } from "lucide-react";
import { useGetBlocksByType } from "@/hooks/useBlocks";
import { useDocumentStore } from "@/store/documentStore";
import type { BlocksByType } from "@/types/block.types";
import { BlockCard } from "./BlockCard";

interface BlockCarouselProps {
  setActiveTab: (value: string) => void;
  type: string;
  title: string;
  searchQuery?: string;
}

export function BlockCarousel({
  type,
  title,
  setActiveTab,
  searchQuery,
}: BlockCarouselProps) {
  const { data: blocksData, isLoading } = useGetBlocksByType(type, searchQuery);
  const { addBlock, setSelectedBlock, addRecentlyUsedBlock } =
    useDocumentStore();

  function handleAddBlocks(block: BlocksByType) {
    const instance = {
      blockDefId: block.id,
      name: block.name,
      config: block.defaultConfig,
    };

    addBlock(instance);
    addRecentlyUsedBlock(block);
    setSelectedBlock(null);
    setActiveTab("document");
  }

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse px-4"></div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="aspect-[3/2] bg-gray-100 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!blocksData) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
          <Package className="w-6 h-6 text-red-600" />
        </div>
        <p className="text-sm text-gray-600 font-medium">
          Failed to load {title}
        </p>
        <p className="text-xs text-gray-500 mt-1">Please try again later</p>
      </div>
    );
  }

  if (blocksData.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
          <Package className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 font-medium">
          No {title} available
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Check back later for new blocks
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="px-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {blocksData.length} block{blocksData.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Blocks */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {blocksData.map((block) => (
          <BlockCard
            key={block.id}
            block={block}
            onAdd={() => handleAddBlocks(block)}
          />
        ))}
      </div>
    </div>
  );
}
