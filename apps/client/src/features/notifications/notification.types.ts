export type NotificationType = "info" | "success" | "warning" | "error";

export type NotificationInput = {
  title: string;
  body?: string;
  icon?: string;
  type: NotificationType;
  duration?: number;
  closeable?: boolean;
  onDispose?: () => void;
};

export type Notification = NotificationInput & {
  notificationId: string;
  timestamp: number;
  duration: number;
  timeoutInstance?: ReturnType<typeof setTimeout>;
};

export type NotificationWithActions = Notification & {
  dispose: () => void;
};
