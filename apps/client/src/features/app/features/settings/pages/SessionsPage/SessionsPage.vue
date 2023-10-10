<template>
  <!-- todo: add current session indicator -->
  <AppLayout>
    <template #header>
      <div id="sessions-header">
        <div id="sessions-header__text">
          <Icon icon="mdi:chevron-left" :height="36" @click="router.back()" />
          <h2>Sessions</h2>
        </div>
        <AppBreadcrumbs :items="sessionsPageBreadcrumbs">
          <template #separator> > </template>
        </AppBreadcrumbs>
      </div>
    </template>

    <div class="sessions-table__container">
      <AppDataTable
        v-if="isSuccess"
        class="sessions-table"
        :header="sessionTableHeaderConfig"
        :rows="sessions"
      >
        <template #row="row">
          <div
            class="app-table__row"
            :class="{
              'sessions-table__active-session':
                row.id === sessionsData?.current,
            }"
            @click="
              router.push({
                name: 'session-details',
                params: { sessionId: row.id },
              })
            "
          >
            <div class="app-table__cell sessions-table__device-icon">
              <Icon :icon="row.deviceIcon" :height="24" />
            </div>
            <div
              class="app-table__cell sessions-table__os"
              :data-unknown="!row.os"
            >
              {{ row.os ?? "Unknown OS" }}
            </div>
            <div class="app-table__cell">{{ row.sourceIp }}</div>
            <div class="app-table__cell">{{ row.lastUsed }}</div>
            <div class="app-table__cell">{{ row.createdAt }}</div>
            <div class="app-table__cell">{{ row.expiresAt }}</div>
            <div class="app-table__cell sessions-table__context-menu-trigger">
              <Icon icon="mdi:dots-vertical" :height="24" />
            </div>
          </div>
        </template>
      </AppDataTable>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { AppDataTable } from "@scrooge/ui-library";
import { computed } from "vue";
import { useQuery } from "vue-query";
import { useRouter } from "vue-router";

import AppBreadcrumbs from "@/features/app/components/Breadcrumbs/AppBreadcrumbs.vue";
import AppLayout from "@/features/app/layouts/AppLayout.vue";
import apiClient from "@/services/api-client/api-client";
import {
  mapPublicSession,
  sessionTableHeaderConfig,
  sessionsPageBreadcrumbs,
} from "./SessionsPage.helpers";

const router = useRouter();
const { data: sessionsData, isSuccess } = useQuery(
  "sessions",
  apiClient.session.getActiveSessions,
  {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
);
const sessions = computed(
  () => sessionsData.value?.sessions.map(mapPublicSession) ?? [],
);
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";
$contentWidth: 80%;
#sessions-header {
  width: $contentWidth;
  margin: 0 calc((100% - $contentWidth) / 2);

  &__text {
    position: relative;

    svg {
      position: absolute;
      cursor: pointer;
      left: 0;
      top: 50%;
      transform: translate(calc(-100% - 10px), -50%);
    }
  }
}

div.sessions-table {
  width: $contentWidth;
  margin: 0 calc((100% - $contentWidth) / 2);
  grid-template-columns: 60px repeat(5, minmax(50px, auto)) 100px;

  &__container {
    padding: 1rem 25px 25px;
    box-sizing: border-box;
  }

  &__device-icon {
    @include utils.useTextColor(primary, 0.4);
    justify-content: center;
  }

  &__os[data-unknown="true"] {
    color: utils.getColor(warning);
  }

  &__context-menu-trigger {
    @include utils.useTextColor(primary, 0.6);
    justify-content: flex-end;

    svg {
      display: none;
    }
  }

  .app-table__row {
    cursor: pointer;
    grid-column: 1 / 8;
    padding-right: 1rem;
    padding-left: 1rem;

    &:hover .sessions-table__context-menu-trigger svg {
      display: block;
    }
  }
}
</style>
