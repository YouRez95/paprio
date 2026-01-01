import { Search, X } from "lucide-react";
import { useState } from "react";
import { BlockCarousel } from "./BlockCarousel";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { RecentlyUsedBlocks } from "./RecentlyUsedBlocks";

type FileEditorBlocksProps = {
  setActiveTab: (value: string) => void;
};

// Mock data for block types - replace with your actual data structure
const BLOCK_TYPES = [
  { id: "all", label: "All", value: "ALL" },
  { id: "box", label: "Boxes", value: "BOX" },
  { id: "table", label: "Tables", value: "TABLE" },
  { id: "figure", label: "Figures", value: "FIGURE" },
  { id: "text", label: "Text", value: "TEXT" },
];

export default function FileEditorBlocks({
  setActiveTab,
}: FileEditorBlocksProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header with Search */}
      <div className="flex-shrink-0 px-4 pt-5 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Blocks</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search blocks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          {searchQuery && (
            <Button
              onClick={handleClearSearch}
              variant="ghost"
              size={"sm"}
              className="absolute right-0 cursor-pointer top-1/2 -translate-y-1/2 text-secondary-foreground hover:bg-transparent transition-color"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Block Type Filters */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {BLOCK_TYPES.map((type) => (
            <Button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                selectedType === type.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-primary/5 hover:bg-primary/5"
              }`}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Scrollable Content with Block Categories */}
      <div className="flex-1 overflow-y-auto">
        {/* Recently Used Section */}
        <div className="bg-accent border-y">
          <RecentlyUsedBlocks setActiveTab={setActiveTab} />
        </div>

        {/* All Blocks or Filtered by Type */}
        <div className="py-4">
          <BlockCarousel
            searchQuery={debouncedSearchTerm}
            setActiveTab={setActiveTab}
            type={
              BLOCK_TYPES.find((t) => t.id === selectedType)?.value || "BOX"
            }
            title={
              BLOCK_TYPES.find((t) => t.id === selectedType)?.label || "Blocks"
            }
          />
        </div>
      </div>
    </div>
  );
}
