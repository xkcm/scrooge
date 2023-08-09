export type NotificationType = "info" | "success" | "warning" | "error";

export type NotificationInput = {
  title: string;
  body?: string;
  icon?: string;
  type: NotificationType;
  duration?: number;
  onDispose?: () => void; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type Notification = NotificationInput & {
  id: string;
  timestamp: number;
  duration: number;
  timeoutInstance?: ReturnType<typeof setTimeout>;
};

export type NotificationWithActions = Notification & {
  dispose: () => void;
};
