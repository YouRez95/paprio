import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: (failureCount, _error: any) => {
        // Don't retry on 4xx errors except 401
        // if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 401) {
        //   return false;
        // }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
