export interface CreateFolderInput {
  folderName: string;
  projectId: string;
  parentFolderId: string | null;
}

export interface Folder {
  projectId: string;
  parentFolderId: string | null;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
