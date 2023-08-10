import { ApiError } from "@scrooge/shared";
import { NotificationInput } from "./notification.types";
import { extractErrorDefaults } from "@xkcm/better-errors";
import { RequestFailedError } from "@/services/api-client/api-client.errors";

export function prepareNotificationInputFromApiError(
  error: ApiError,
  overrideValues: Partial<NotificationInput> = {},
) {
  const notificationInput: NotificationInput = {
    type: "error",
    title: "Critical error",
    body: error.message,
    duration: -1,
  };

  if (error.code === extractErrorDefaults(RequestFailedError).code) {
    notificationInput.icon = "mdi:cloud-cancel";
  }

  return {
    ...notificationInput,
    ...overrideValues,
  };
}
