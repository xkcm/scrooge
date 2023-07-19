<template v-once>
  <div style="overflow: auto; width: 100%; height: 100%">
    <pre>{{ JSON.stringify(data.userInfo, null, 4) }}</pre>
    <pre>{{ JSON.stringify(data.sessions, null, 4) }}</pre>
  </div>
</template>

<script setup lang="ts">
import apiClient from "@/utils/api-client/api-client";
import { onMounted, reactive } from "vue";

import type { Session } from "@/utils/api-client/modules/session/session.types";
import type { UserInfo } from "@/utils/api-client/modules/user/user.types";

const data = reactive<{
  sessions?: Session[];
  userInfo?: UserInfo;
}>({});

onMounted(async () => {
  data.sessions = await apiClient.session.getActiveSessions();
  data.userInfo = await apiClient.user.getInfo();
});
</script>

<style lang="scss"></style>
