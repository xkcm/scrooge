<template v-once>
  <FilledButton caption="Log out" @click="logOut"></FilledButton>
  <div style="overflow: auto; width: 100%; height: 100%">
    <pre>{{ JSON.stringify(data.userInfo, null, 4) }}</pre>
    <pre>{{ JSON.stringify(data.sessions, null, 4) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { FilledButton } from "@scrooge/ui-library";

import type { Session } from "@/services/api-client/modules/session/session.types";
import type { UserInfo } from "@/services/api-client/modules/user/user.types";

import NotificationService from "@/features/notifications/notification.service";
import AuthService from "@/features/auth/auth.service";

import ApiClient from "@/services/api-client/api-client";

const data = reactive<{
  sessions?: Session[];
  userInfo?: UserInfo;
}>({});

onMounted(async () => {
  [data.sessions, data.userInfo] = await Promise.all([
    ApiClient.session.getActiveSessions(),
    ApiClient.user.getInfo(),
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
