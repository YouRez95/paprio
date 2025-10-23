import type { ApiResponse } from "@/types/api.types";
import type { CreateTagInput, Tag, ToggleTags } from "@/types/tag.types";
import { type AxiosInstance } from "axios";
import { handleApiRequest } from "./apiLayer";

export const tagsServices = (apiClient: AxiosInstance) => ({
  getTags: async () => {
    return handleApiRequest(apiClient.get<ApiResponse<Tag[]>>("/tags"));
  },

  createTag: async (tagData: CreateTagInput): Promise<Tag> => {
    return handleApiRequest(
      apiClient.post<ApiResponse<Tag>>("/tags/create", tagData)
    );
  },

  toggleTag: async (toggleTagsData: ToggleTags) => {
    return handleApiRequest(
      apiClient.post<ApiResponse<{ totalProjects: number }>>(
        "/tags/toggle",
        toggleTagsData
      )
    );
  },
});
