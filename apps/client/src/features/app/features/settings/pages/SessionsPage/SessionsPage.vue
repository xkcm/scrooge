<template>
  <!-- todo: add current session indicator -->
  <AppLayout>
    <template #header>
      <AppHeaderWithBreadcrumbs
        id="sessions-header"
        :breadcrumbs="sessionsPageBreadcrumbs"
        header-text="Sessions"
      />
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
            class="app-table__row sessions-table__row"
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
            <div class="app-table__cell" :data-unknown="row.os === 'N/A'">
              {{ row.os }}
            </div>
            <div class="app-table__cell" :data-unknown="row.sourceIp === 'N/A'">
              {{ row.sourceIp }}
            </div>
            <div class="app-table__cell">{{ row.lastUsed }}</div>
            <div class="app-table__cell">{{ row.createdAt }}</div>
            <div class="app-table__cell">{{ row.expiresAt }}</div>
            <div
              class="app-table__cell sessions-table__current-session-indicator"
            >
              <AppTooltip v-if="row.id === sessionsData?.current" side="left">
                <template #trigger>
                  <Icon
                    icon="mdi:signal-variant"
                    :height="24"
                    class="sessions-table__current-session-indicator"
                  />
                </template>
                You are currently logged in using this session
              </AppTooltip>
            </div>
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
import { AppDataTable, AppTooltip } from "@scrooge/ui-library";
import { computed } from "vue";
import { useRouter } from "vue-router";

import AppHeaderWithBreadcrumbs from "@/features/app/components/AppHeaderWithBreadcrumbs.vue";
import AppLayout from "@/features/app/layouts/AppLayout.vue";
import { useSessions } from "../../composables/useSessions";
import {
  mapPublicSessionToRowData,
  sessionTableHeaderConfig,
  sessionsPageBreadcrumbs,
} from "./SessionsPage.helpers";

const router = useRouter();
const { data: sessionsData, isSuccess } = useSessions();
const sessions = computed(
  () => sessionsData.value?.sessions.map(mapPublicSessionToRowData) ?? [],
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
  grid-template-columns: 60px repeat(5, minmax(50px, auto)) 50px 50px;

  &__container {
    padding: 1rem 0;
    box-sizing: border-box;
  }

  &__device-icon {
    @include utils.useTextColor(primary, 0.4);
    justify-content: center;
  }

  .app-table__cell[data-unknown="true"] {
    @include utils.useTextColor(primary, 0.4);
  }

  &__context-menu-trigger {
    @include utils.useTextColor(primary, 0.6);
    justify-content: flex-end;

    svg:not(.sessions-table__current-session-indicator) {
      display: none;
    }
  }

  &__row {
    cursor: pointer;
    grid-column: 1 / 9;
    padding-right: 1rem;
    padding-left: 1rem;

    &:hover .sessions-table__context-menu-trigger svg {
      display: block;
    }
  }

  .sessions-table__current-session-indicator {
    color: utils.getColor(green);
    justify-self: flex-start;
    .app-tooltip__trigger {
      display: grid;
      place-items: center;
    }
  }
}
</style>
