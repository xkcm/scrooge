<template>
  <AppLayout>
    <template #header>
      <div id="sessions-header">
        <div id="sessions-header__text">
          <Icon icon="mdi:chevron-left" :height="36" @click="router.back()" />
          <h2>Sessions</h2>
        </div>
        <AppBreadcrumbs :items="pageBreadcrumbs">
          <template #separator> > </template>
        </AppBreadcrumbs>
      </div>
    </template>
    <div>
      <h3>sesje :)</h3>
      <pre>{{ sessions }}</pre>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useQuery } from "vue-query";
import { useRouter } from "vue-router";

import AppLayout from "@/features/app/layouts/AppLayout.vue";
import apiClient from "@/services/api-client/api-client";
import { Breadcrumb } from "@/features/app/components/Breadcrumbs/AppBreadcrumbs.types";
import AppBreadcrumbs from "@/features/app/components/Breadcrumbs/AppBreadcrumbs.vue";

const pageBreadcrumbs: Breadcrumb[] = [
  { caption: "Settings", routeName: "settings" },
  { caption: "Sessions", routeName: "sessions" },
];
const router = useRouter();

const { data: sessions } = useQuery(
  "sessions",
  apiClient.session.getActiveSessions,
);
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";
#sessions-header {
  width: 60%;
  margin: 0 20%;

  &__text {
    // @include utils.useTextColor;
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
</style>
