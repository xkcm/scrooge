<template>
  <AppLayout>
    <template #header>
      <AppHeaderWithBreadcrumbs
        id="session-details__header"
        :breadcrumbs="sessionDetailsBreadcrumbs"
        header-text="Session details"
      />
    </template>

    <div class="session-details__container">
      <template v-if="session">
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
          <SessionDetail label="Session ID" :value="session.id" />
          <SessionDetail label="Agent name" :value="session.agent" />
          <SessionDetail label="Device type" :value="session.agent" />
          <SessionDetail label="IP Address" :value="session.sourceIp" />
          <SessionDetail label="Last used at" :value="session.lastUsed" />
          <SessionDetail label="Expires at" :value="session.expiresAt" />
          <SessionDetail label="Created at" :value="session.createdAt" />
          <SessionDetail
            class="session-details__geolocation"
            label="Approximate geolocation"
            :value="session.geolocation.join(', ')"
          >
            <template v-if="session.geolocation.length > 0">
              <AppTooltip side="right">
                <template #trigger>
                  <a
                    :href="buildOpenStreetMapsLink(session.geolocation)"
                    target="_blank"
                  >
                    {{ session.geolocation.join(", ") }}
                  </a>
                </template>
                Open these coordinates in <i>Open Street Map</i>
              </AppTooltip>
              <Icon icon="mdi:map-search-outline" :height="22" />
            </template>
          </SessionDetail>
        </div>
        <div class="session-actions">
          <AppButton
            v-if="session.refreshable"
            icon="mdi:refresh"
            data-action="refresh"
            :loading="isRefreshing"
            @click="refreshSession(session.id)"
          >
            Refresh
          </AppButton>
          <!-- todo: add popup to make sure if invalidating current session -->
          <AppButton
            icon="mdi:trash-can-outline"
            data-action="invalidate"
            :loading="isInvalidating"
            @click="invalidateSession(session.id)"
          >
            Invalidate
          </AppButton>
        </div>
      </template>
      <div v-else class="no-session-found">
        No session with ID <i>{{ sessionId }}</i> was found
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";

import { AppButton, AppTooltip } from "@scrooge/ui-library";

import AppHeaderWithBreadcrumbs from "@/features/app/components/AppHeaderWithBreadcrumbs.vue";
import AppLayout from "@/features/app/layouts/AppLayout.vue";

import SessionDetail from "../../components/SessionDetail.vue";
import { useSession } from "../../composables/useSession";
import { buildOpenStreetMapsLink } from "../../helpers/session.helpers";

import { useSessionInvalidator } from "../../composables/useSessionInvalidator";
import { useSessionRefresher } from "../../composables/useSessionRefresher";
import { sessionDetailsBreadcrumbs } from "./SessionDetailsPage.helpers";

const { params } = useRoute();

const sessionId = params.sessionId as string;
const { session, isCurrent } = useSession(sessionId);
const { refreshSession, isLoading: isRefreshing } = useSessionRefresher();
const { invalidateSession, isLoading: isInvalidating } =
  useSessionInvalidator();
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

      &:focus-visible {
        @include utils.useDefaultOutline;
      }

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
  cursor: default;
}

.session-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
  gap: 0.5rem;

  .app-button {
    flex-direction: row-reverse;
    padding-left: 15px;
    gap: 8px;

    &[data-action="invalidate"] {
      @include utils.useBgColor(red, 400, 0.8);

      &:not([disabled]):hover {
        @include utils.useBgColor(red, 400, 0.9);
      }

      &:not([disabled]):active {
        @include utils.useBgColor(red);
      }
    }
  }

  .app-button__caption {
    font-size: 1rem;
    font-weight: 500;
  }
}

.no-session-found {
  @include utils.useTextColor(primary);
  padding: 0 1rem;
  font-weight: 500;
}
</style>
