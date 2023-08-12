<template>
  <div class="notification" :class="`notification--${type}`">
    <div class="notification__icon">
      <Icon :icon="icon" height="24" />
    </div>
    <div class="notification__content">
      <span class="notification__title">{{ title }}</span>
      <span v-if="body" class="notification__body">{{ body }}</span>
    </div>
    <button
      v-if="closeable"
      class="notification__close"
      @click="NotificationService.disposeNotification(notificationId)"
    >
      <Icon icon="mdi:close" height="24" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";

import NotificationService from "../notification.service";
import type { Notification, NotificationInput } from "../notification.types";

type NotificationItemProps = Omit<
  NotificationInput,
  "duration" | "onDispose"
> & {
  notificationId: Notification["id"];
};

const {
  title,
  notificationId,
  type,
  icon: inputIcon,
  body,
  closeable = true,
} = defineProps<NotificationItemProps>();
const icon = inputIcon || NotificationService.getDefaultNotificationIcon(type);
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.notification {
  margin-bottom: 10px;
  padding: 0.5em 1em;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 5px 0 var(--notification-shadow-color);

  &.notification--info {
    @include utils.useBgColor(info);
    @include utils.useTextColor(light);
    --notification-shadow-color: #{utils.getColor(info, 400, 0.5)};
  }
  &.notification--success {
    @include utils.useBgColor(success);
    @include utils.useTextColor(light);
    --notification-shadow-color: #{utils.getColor(success, 400, 0.5)};
  }
  &.notification--error {
    @include utils.useBgColor(error);
    @include utils.useTextColor(light);
    --notification-shadow-color: #{utils.getColor(error, 400, 0.5)};
  }
  &.notification--warning {
    @include utils.useBgColor(warning);
    @include utils.useTextColor(dark);
    --notification-shadow-color: #{utils.getColor(warning, 400, 0.5)};
  }
}

.notification__close {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;

  height: 24px;
  margin-left: 1em;
}

.notification__icon {
  height: 24px;
  margin-right: 1em;
  display: block;
}

.notification__content {
  display: flex;
  flex-direction: column;

  .notification__title {
    font-weight: 600;
  }
  .notification__body {
    font-size: 0.9em;
  }
}
</style>
../notification.service
