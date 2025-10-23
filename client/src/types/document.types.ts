export interface CreateDocumentInput {
  title: string;
  projectId: string;
  folderId: string | null;
}

export interface DocumentCreated {
  title: string;
  projectId: string;
  folderId: string | null;
  id: string;
}
