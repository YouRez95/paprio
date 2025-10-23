import { toast } from "sonner";
import { useApiClient } from "./useApi";
import { foldersServices } from "@/services/folders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysProjects, showErrorToast } from "./useProjects";
import type { CreateFolderInput } from "@/types/folder.types";

export const useCreateFolder = () => {
  const apiClient = useApiClient();
  const foldersApi = foldersServices(apiClient);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      folderName,
      parentFolderId,
      projectId,
    }: CreateFolderInput) =>
      foldersApi.createFolder({ folderName, parentFolderId, projectId }),
    onSuccess: (_, variables) => {
      const { projectId } = variables;
      toast.success("folder created successfully");

      queryClient.invalidateQueries({
        queryKey: queryKeysProjects.singleProject(projectId),
      });
    },
    onError: (error: any) => showErrorToast(error, "Failed to create folder"),
  });
};

export const useRenameFolderOrFile = () => {
  const apiClient = useApiClient();
  const foldersApi = foldersServices(apiClient);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      itemId: string;
      newName: string;
      type: "file" | "folder";
      projectId: string;
    }) => foldersApi.renameFolderOrFile(data),
    onSuccess: (_, variables) => {
      const { type, projectId } = variables;
      toast.success(
        type === "folder"
          ? "Folder renamed successfully"
          : "File renamed successfully"
      );
      queryClient.invalidateQueries({
        queryKey: queryKeysProjects.singleProject(projectId),
      });
    },
    onError: (error: any) => showErrorToast(error, "Failed to rename item"),
  });
};

export const useSoftDeleteFolderOrFile = () => {
  const apiClient = useApiClient();
  const foldersApi = foldersServices(apiClient);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      itemId: string;
      name: string;
      type: "file" | "folder";
      projectId: string;
    }) => foldersApi.softDeleteFolderOrFile(data),
    onSuccess: (_, variables) => {
      const { type, projectId } = variables;
      toast.success(
        type === "folder"
          ? "Folder moved to trash successfully"
          : "File moved to trash successfully"
      );
      queryClient.invalidateQueries({
        queryKey: queryKeysProjects.singleProject(projectId),
      });
    },
    onError: (error: any) => showErrorToast(error, "Failed to delete item"),
  });
};
