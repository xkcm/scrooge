<template>
  <ErrorLayout
    v-if="appError.message"
    :message="appError.message"
    :title="appError.title"
  ></ErrorLayout>
  <Suspense v-else>
    <App></App>
    <template #fallback>
      <LoadingLayout></LoadingLayout>
    </template>
  </Suspense>
  <NotificationList></NotificationList>
</template>

<script setup lang="ts">
import { onErrorCaptured, reactive } from "vue";
import { ApiError } from "@scrooge/shared";

import App from "./AppLayout.vue";
import ErrorLayout from "./ErrorLayout.vue";
import LoadingLayout from "./LoadingLayout.vue";

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
    NotificationService.pushNotification(
      prepareNotificationInputFromApiError(error),
    );
  }
});
</script>
