import { Search } from "lucide-react";
import CreateFolderModal from "./modals/CreateFolderModal";
import { useState } from "react";
import CreateDocumentModal from "./modals/CreateDocumentModal";

type ProjectDetailToolbarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  projectName: string;
};

export default function ProjectDetailToolbar({
  searchQuery,
  setSearchQuery,
  projectName,
}: ProjectDetailToolbarProps) {
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false);
  const [openCreateFileModal, setOpenCreateFileModal] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <CreateDocumentModal
          isOpen={openCreateFileModal}
          setIsOpen={setOpenCreateFileModal}
          projectName={projectName}
          folderId={null}
        />

        <CreateFolderModal
          isOpen={openCreateFolderModal}
          setIsOpen={setOpenCreateFolderModal}
          projectName={projectName}
          parentFolderId={null}
        />
      </div>
    </div>
  );
}
