import { apiClient, type ApiClient } from "../apiClient";

export function useApi(): { api: ApiClient } {
  return { api: apiClient };
}

// Keep backward-compatible alias
export const useActor = useApi;
