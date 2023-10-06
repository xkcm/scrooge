<template>
  <AppLayout>
    <template #header><h2>Sessions</h2></template>
    <div>
      <h3>sesje :)</h3>
      <pre>{{ sessions }}</pre>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/features/app/layouts/AppLayout.vue";
import apiClient from "@/services/api-client/api-client";

const sessions = await apiClient.session.getActiveSessions();
</script>

<style lang="scss"></style>
