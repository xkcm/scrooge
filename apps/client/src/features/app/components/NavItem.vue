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
  @include utils.useTheme(light) {
    --p-text-color: #{utils.getTextColor(secondary, 0.8)};
    --p-text-color--active: #{utils.getTextColor(secondary)};
  }
  @include utils.useTheme(dark) {
    --p-text-color: #{utils.getTextColor(primary, 0.8)};
    --p-text-color--active: #{utils.getTextColor(primary)};
  }

  color: var(--p-text-color);
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
    color: var(--p-text-color--active);
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
