type Folder = { id: string; name: string; parentFolderId?: string | null };
type Document = { id: string; title: string; folderId: string | null };

type NestedFolder = {
  id: string;
  name: string;
  folders: NestedFolder[];
  documents: Document[];
};

export type NestedProject = {
  id: string;
  name: string;
  folders: NestedFolder[];
  documents: Document[];
};

export function buildFolderTree(
  allFolders: Folder[],
  allDocuments: Document[],
  parentId: string | null = null
): NestedFolder[] {
  return allFolders
    .filter((folder) => folder.parentFolderId === parentId)
    .map((folder) => {
      const nestedDocs = allDocuments
        .filter((doc) => doc.folderId === folder.id)
        .map((doc) => ({
          id: doc.id,
          title: doc.title,
          folderId: doc.folderId,
        }));

      return {
        id: folder.id,
        name: folder.name,
        folders: buildFolderTree(allFolders, allDocuments, folder.id),
        documents: nestedDocs,
      };
    });
}
