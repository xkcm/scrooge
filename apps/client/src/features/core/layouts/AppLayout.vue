<template>
  <div id="app-container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { resolveAuthState } from "@/features/auth/utils/auth.utils";
import { loadFonts } from "@/utils/font-loader/font-loader";

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
