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
        <AppTooltip side="right">
          <template #trigger>
            <Icon icon="mdi:signal-variant" :height="16" />
            <span>Current Session</span>
          </template>
          You are currently logged in using this session
        </AppTooltip>
      </div>

      <div class="session-details">
        <SessionDetail label="Session ID" :value="selectedSession.id" />
        <SessionDetail label="Agent name" :value="selectedSession.agent" />
        <SessionDetail label="Device type" :value="selectedSession.agent" />
        <SessionDetail label="IP Address" :value="selectedSession.sourceIp" />
        <SessionDetail label="Last used at" :value="selectedSession.lastUsed" />
        <SessionDetail label="Expires at" :value="selectedSession.expiresAt" />
        <SessionDetail label="Created at" :value="selectedSession.createdAt" />
        <SessionDetail
          class="session-details__geolocation"
          label="Approximate geolocation"
          :value="selectedSession.geolocation.join(', ')"
        >
          <template v-if="selectedSession.geolocation.length > 0">
            <AppTooltip side="right">
              <template #trigger>
                <a
                  :href="`https://www.openstreetmap.org/search?query=${encodeURIComponent(
                    selectedSession.geolocation.join(','),
                  )}`"
                  target="_blank"
                >
                  {{ selectedSession.geolocation.join(", ") }}
                </a>
              </template>
              Open these coordinates in <i>Open Street Map</i>
            </AppTooltip>
            <Icon icon="mdi:map-search-outline" :height="22" />
          </template>
        </SessionDetail>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";

import { AppTooltip } from "@scrooge/ui-library";

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

  &__geolocation .session-detail__content[data-unknown="false"] {
    font-weight: 600;
    color: utils.getColor(gamma);

    a {
      all: unset;
      margin-right: 5px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.current-session-indicator .app-tooltip__trigger {
  color: utils.getColor(green);
  display: flex;
  gap: 2px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0 1rem;
}
</style>
