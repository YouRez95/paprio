import type { AxiosInstance } from "axios";
import { handleApiRequest } from "./apiLayer";
import type { ApiResponse } from "@/types/api.types";
import type {
  CreateProjectInput,
  GetProjectsInput,
  GetProjects,
  NestedProjects,
  Project,
  GetProjectById,
} from "@/types/project.types";

export const projectsServices = (apiClient: AxiosInstance) => ({
  getProjects: async ({ limit, page, search, tag = "" }: GetProjectsInput) => {
    return handleApiRequest(
      apiClient.get<ApiResponse<GetProjects>>(
        `/projects?limit=${limit}&page=${page}&search=${search}&tag=${tag}`
      )
    );
  },

  createProject: async (projectData: CreateProjectInput) => {
    return handleApiRequest(
      apiClient.post<ApiResponse<Project>>("/projects/create", projectData)
    );
  },

  getFiveProjects: async (searchTerm: string) => {
    return handleApiRequest(
      apiClient.get<ApiResponse<NestedProjects[]>>(
        `/projects/five/search?search=${encodeURIComponent(searchTerm)}`
      )
    );
  },

  getProjectById: async (projectId: string) => {
    return handleApiRequest(
      apiClient.get<ApiResponse<GetProjectById>>(
        `/projects/single/${projectId}`
      )
    );
  },
});
