import apiClient from "@/services/api-client/api-client";
import { schemas } from "@scrooge/shared";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export function useInvalidate(sessionId: schemas.session.PublicSession["id"]) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.session.invalidateSession(sessionId),
    onMutate: (sessionId: schemas.operation.PublicOperation["id"]) => {
      const previousSessions = queryClient.getQueryData(["sessions"]);

      queryClient.setQueryData(
        ["sessions"],
        (sessionsResponse: schemas.session.GetSessionsResponse | undefined) => {
          if (!sessionsResponse) return;

          sessionsResponse.sessions = sessionsResponse?.sessions.filter(
            ({ id }) => id !== sessionId,
          );
          return sessionsResponse;
        },
      );

      return {
        previousSessions,
      };
    },
    onError(error, variables, context) {
      // rollback
      queryClient.setQueryData(["sessions"], context?.previousSessions);
    },
  });
}
