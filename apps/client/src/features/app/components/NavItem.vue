<template>
  <button class="nav-item" :class="isActive && 'active'" @click="onButtonClick">
    <div class="nav-item__icon">
      <Icon :icon="icon" width="24" />
    </div>

    <div class="nav-item__caption">
      <span>{{ caption }}</span>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

import { NavItemProps } from "../types/NavItem.types";

const { onClick, to } = defineProps<NavItemProps>();
const router = useRouter();

const isActive = computed(() =>
  router.currentRoute.value.matched.some(
    (matchedRoute) => matchedRoute.name === to?.name,
  ),
);

const onButtonClick = (event: MouseEvent) => {
  onClick?.(event);

  if (to) {
    router.push(to);
  }
};
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

$navItemHeight: 60px;

.nav-item {
  @include utils.clearHrefStyles;
  @include utils.clearButtonStyles;
  @include utils.useTextColor(secondary, 0.8);

  display: grid;
  height: $navItemHeight;
  grid-template-columns: $navItemHeight auto;
  border-radius: 10px;

  &:hover {
    @include utils.useBgColor(beta, 500);
  }

  &.active,
  &:active {
    @include utils.useBgColor(beta, 600);
    @include utils.useTextColor(secondary);
  }

  &:focus-visible {
    @include utils.defaultOutlineOnFocus(alpha);
  }
}

.nav-item__icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  svg {
    transform: translateY(1px); // looks better
  }
}

.nav-item__caption {
  font-weight: 600;
  font-size: 1.125rem;

  display: flex;
  flex-grow: 1;
  align-items: center;
  height: 100%;
}
</style>