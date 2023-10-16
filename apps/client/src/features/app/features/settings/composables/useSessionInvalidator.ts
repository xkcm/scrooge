import { schemas } from "@scrooge/shared";
import { useRouter } from "vue-router";

import authService from "@/features/auth/auth.service";
import notificationService from "@/features/notifications/notification.service";
import { prepareNotificationInputFromApiError } from "@/features/notifications/notification.utils";

import { useInvalidateSessionMutation } from "./useInvalidateSessionMutation";
import { useSessionsQuery } from "./useSessionsQuery";

export function useSessionInvalidator() {
  const { mutateAsync, isLoading } = useInvalidateSessionMutation();
  const { data: sessions } = useSessionsQuery();
  const router = useRouter();

  const invalidateSession = async (
    sessionId: schemas.session.PublicSession["id"],
  ) => {
    await mutateAsync(sessionId).catch((error) => {
      notificationService.pushNotification(
        prepareNotificationInputFromApiError(error),
      );
    });

    notificationService.pushNotification({
      title: "Session invalidated",
      type: "info",
    });

    if (sessionId === sessions.value?.current) {
      return await authService.logOut();
    }

    router.push({ name: "sessions" });
  };

  return {
    invalidateSession,
    isLoading,
  };
}
