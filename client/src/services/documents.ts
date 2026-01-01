import type { AxiosInstance } from "axios";
import { handleApiRequest } from "./apiLayer";
import type { ApiResponse } from "@/types/api.types";
import type {
  CompileDocumentInput,
  CompileDocumentResponse,
  CreateDocumentInput,
  Document,
  DocumentCreated,
  DocumentVersion,
  UpdateDocumentNameInput,
} from "@/types/document.types";

export const documentsServices = (apiClient: AxiosInstance) => ({
  createDocument: async (folderData: CreateDocumentInput) => {
    return handleApiRequest(
      apiClient.post<ApiResponse<DocumentCreated>>(
        "/documents/create",
        folderData
      )
    );
  },

  updateDocumentName: async (inputs: UpdateDocumentNameInput) => {
    return handleApiRequest(
      apiClient.post<ApiResponse<DocumentCreated>>(
        `/documents/update-name/${inputs.documentId}`,
        { newName: inputs.newName }
      )
    );
  },

  getDocumentById: async (documentId: string) => {
    return handleApiRequest(
      apiClient.get<ApiResponse<Document>>(`/documents/full/${documentId}`)
    );
  },

  compileDocument: async (documentBlocks: CompileDocumentInput) => {
    const { documentId, ...rest } = documentBlocks;
    return handleApiRequest(
      apiClient.post<ApiResponse<CompileDocumentResponse>>(
        `/documents/compile/${documentId}`,
        rest
      )
    );
  },

  createDocumentVersion: async ({
    documentId,
    note,
  }: {
    documentId: string;
    note?: string;
  }) => {
    return handleApiRequest(
      apiClient.post<ApiResponse<{ version: number }>>(
        `/documents/version/${documentId}`,
        { note }
      )
    );
  },

  getDocumentVersions: async (documentId: string) => {
    return handleApiRequest(
      apiClient.get<ApiResponse<DocumentVersion[]>>(
        `/documents/versions/${documentId}`
      )
    );
  },
});
