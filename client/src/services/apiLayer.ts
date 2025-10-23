import type { ApiResponse } from "@/types/api.types";
import axios from "axios";

export async function handleApiRequest<T>(
  request: Promise<{ data: ApiResponse<T> }>
): Promise<T> {
  try {
    const { data } = await request;

    if (data.status !== "success") {
      throw new Error(data.message || "Request failed");
    }

    return data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Network error occurred"
      );
    }
    throw error;
  }
}
