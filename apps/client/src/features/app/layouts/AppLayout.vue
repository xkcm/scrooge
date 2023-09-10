<template>
  <div class="app-layout">
    <div class="app-layout__sidebar">
      <div class="app-layout__logo">
        <h2>Scrooge</h2>
      </div>
      <nav class="app-layout__navigation">
        <NavItem
          v-for="(navItem, i) of NAV_ITEMS"
          v-once
          :key="i"
          :caption="navItem.caption"
          :icon="navItem.icon"
          :to="navItem.to"
          :on-click="navItem.onClick"
        ></NavItem>
      </nav>
    </div>
    <div class="app-layout__header">
      <h2>{{ headerText }}</h2>
    </div>

    <div class="app-layout__main">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import notificationService from "@/features/notifications/notification.service";

import NavItem from "../components/NavItem.vue";
import { NavItemProps } from "../types/NavItem.types";

import authService from "@features/auth/auth.service";

defineProps<{
  headerText: string;
}>();

const NAV_ITEMS: NavItemProps[] = [
  {
    caption: "Dashboard",
    icon: "mdi:poll",
    to: { name: "dashboard" },
  },
  {
    caption: "Add operation",
    icon: "mdi:plus",
    to: { name: "new-operation" },
  },
  {
    caption: "History",
    icon: "mdi:format-list-bulleted",
    to: { name: "history" },
  },
  {
    caption: "Settings",
    icon: "mdi:cog",
    to: { name: "settings" },
  },
  {
    caption: "Sign out",
    icon: "mdi:logout",
    onClick: async () => {
      await authService.logOut();
      notificationService.pushNotification({
        title: "You're logged out",
        type: "info",
        icon: "mdi:account-check",
      });
    },
  },
];
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

$headerHeight: 100px;

.app-layout {
  @include utils.useBgColor(alpha, 600);
  display: grid;
  grid-template-columns: 300px auto;
  grid-template-rows: $headerHeight auto;
  height: 100%;
  flex-grow: 1;
}

.app-layout__sidebar {
  background-color: utils.getColor(beta);
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;

  .app-layout__logo {
    height: $headerHeight;
    padding: 0 30px;
    display: flex;
    align-items: center;

    h2 {
      @include utils.useTextColor(secondary);
      font-size: 2.25rem;
      font-weight: 600;
    }
  }

  .app-layout__navigation {
    padding: 25px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.app-layout__header {
  box-sizing: border-box;
  padding: 0 25px;
  display: flex;
  align-items: center;

  h2 {
    color: utils.getColor(beta);
    font-size: 2.25rem;
    font-weight: 500;
  }
}

.app-layout__main {
  overflow: auto;
}
</style>
