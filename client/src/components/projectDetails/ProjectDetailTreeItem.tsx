import type { ProjectTreeNode } from "@/types/project.types";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectDetailItemMenu from "./ProjectDetailItemMenu";
import { RenameModal } from "./modals/RenameModal";
import CreateFolderModal from "./modals/CreateFolderModal";
import CreateDocumentModal from "./modals/CreateDocumentModal";
import { DeleteModal } from "./modals/DeleteModal";

type ModalState<T extends Record<string, any>> = T & { isOpen: boolean };

type FolderModalState = ModalState<{
  parentId: string;
  parentName: string;
}>;

type DocumentModalState = ModalState<{
  parentId: string;
  parentName: string;
}>;

type RenameModalState = ModalState<{
  itemId: string;
  itemType: "file" | "folder";
  currentName: string;
}>;

// Constants
const INITIAL_FOLDER_MODAL_STATE: FolderModalState = {
  isOpen: false,
  parentId: "",
  parentName: "",
};

const INITIAL_DOCUMENT_MODAL_STATE: DocumentModalState = {
  isOpen: false,
  parentId: "",
  parentName: "",
};

const INITIAL_RENAME_MODAL_STATE: RenameModalState = {
  isOpen: false,
  itemId: "",
  itemType: "file",
  currentName: "",
};

type TreeItemProps = {
  node: ProjectTreeNode;
  level?: number;
  searchQuery: string;
};

const ANIMATION_CONFIG = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2, ease: "easeInOut" },
} as const;

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export const ProjectDetailTreeItem = ({
  node,
  level = 0,
  searchQuery,
}: TreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFolder = node.type === "folder";
  const hasChildren = isFolder && node.subChild?.length;
  const [createFolderModal, setCreateFolderModal] = useState<FolderModalState>(
    INITIAL_FOLDER_MODAL_STATE
  );
  const [deleteModal, setDeleteModal] = useState<RenameModalState>(
    INITIAL_RENAME_MODAL_STATE
  );
  const [createDocumentModal, setCreateDocumentModal] =
    useState<DocumentModalState>(INITIAL_DOCUMENT_MODAL_STATE);
  const [renameModal, setRenameModal] = useState<RenameModalState>(
    INITIAL_RENAME_MODAL_STATE
  );

  const handleRename = (
    id: string,
    type: "file" | "folder",
    currentName: string
  ) => {
    setRenameModal({
      isOpen: true,
      itemId: id,
      itemType: type,
      currentName: currentName,
    });
  };

  const handleDelete = (
    id: string,
    type: "file" | "folder",
    currentName: string
  ) => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemType: type,
      currentName: currentName,
    });
  };

  const handleCreateFolder = (id: string, currentName: string) => {
    setCreateFolderModal({
      isOpen: true,
      parentId: id,
      parentName: currentName,
    });
  };

  const handleCreateDocument = (id: string, currentName: string) => {
    setCreateDocumentModal({
      isOpen: true,
      parentId: id,
      parentName: currentName,
    });
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) setIsExpanded(!isExpanded);
  };

  // Search highlighting
  const showNode =
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.subChild?.some((child) =>
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (!showNode && searchQuery) return null;

  return (
    <>
      <div
        className={` flex justify-between items-center px-3 hover:bg-gray-100 cursor-pointer transition-all duration-200 group relative rounded-lg`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        role="treeitem"
        aria-expanded={isFolder ? isExpanded : undefined}
      >
        <div
          className="flex items-center gap-2 py-2 my-0.5 flex-1"
          onClick={toggleExpand}
        >
          {/* Expand/Collapse Button */}
          {isFolder && (
            <button
              onClick={toggleExpand}
              className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
              aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          {!isFolder && <div className="w-6 flex-shrink-0" />}
          {/* Icon */}
          {isFolder ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )
          ) : (
            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}
          {/* Name with search highlighting */}
          <span className="text-sm text-gray-900 flex-1 truncate">
            {searchQuery ? highlightMatch(node.name, searchQuery) : node.name}
          </span>
        </div>
        {/* Actions */}

        <ProjectDetailItemMenu
          id={node.id}
          type={node.type}
          name={node.name}
          onRename={handleRename}
          onCreateFolder={handleCreateFolder}
          onCreateDocument={handleCreateDocument}
          onDelete={handleDelete}
        />
      </div>

      {/* Children */}
      <AnimatePresence>
        {isFolder && isExpanded && hasChildren && (
          <motion.div {...ANIMATION_CONFIG} role="group">
            {node.subChild?.map((child) => (
              <ProjectDetailTreeItem
                key={child.id}
                node={child}
                level={level + 1}
                searchQuery={searchQuery}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <RenameModal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal({ ...renameModal, isOpen: false })}
        itemId={renameModal.itemId}
        currentName={renameModal.currentName}
        type={renameModal.itemType}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        itemId={deleteModal.itemId}
        type={deleteModal.itemType}
        itemName={deleteModal.currentName}
      />

      <CreateFolderModal
        projectName={node.name}
        parentFolderId={createFolderModal.parentId}
        parentFolderName={createFolderModal.parentName}
        isOpen={createFolderModal.isOpen}
        setIsOpen={(open) =>
          setCreateFolderModal({ ...createFolderModal, isOpen: open })
        }
      />

      <CreateDocumentModal
        projectName={node.name}
        folderId={createDocumentModal.parentId}
        isOpen={createDocumentModal.isOpen}
        setIsOpen={(open) =>
          setCreateDocumentModal({ ...createDocumentModal, isOpen: open })
        }
      />
    </>
  );
};
