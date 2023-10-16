<template>
  <div class="breadcrumbs-header">
    <div class="breadcrumbs-header__text">
      <Icon icon="mdi:chevron-left" :height="36" @click="router.back()" />
      <h2>{{ headerText }}</h2>
    </div>
    <AppBreadcrumbs v-if="breadcrumbs" :items="breadcrumbs">
      <template #separator> > </template>
    </AppBreadcrumbs>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

import { Breadcrumb } from "./Breadcrumbs/AppBreadcrumbs.types";
import AppBreadcrumbs from "./Breadcrumbs/AppBreadcrumbs.vue";

defineProps<{
  breadcrumbs?: Breadcrumb[];
  headerText: string;
}>();

const router = useRouter();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.breadcrumbs-header {
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
</style>
