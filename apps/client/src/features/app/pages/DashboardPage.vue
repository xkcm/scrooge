<template v-once>
  <FilledButton caption="Log out" @click="logOut"></FilledButton>
  <div style="overflow: auto; width: 100%; height: 100%">
    <pre>{{ JSON.stringify(data.userInfo, null, 4) }}</pre>
    <pre>{{ JSON.stringify(data.sessions, null, 4) }}</pre>
  </div>
</template>

<script setup lang="ts">
import apiClient from "@/services/api-client/api-client";
import { onMounted, reactive } from "vue";

import type { Session } from "@/services/api-client/modules/session/session.types";
import type { UserInfo } from "@/services/api-client/modules/user/user.types";
import FilledButton from "@/features/core/components/Buttons/FilledButton.vue";

import NotificationService from "@/features/notifications/notification.service";
import AuthService from "@/features/auth/auth.service";

const data = reactive<{
  sessions?: Session[];
  userInfo?: UserInfo;
}>({});

onMounted(async () => {
  [data.sessions, data.userInfo] = await Promise.all([
    apiClient.session.getActiveSessions(),
    apiClient.user.getInfo(),
  ]);
});

const logOut = async () => {
  await AuthService.logOut();

  NotificationService.pushNotification({
    title: "You're logged out",
    type: "info",
  });
};
</script>

<style lang="scss"></style>
@/features/notifications/notification.service
