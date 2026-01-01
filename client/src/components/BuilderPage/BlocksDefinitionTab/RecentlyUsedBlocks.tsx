import { useDocumentStore } from "@/store/documentStore";
import { Clock } from "lucide-react";
import { BlockCard } from "./BlockCard";
import type { BlocksByType } from "@/types/block.types";

type RecentlyUsedBlocksProps = {
  setActiveTab: (value: string) => void;
};

export function RecentlyUsedBlocks({ setActiveTab }: RecentlyUsedBlocksProps) {
  const { recentlyUsedBlocks, addBlock, setSelectedBlock } = useDocumentStore();

  function handleAddBlocks(block: BlocksByType, useUserConfig = false) {
    const configToUse =
      useUserConfig && block.userConfig
        ? block.userConfig
        : block.defaultConfig;

    const instance = {
      blockDefId: block.id,
      name: block.name,
      config: configToUse,
    };

    addBlock(instance);
    setSelectedBlock(null);
    setActiveTab("document");
  }

  return (
    <div className="border-b border-gray-100 pb-4 pt-4">
      <div className="px-4 mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900">Recently Used</h3>
      </div>
      <div className="max-h-56 overflow-y-auto">
        <div className="px-4">
          <div className="grid grid-cols-2 gap-3">
            {recentlyUsedBlocks && recentlyUsedBlocks.length > 0 ? (
              recentlyUsedBlocks.map((block) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  onAdd={() => handleAddBlocks(block, false)}
                  onAddWithUserConfig={() => handleAddBlocks(block, true)}
                  showUserConfigOption={true} // Enable user config feature
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-2">
                No recently used blocks.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
