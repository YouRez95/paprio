import type { AxiosInstance } from "axios";
import { handleApiRequest } from "./apiLayer";
import type { ApiResponse } from "@/types/api.types";
import type {
  CreateDocumentInput,
  DocumentCreated,
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
});
