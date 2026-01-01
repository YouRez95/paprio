import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApi";

import { projectsServices } from "@/services/projects";
import { toast } from "sonner";
import type { GetProjectsInput } from "@/types/project.types";

export const queryKeysProjects = {
  prjects: ({ limit, page, search, tag }: GetProjectsInput) => [
    "projects",
    limit,
    page,
    search,
    tag,
  ],

  singleProject: (projectId: string) => ["project", projectId],
};

export function showErrorToast(error: any, fallbackMessage?: string) {
  // Extract backend message (keep it as-is)
  let message =
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage ||
    "Something went wrong";

  const status = error?.response?.status;

  // Determine variant based on status (design only)
  let bg = "#fff5f5"; // default light red
  let border = "#ffcccc";
  let text = "#b00020";

  if (status === 409) {
    bg = "#fffaf0";
    border = "#ffe4b3";
    text = "#b36b00";
  } else if (status === 403) {
    bg = "#fdf3f5";
    border = "#f5c2cd";
    text = "#8a2a36";
  } else if (status === 500) {
    bg = "#f4f4ff";
    border = "#d6d6ff";
    text = "#2a2a7f";
  }

  toast("Error", {
    description: message,
    duration: 3500,
    style: {
      backgroundColor: bg,
      color: text,
      border: `1px solid ${border}`,
      borderRadius: "12px",
      padding: "14px 16px",
      fontWeight: 500,
      boxShadow: "0 2px 6px rgba(0,0,0,0.05), 0 4px 10px rgba(0,0,0,0.03)",
    },
  });
}

export const useGetProjects = (queryData: GetProjectsInput) => {
  const apiClient = useApiClient();
  const projectsApi = projectsServices(apiClient);

  return useQuery({
    queryKey: queryKeysProjects.prjects(queryData),
    queryFn: () => projectsApi.getProjects(queryData),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: (prev) => prev,
  });
};

export const useGetFiveProjects = (searchTerm: string) => {
  const apiClient = useApiClient();
  const projectsApi = projectsServices(apiClient);

  return useQuery({
    queryKey: queryKeysProjects.prjects({
      limit: 5,
      page: 1,
      search: searchTerm,
      tag: "",
    }),
    queryFn: () => projectsApi.getFiveProjects(searchTerm),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    placeholderData: (prev) => prev,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCreateProject = () => {
  const apiClient = useApiClient();
  const projectsApi = projectsServices(apiClient);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({
        queryKey: ["projects"],
        exact: false,
      });
    },
    onError: (error: any) => showErrorToast(error, "Failed to create project"),
  });
};

export const useGetProjectById = (projectId: string | undefined) => {
  const apiClient = useApiClient();
  const projectsApi = projectsServices(apiClient);

  return useQuery({
    queryKey: queryKeysProjects.singleProject(projectId as string),
    queryFn: () => projectsApi.getProjectById(projectId as string),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    placeholderData: (prev) => prev,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!projectId,
  });
};
