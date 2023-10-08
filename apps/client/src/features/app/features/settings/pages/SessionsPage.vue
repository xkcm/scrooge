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
import { useQuery } from "vue-query";

import AppLayout from "@/features/app/layouts/AppLayout.vue";
import apiClient from "@/services/api-client/api-client";

const { data: sessions } = useQuery(
  "sessions",
  apiClient.session.getActiveSessions,
);
</script>

<style lang="scss"></style>
