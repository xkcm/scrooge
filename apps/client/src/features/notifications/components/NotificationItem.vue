<template>
  <div class="notification" :class="`notification--${type}`">
    <div class="notification__icon">
      <Icon :icon="resolvedIcon" height="24" />
    </div>
    <div class="notification__content">
      <span class="notification__title">{{ title }}</span>
      <span v-if="body" class="notification__body">{{ body }}</span>
    </div>
    <button
      class="notification__close"
      @click="disposeNotification(notificationId)"
    >
      <Icon icon="mdi:close" height="24" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { NotificationType, Notification } from "../notification.types";
import { disposeNotification } from "../notification.utils";

const TYPE_ICON_MAP: Record<NotificationType, string> = {
  warning: "mdi:alert",
  error: "mdi:alert-octagon",
  success: "mdi:check",
  info: "mdi:information",
};

const { title, notificationId, type, icon, body } = defineProps<
  Pick<Notification, "type" | "title" | "body" | "icon"> & {
    notificationId: Notification["id"];
  }
>();
const resolvedIcon = icon || TYPE_ICON_MAP[type];
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

  &.notification--info {
    @include utils.useBgColor(info);
    @include utils.useTextColor(light);
  }
  &.notification--success {
    @include utils.useBgColor(success);
    @include utils.useTextColor(light);
  }
  &.notification--error {
    @include utils.useBgColor(error);
    @include utils.useTextColor(light);
  }
  &.notification--warning {
    @include utils.useBgColor(warning);
    @include utils.useTextColor(dark);
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
