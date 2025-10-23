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
  let errorMessage = fallbackMessage || "Something went wrong";

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  toast("Error", {
    description: errorMessage,
    style: {
      backgroundColor: "#900",
      color: "white",
      border: "1px solid #f00",
      fontWeight: "bold",
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
