<template>
  <GlobalAppError
    v-if="appError.message"
    :message="appError.message"
    :title="appError.title"
  ></GlobalAppError>

  <Suspense v-else>
    <GlobalApp></GlobalApp>
    <template #fallback>
      <GlobalAppLoading></GlobalAppLoading>
    </template>
  </Suspense>

  <NotificationList></NotificationList>
</template>

<script setup lang="ts">
import { onErrorCaptured, reactive } from "vue";
import { ApiError } from "@scrooge/shared";

import GlobalApp from "./GlobalAppPage.vue";
import GlobalAppError from "./GlobalAppErrorPage.vue";
import GlobalAppLoading from "./GlobalAppLoadingPage.vue";

import NotificationList from "@/features/notifications/components/NotificationList.vue";

import { prepareNotificationInputFromApiError } from "@/features/notifications/notification.utils";
import NotificationService from "@/features/notifications/notification.service";
import ThemeService from "@/services/theme/theme";

ThemeService.initTheme();

const appError = reactive<{
  message?: string;
  title?: string;
}>({});

onErrorCaptured((error) => {
  appError.message = error.message;

  if (error instanceof ApiError) {
    const notificationInput = prepareNotificationInputFromApiError(error, {
      closeable: false,
    });
    NotificationService.pushNotification(notificationInput);
  }
});
</script>
