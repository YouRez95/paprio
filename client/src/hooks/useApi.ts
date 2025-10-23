import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useMemo } from "react";

export const useApiClient = () => {
  const { getToken } = useAuth();

  // useMemo is STILL needed here because React Compiler can't optimize side effects
  return useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000,
    });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return instance;
  }, [getToken]);
};
