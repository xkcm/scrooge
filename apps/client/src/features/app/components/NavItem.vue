<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    class="nav-item"
    @click="onClick"
  >
    <div class="nav-item__icon">
      <Icon :icon="icon" width="20" />
    </div>

    <div class="nav-item__caption">
      <span>{{ caption }}</span>
    </div>
  </component>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { RouteLocationRaw } from "vue-router";

type NavItemProps = {
  caption: string;
  icon: string;
  to?: RouteLocationRaw;
  onClick?: (event: MouseEvent) => void;
};

defineProps<NavItemProps>();
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

  &.router-link-active,
  &:active {
    @include utils.useBgColor(beta, 600);
    @include utils.useTextColor(secondary);
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
