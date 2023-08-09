<template>
  <div id="app-container">
    <router-view></router-view>
  </div>
  <NotificationList></NotificationList>
</template>

<script setup lang="ts">
import { resolveAuthState } from "@/features/auth/auth.service";
import { loadFonts } from "@/services/font-loader/font-loader";

import NotificationList from "@features/notifications/components/NotificationList.vue";

await loadFonts();
await resolveAuthState();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

#app-container {
  @include utils.useBgColor(alpha);

  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
