import type { LatexPageConfig } from "@/store/latexPageConfigStore";
import type { ProjectRole } from "./project.types";

export interface CreateDocumentInput {
  title: string;
  projectId: string;
  folderId: string | null;
}

export interface UpdateDocumentNameInput {
  newName: string;
  documentId: string;
}

export interface DocumentCreated {
  title: string;
  projectId: string;
  folderId: string | null;
  id: string;
}

export interface DocumentBlockFromApi {
  id: string;
  createdAt: Date;
  name: string;
  order: number;
  blockDefId: string;
  config: Record<string, any>;
  blockDefinition: {
    name: string;
    description: string | null;
    thumbnailUrl: string | null;
    defaultConfig: Record<string, any>;
  };
}

export interface Document {
  id: string;
  title: string;
  pdfUrl: string | null;
  blocks: DocumentBlockFromApi[];
  role: ProjectRole;
  hasPermissionToEdit: boolean;
  latexConfig: LatexPageConfig;
}

interface ChangedBlock {
  id: string;
  blockDefId: string;
  config: Record<string, any>;
  order: number;
  name: string;
}

export interface CompileDocumentInput {
  added: ChangedBlock[];
  updated: ChangedBlock[];
  removed: string[];
  orderUpdates: { id: string; order: number }[];
  documentId: string;
  latexPageConfig?: LatexPageConfig;
  savePdf?: boolean;
}

export interface CompileDocumentResponse {
  size: number;
  success: boolean;
  expiresIn?: number;
  pdfUrl?: string;
  pdfBuffer?: string;
}

export interface DocumentVersion {
  pdfUrl: string;
  id: string;
  documentId: string;
  title: string;
  version: number;
  createdAt: string;
  isCurrentUser: boolean;
  note: string | null;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}
