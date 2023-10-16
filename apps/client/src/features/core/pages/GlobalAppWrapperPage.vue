<template>
  <GlobalAppError
    v-if="appError.message"
    :message="appError.message"
    :title="appError.title"
  ></GlobalAppError>

  <Suspense v-else>
    <div id="app-container">
      <router-view></router-view>
    </div>
    <template #fallback>
      <GlobalAppLoading></GlobalAppLoading>
    </template>
  </Suspense>

  <NotificationPortal></NotificationPortal>
</template>

<script setup lang="ts">
import { ApiError } from "@scrooge/shared";
import { onErrorCaptured, reactive } from "vue";

import GlobalAppError from "./GlobalAppErrorPage.vue";
import GlobalAppLoading from "./GlobalAppLoadingPage.vue";

import NotificationPortal from "@/features/notifications/components/NotificationList.vue";

import notificationService from "@/features/notifications/notification.service";
import { prepareNotificationInputFromApiError } from "@/features/notifications/notification.utils";

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
    notificationService.pushNotification(notificationInput);
  }
});
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

#app-container {
  @include utils.useBgColor(alpha);

  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
