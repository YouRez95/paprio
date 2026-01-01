import { useApiClient } from "./useApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsServices } from "@/services/documents";
import type {
  CompileDocumentInput,
  CreateDocumentInput,
} from "@/types/document.types";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";

const queryKeyDocuments = {
  document: (documentId: string) => ["document", documentId],
  versions: (documentId: string) => ["document", documentId, "versions"],
};

export const useCreateDocument = () => {
  const apiClient = useApiClient();
  const documentApi = documentsServices(apiClient);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, folderId, title }: CreateDocumentInput) =>
      documentApi.createDocument({ projectId, folderId, title }),
    onSuccess: (_, variables) => {
      const { projectId } = variables;
      showSuccessToast({
        message: "Document created successfully",
      });
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
    onError: (error: any) =>
      showErrorToast({ error, fallbackMessage: "Failed to create document" }),
  });
};

export const useUpdateDocumentName = () => {
  const apiClient = useApiClient();
  const documentApi = documentsServices(apiClient);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { documentId: string; newName: string }) =>
      documentApi.updateDocumentName(data),
    onSuccess: (_, variables) => {
      const { documentId } = variables;
      showSuccessToast({
        message: "Document name updated successfully",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyDocuments.document(documentId),
      });
    },
    onError: (error: any) =>
      showErrorToast({ error, fallbackMessage: "Failed to update document" }),
  });
};

export const useCreateDocumentVersion = () => {
  const apiClient = useApiClient();
  const documentApi = documentsServices(apiClient);

  return useMutation({
    mutationFn: ({ documentId, note }: { documentId: string; note?: string }) =>
      documentApi.createDocumentVersion({ documentId, note }),
    onSuccess: (_, __) => {
      // TODO: Invalidate the document query to fetch the latest version
      showSuccessToast({
        message: "Document version created successfully",
      });
    },
    onError: (error: any) =>
      showErrorToast({
        error,
        fallbackMessage: "Failed to create document version",
      }),
  });
};

export const useGetDocumentVersions = (documentId: string) => {
  const apiClient = useApiClient();
  const documentApi = documentsServices(apiClient);

  return useQuery({
    queryKey: queryKeyDocuments.versions(documentId),
    queryFn: () => documentApi.getDocumentVersions(documentId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: (prev) => prev,
    enabled: !!documentId,
  });
};

export const useGetDocumentById = (documentId: string) => {
  const apiClient = useApiClient();
  const documentApi = documentsServices(apiClient);

  return useQuery({
    queryKey: queryKeyDocuments.document(documentId),
    queryFn: () => documentApi.getDocumentById(documentId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: (prev) => prev,
    enabled: !!documentId,
  });
};

export const useCompileDocument = () => {
  const apiClient = useApiClient();
  const documentApi = documentsServices(apiClient);
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompileDocumentInput) =>
      documentApi.compileDocument(data),
    onSuccess: (_, __) => {
      // const { projectId } = variables;
      showSuccessToast({
        message: "Document compiled successfully",
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["folders"],
      //   exact: false,
      // });

      // queryClient.invalidateQueries({
      //   queryKey: ["project", projectId],
      // });

      // queryClient.invalidateQueries({
      //   queryKey: ["projects"],
      //   exact: false,
      // });
    },
    onError: (error: any) =>
      showErrorToast({ error, fallbackMessage: "Failed to compile document" }),
  });
};
