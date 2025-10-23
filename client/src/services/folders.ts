import type { AxiosInstance } from "axios";
import { handleApiRequest } from "./apiLayer";
import type { ApiResponse } from "@/types/api.types";
import type { CreateFolderInput, Folder } from "@/types/folder.types";
import type { DocumentCreated } from "@/types/document.types";

export const foldersServices = (apiClient: AxiosInstance) => ({
  createFolder: async (folderData: CreateFolderInput) => {
    return handleApiRequest(
      apiClient.post<ApiResponse<Folder>>("/folders/create", folderData)
    );
  },

  renameFolderOrFile: async ({
    itemId,
    newName,
    type,
  }: {
    itemId: string;
    newName: string;
    type: "folder" | "file";
  }) => {
    return handleApiRequest(
      apiClient.patch<ApiResponse<Folder | DocumentCreated>>(
        `/folders/rename/${itemId}`,
        { newName, type }
      )
    );
  },

  softDeleteFolderOrFile: async ({
    name,
    itemId,
    type,
  }: {
    name: string;
    itemId: string;
    type: "folder" | "file";
  }) => {
    return handleApiRequest(
      apiClient.patch<ApiResponse<Folder | DocumentCreated>>(
        `/folders/soft-delete/${itemId}`,
        { type, name }
      )
    );
  },
});
