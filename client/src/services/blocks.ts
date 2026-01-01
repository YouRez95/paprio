import type { AxiosInstance } from "axios";
import { handleApiRequest } from "./apiLayer";
import type { ApiResponse } from "@/types/api.types";
import type { BlockById, BlocksByType } from "@/types/block.types";

export const blocksServices = (apiClient: AxiosInstance) => ({
  getBlocksByType: async (type: string, search?: string) => {
    return handleApiRequest(
      apiClient.get<ApiResponse<BlocksByType[]>>(
        "/blocks/" +
          encodeURIComponent(type) +
          (search ? `?search=${encodeURIComponent(search)}` : "")
      )
    );
  },

  getBlockById: async (blockId: string) => {
    return handleApiRequest(
      apiClient.get<ApiResponse<BlockById | null>>(
        "/blocks/block/" + encodeURIComponent(blockId)
      )
    );
  },
});
