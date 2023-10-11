import apiClient from "@/services/api-client/api-client";
import { schemas } from "@scrooge/shared";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export function useRefresh(sessionId: schemas.session.PublicSession["id"]) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.session.refreshSession(sessionId),
    onSuccess(data) {
      const sessionsCacheData =
        queryClient.getQueryData<schemas.session.GetSessionsResponse>([
          "sessions",
        ]);

      if (!sessionsCacheData) return;
      const { sessions, current } = sessionsCacheData;

      const updatedSessions = sessions.map((session) => {
        if (session.id !== sessionId) {
          return session;
        }

        return {
          ...session,
          expiresAt: data.expiration,
        };
      });

      queryClient.setQueryData(["sessions"], {
        sessions: updatedSessions,
        current,
      });
    },
  });
}
