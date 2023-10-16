import { schemas } from "@scrooge/shared";

import notificationService from "@/features/notifications/notification.service";
import { prepareNotificationInputFromApiError } from "@/features/notifications/notification.utils";

import { useRefreshSessionMutation } from "./useRefreshSessionMutation";
import { useSessionsQuery } from "./useSessionsQuery";

export function useSessionRefresher() {
  const { mutateAsync, isLoading } = useRefreshSessionMutation();
  const { data: sessions } = useSessionsQuery();

  const refreshSession = async (
    sessionId: schemas.session.PublicSession["id"],
  ) => {
    const isSessionRefreshable = sessions.value?.sessions.find(
      ({ id }) => id === sessionId,
    )?.refreshable;

    if (!isSessionRefreshable) {
      return notificationService.pushNotification({
        title: "Couldn't refresh this session",
        body: "This session cannot be refreshed",
        type: "error",
      });
    }

    await mutateAsync(sessionId).catch((error) => {
      notificationService.pushNotification(
        prepareNotificationInputFromApiError(error),
      );
    });
  };

  return {
    refreshSession,
    isLoading,
  };
}
