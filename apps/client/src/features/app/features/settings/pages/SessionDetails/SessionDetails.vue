<template>
  <AppLayout>
    <template #header>
      <AppHeaderWithBreadcrumbs
        id="session-details__header"
        :breadcrumbs="sessionDetailsBreadcrumbs"
        header-text="Session details"
      />
    </template>

    <div v-if="selectedSession" class="session-details__container">
      <div v-if="isCurrent" class="current-session-indicator">
        Current Session
      </div>

      <div class="session-details">
        <SessionDetail label="Session ID">{{
          selectedSession.id
        }}</SessionDetail>

        <SessionDetail label="Agent name">{{
          selectedSession.agent
        }}</SessionDetail>

        <SessionDetail label="Device type">{{
          selectedSession.agent
        }}</SessionDetail>

        <SessionDetail label="IP Address">{{
          selectedSession.sourceIp
        }}</SessionDetail>

        <SessionDetail label="Last used at">{{
          selectedSession.lastUsed
        }}</SessionDetail>

        <SessionDetail label="Expires at">{{
          selectedSession.expiresAt
        }}</SessionDetail>

        <SessionDetail label="Created at">{{
          selectedSession.createdAt
        }}</SessionDetail>

        <SessionDetail label="Approximate geolocation">{{
          selectedSession.geolocation
        }}</SessionDetail>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";

import AppLayout from "@/features/app/layouts/AppLayout.vue";
import apiClient from "@/services/api-client/api-client";
import AppHeaderWithBreadcrumbs from "@/features/app/components/AppHeaderWithBreadcrumbs.vue";
import { sessionDetailsBreadcrumbs } from "./SessionDetails.helpers";
import SessionDetail from "../../components/SessionDetail.vue";

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

<style lang="scss">
@use "@/assets/styles/utils.scss";

$contentWidth: 80%;
#session-details__header {
  width: $contentWidth;
  margin: 0 calc((100% - $contentWidth) / 2);
}

.session-details {
  display: grid;
  grid-template-columns: max-content auto 50px;
  column-gap: 1rem;

  &__container {
    width: 80%;
    margin: 0 calc((100% - $contentWidth) / 2);
    margin-top: 1rem;
    border-radius: 5px;
    @include utils.useBgColor(alpha);
    padding: 10px 0;
  }
}
</style>
