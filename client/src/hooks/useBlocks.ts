import { useApiClient } from "./useApi";
import { useQuery } from "@tanstack/react-query";

import { blocksServices } from "@/services/blocks";

export const queryKeysBlocks = {
  blocksByType: (type: string, search: string) => ["blocks", type, search],
  blockById: (id: string) => ["blocks", id],
};

export const useGetBlocksByType = (type: string, search?: string) => {
  const apiClient = useApiClient();
  const blocksApi = blocksServices(apiClient);

  return useQuery({
    queryKey: queryKeysBlocks.blocksByType(type, search ?? ""),
    queryFn: () => blocksApi.getBlocksByType(type, search),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: (prev) => prev,
  });
};

export const useGetBlockById = (blockId: string) => {
  const apiClient = useApiClient();
  const blocksApi = blocksServices(apiClient);

  return useQuery({
    queryKey: queryKeysBlocks.blockById(blockId),
    queryFn: () => blocksApi.getBlockById(blockId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: !!blockId,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: (prev) => prev,
  });
};
