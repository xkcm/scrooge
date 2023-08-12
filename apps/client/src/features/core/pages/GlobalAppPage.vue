<template>
  <div id="app-container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import AuthService from "@/features/auth/auth.service";
import FontLoaderService from "@/services/font-loader/font-loader";

import "@scrooge/ui-library";

await FontLoaderService.loadFonts();
await AuthService.resolveAuthState();
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
