import { toast } from "sonner";
import { useApiClient } from "./useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "./useProjects";
import { documentsServices } from "@/services/documents";
import type { CreateDocumentInput } from "@/types/document.types";

export const useCreateDocument = () => {
  const apiClient = useApiClient();
  const documentApi = documentsServices(apiClient);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, folderId, title }: CreateDocumentInput) =>
      documentApi.createDocument({ projectId, folderId, title }),
    onSuccess: (_, variables) => {
      const { projectId } = variables;
      toast.success("Document created successfully");
      // queryClient.invalidateQueries({
      //   queryKey: ["folders"],
      //   exact: false,
      // });

      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      // queryClient.invalidateQueries({
      //   queryKey: ["projects"],
      //   exact: false,
      // });
    },
    onError: (error: any) => showErrorToast(error, "Failed to create document"),
  });
};
