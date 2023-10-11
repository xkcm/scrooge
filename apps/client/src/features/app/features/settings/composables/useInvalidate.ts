import apiClient from "@/services/api-client/api-client";
import { schemas } from "@scrooge/shared";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export function useInvalidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: schemas.session.PublicSession["id"]) =>
      apiClient.session.invalidateSession(sessionId),

    onMutate: (sessionId: schemas.operation.PublicOperation["id"]) => {
      const previousSessions = queryClient.getQueryData(["sessions"]);

      queryClient.setQueryData(
        ["sessions"],
        (
          sessionsQueryData: schemas.session.GetSessionsResponse | undefined,
        ) => {
          if (!sessionsQueryData) return;

          return {
            sessions: sessionsQueryData.sessions.filter(
              ({ id }) => id !== sessionId,
            ),
            current: sessionsQueryData.current,
          };
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
