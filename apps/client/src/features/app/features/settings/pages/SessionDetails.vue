<template>
  <AppLayout>
    <template #header>
      <h2>Session details</h2>
    </template>
    {{ params }}
    {{ selectedSession }}
    {{ isCurrent }}
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";

import AppLayout from "@/features/app/layouts/AppLayout.vue";
import apiClient from "@/services/api-client/api-client";

const { params } = useRoute();
const { data: sessionsData } = useQuery(
  "sessions",
  apiClient.session.getActiveSessions, // todo: implement fetching only one session instead of all
  {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },
);

const selectedSession = computed(() =>
  sessionsData.value?.sessions.find(({ id }) => id === params.sessionId),
);
const isCurrent = computed(
  () => sessionsData.value?.current === selectedSession.value?.id,
);
</script>

<style lang="scss"></style>
