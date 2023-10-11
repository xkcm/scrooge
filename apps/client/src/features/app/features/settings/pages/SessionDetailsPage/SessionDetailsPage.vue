<template>
  <AppLayout>
    <template #header>
      <AppHeaderWithBreadcrumbs
        id="session-details__header"
        :breadcrumbs="sessionDetailsBreadcrumbs"
        header-text="Session details"
      />
    </template>

    <div v-if="session" class="session-details__container">
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
                  :href="`https://www.openstreetmap.org/search?query=${encodeURIComponent(
                    session.geolocation.join(','),
                  )}`"
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
          @click="refreshSession"
        >
          Refresh
        </AppButton>
        <AppButton
          icon="mdi:trash-can-outline"
          data-action="invalidate"
          @click="invalidateSession"
        >
          Invalidate
        </AppButton>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";

import { AppButton, AppTooltip } from "@scrooge/ui-library";

import AppHeaderWithBreadcrumbs from "@/features/app/components/AppHeaderWithBreadcrumbs.vue";
import AppLayout from "@/features/app/layouts/AppLayout.vue";

import notificationService from "@/features/notifications/notification.service";
import { prepareNotificationInputFromApiError } from "@/features/notifications/notification.utils";

import SessionDetail from "../../components/SessionDetail.vue";
import { useSession } from "../../composables/useSession";

import { useInvalidate } from "../../composables/useInvalidate";
import { useRefresh } from "../../composables/useRefresh";
import { sessionDetailsBreadcrumbs } from "./SessionDetailsPage.helpers";

const { params } = useRoute();
const router = useRouter();

const sessionId = params.sessionId as string;
const { mutateAsync: refresh } = useRefresh(sessionId);
const { mutateAsync: invalidate } = useInvalidate(sessionId);
const { session, isCurrent } = useSession(sessionId);

const refreshSession = async () => {
  const sessionId = session.value?.id;
  if (!sessionId) return;
  if (!session.value?.refreshable) {
    return notificationService.pushNotification({
      title: "Couldn't refresh this session",
      body: "This session cannot be refreshed",
      type: "error",
    });
  }

  const response = await refresh().catch((error) => {
    notificationService.pushNotification(
      prepareNotificationInputFromApiError(error),
    );
  });

  console.info(response);
};

const invalidateSession = async () => {
  const sessionId = session.value?.id;
  if (!sessionId) return;

  await invalidate(sessionId).catch((error) => {
    notificationService.pushNotification(
      prepareNotificationInputFromApiError(error),
    );
  });

  notificationService.pushNotification({
    title: "Session invalidated",
    type: "info",
  });

  router.push({ name: "sessions" });
};
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

      &:hover {
        @include utils.useBgColor(red, 400, 0.9);
      }

      &:active {
        @include utils.useBgColor(red);
      }
    }
  }

  .app-button__caption {
    font-size: 1rem;
    font-weight: 500;
  }
}
</style>
