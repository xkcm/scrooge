<template>
  <Teleport to="body">
    <div class="notification-list">
      <!-- todo: add animations -->
      <NotificationItem
        v-for="notification in notificationStore.items"
        :key="notification.notificationId"
        v-bind="notification"
      ></NotificationItem>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { useNotificationStore } from "../notification.store";
import NotificationItem from "./NotificationItem.vue";

const notificationStore = useNotificationStore();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.notification-list {
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 0 0.5em;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 30vw;
}
</style>
