import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApi";
import { tagsServices } from "@/services/tags";
import { toast } from "sonner";

const queryKeysTags = {
  all: ["tags"] as const,
};

export const useGetTags = () => {
  const apiClient = useApiClient();
  const tagsApi = tagsServices(apiClient);

  return useQuery({
    queryKey: queryKeysTags.all,
    queryFn: () => tagsApi.getTags(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCreateTag = () => {
  const apiClient = useApiClient();
  const tagsApi = tagsServices(apiClient);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagsApi.createTag,
    onSuccess: () => {
      toast.success("Tag created successfully");
      queryClient.invalidateQueries({ queryKey: queryKeysTags.all });
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
    },
  });
};

export const useToggleTag = () => {
  const apiClient = useApiClient();
  const tagsApi = tagsServices(apiClient);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagsApi.toggleTag,
    onSuccess: () => {
      toast.success("Tag updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeysTags.all });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
