import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "./notification.store.js";

import type {
  NotificationInput,
  Notification,
  NotificationWithActions,
  NotificationType,
} from "./notification.types.js";

const DEFAULT_NOTIFICATION_DURATION = 5000; // 5s

function createNotification(
  notificationInput: NotificationInput,
): Notification {
  const id = uuidv4();
  const duration = notificationInput.duration ?? DEFAULT_NOTIFICATION_DURATION;

  const notification: Notification = {
    ...notificationInput,
    id,
    timestamp: Date.now(),
    duration: duration,
  };

  if (duration !== -1) {
    notification.timeoutInstance = setTimeout(
      () => disposeNotification(id),
      duration,
    );
  }

  return notification;
}

function pushNotification(
  notificationData: NotificationInput,
): NotificationWithActions {
  const store = useNotificationStore();
  const notification = createNotification(notificationData);

  const newItems = [...store.items, notification];
  store.setItems(newItems);

  return {
    ...notification,
    dispose: () => disposeNotification(notification.id),
  };
}

function unshiftNotification(
  notificationInput: NotificationInput,
): NotificationWithActions {
  const store = useNotificationStore();
  const notification = createNotification(notificationInput);

  const newItems = [...store.items, notification];
  store.setItems(newItems);

  return {
    ...notification,
    dispose: () => disposeNotification(notification.id),
  };
}

function disposeNotification(notificationId: Notification["id"]) {
  const store = useNotificationStore();

  const [newItems, disposedNotification] = store.items.reduce<
    [Notification[], Notification | null]
  >(
    (acc, cur) => {
      if (cur.id !== notificationId) {
        return [[...acc[0], cur], acc[1]];
      }
      return [acc[0], cur];
    },
    [[], null],
  );
  store.setItems(newItems);

  if (!disposedNotification) {
    return;
  }
  clearTimeout(disposedNotification.timeoutInstance);
  disposedNotification.onDispose?.();
}

function clearNotifications() {
  useNotificationStore().setItems([]);
}

function getDefaultNotificationIcon(type: NotificationType) {
  const TYPE_ICON_MAP: Record<NotificationType, string> = {
    warning: "mdi:alert",
    error: "mdi:alert-octagon",
    success: "mdi:check",
    info: "mdi:information",
  };

  return TYPE_ICON_MAP[type] || TYPE_ICON_MAP.info;
}

const NotificationService = {
  createNotification,
  pushNotification,
  unshiftNotification,
  disposeNotification,
  clearNotifications,
  getDefaultNotificationIcon,
};

export default NotificationService;
