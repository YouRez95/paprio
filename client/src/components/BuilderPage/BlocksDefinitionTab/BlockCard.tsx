import { Button } from "@/components/ui/button";
import type { BlocksByType } from "@/types/block.types";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";

interface BlockCardProps {
  block: BlocksByType;
  onAdd: () => void;
  onAddWithUserConfig?: () => void;
  showUserConfigOption?: boolean;
}

export function BlockCard({
  block,
  onAdd,
  onAddWithUserConfig,
  showUserConfigOption = false,
}: BlockCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasUserConfig =
    showUserConfigOption && block.userConfig && onAddWithUserConfig;

  return (
    <div
      className={`relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-blue-300 group ${
        !hasUserConfig ? "cursor-pointer" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!hasUserConfig ? onAdd : undefined}
    >
      {/* Image Container */}
      <div className="relative bg-gray-50 aspect-[3/2] flex items-center justify-center">
        {block.thumbnailUrl && !imageError ? (
          <img
            src={import.meta.env.VITE_IMAGES_URL + block.thumbnailUrl}
            alt={block.name}
            className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded flex items-center justify-center">
            <span className="text-gray-500 text-xs text-center px-2 font-medium">
              {block.name}
            </span>
          </div>
        )}

        {/* Saved Config Indicator - Top right corner */}
        {hasUserConfig && !isHovered && (
          <div className="absolute top-2 right-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Action Buttons - Show on Hover */}
        {isHovered && (
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex justify-center pb-2 px-2 gap-1.5 ${
              hasUserConfig ? "items-end" : "items-center"
            }`}
          >
            {/* Primary Action - Icon only when userConfig exists */}
            <Button
              size={"icon"}
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className={`flex-1 h-8 cursor-pointer gap-1.5 bg-white max-w-10 hover:bg-gray-50 text-gray-900 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.02]`}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>

            {/* Secondary Action - Only if user config exists */}
            {hasUserConfig && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddWithUserConfig!();
                }}
                className="flex-1 cursor-pointer h-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-md px-2 text-[10px] font-medium transition-all duration-200 flex items-center justify-center gap-1 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <Sparkles className="w-3 h-3" />
                <span className="truncate">Yours</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
