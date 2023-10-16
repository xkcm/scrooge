import { useQuery } from "@tanstack/vue-query";

import apiClient from "@/services/api-client/api-client";

export function useSessionsQuery() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: apiClient.session.getActiveSessions,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
