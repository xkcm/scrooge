import { schemas } from "@scrooge/shared";
import { Router } from "vue-router";

import authService from "@/features/auth/auth.service";

import notificationService from "@/features/notifications/notification.service";
import { prepareNotificationInputFromApiError } from "@/features/notifications/notification.utils";

export const buildOpenStreetMapsLink = (coordinates: number[]) =>
  `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    coordinates.join(","),
  )}`;

export const refreshSession = async (
  sessionId: schemas.session.PublicSession["id"],
  isSessionRefreshable: boolean,
  { mutate }: { mutate: (sessionId: string) => Promise<any> },
) => {
  if (!isSessionRefreshable) {
    return notificationService.pushNotification({
      title: "Couldn't refresh this session",
      body: "This session cannot be refreshed",
      type: "error",
    });
  }

  await mutate(sessionId).catch((error) => {
    notificationService.pushNotification(
      prepareNotificationInputFromApiError(error),
    );
  });
};

export const invalidateSession = async (
  sessionId: schemas.session.PublicSession["id"],
  isCurrentSession: boolean,
  {
    mutate,
    router,
  }: {
    mutate: (sessionId: string) => Promise<any>;
    router: Router;
  },
) => {
  await mutate(sessionId).catch((error) => {
    notificationService.pushNotification(
      prepareNotificationInputFromApiError(error),
    );
  });

  notificationService.pushNotification({
    title: "Session invalidated",
    type: "info",
  });

  if (isCurrentSession) {
    return await authService.logOut();
  }

  router.push({ name: "sessions" });
};
