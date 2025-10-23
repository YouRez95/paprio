export type FolderData = {
  id: string;
  name: string;
  parentFolderId: string | null;
};
export type DocumentData = {
  id: string;
  title: string;
  folderId: string | null;
};

export type TreeNode = {
  id: string;
  name: string;
  type: "folder" | "file";
  expanded?: boolean;
  subChild?: TreeNode[];
};

// Build folder tree recursively
export function buildProjectTree(
  folders: FolderData[],
  documents: DocumentData[],
  parentId: string | null = null
): TreeNode[] {
  return folders
    .filter((folder) => folder.parentFolderId === parentId)
    .map((folder) => ({
      id: folder.id,
      name: folder.name,
      type: "folder",
      subChild: [
        ...buildProjectTree(folders, documents, folder.id),
        ...documents
          .filter((doc) => doc.folderId === folder.id)
          .map((doc) => ({
            id: doc.id,
            name: doc.title,
            type: "file" as const,
          })),
      ].sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      }),
    }));
}
