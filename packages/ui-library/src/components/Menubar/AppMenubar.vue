<template>
  <MenubarRoot>
    <MenubarMenu>
      <MenubarTrigger class="app-menubar__trigger" as-child>
        <slot name="trigger" />
      </MenubarTrigger>
      <MenubarPortal to="body">
        <MenubarContent class="app-menubar">
          <slot name="content">
            <RadixMenubarItem
              v-for="item of items"
              v-bind="item"
              :key="item.key"
              class="app-menubar__item"
              :data-key="item.key"
              @select="item.onSelect"
            >
              <div class="app-menubar__item-icon">
                <Icon :icon="item.icon" :height="20" />
              </div>
              <div class="app-menubar__item-caption">
                {{ item.caption }}
              </div>
            </RadixMenubarItem>
          </slot>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarContent,
  MenubarItem as RadixMenubarItem,
} from "radix-vue";

import { MenubarItem } from "./AppMenubar.types";

defineProps<{
  items?: MenubarItem[];
}>();
</script>

<style lang="scss">
@use "@client-assets/styles/utils.scss";

button.app-menubar__trigger {
  all: unset;
}

.app-menubar {
  min-width: 200px;
  @include utils.useBgColor(alpha, 500);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  box-shadow: 0px 2px 1px 1px utils.getColor(alpha, 500, 1),
    1px 3px 5px 0 utils.getColor(alpha, 500, 0.9),
    2px 4px 6px 0 utils.getColor(alpha, 500, 0.8);

  &__item {
    padding: 0.2rem;
    padding-right: calc(0.2rem + 20px);
    display: flex;
    cursor: pointer;
    border-radius: 4px;
    min-height: 40px;
    gap: 0.2rem;
    align-items: center;
    @include utils.useTextColor(primary, 0.8);

    &-caption {
      flex-grow: 1;
      font-weight: 500;
      font-size: 0.9rem;
    }

    &-icon {
      width: 40px;
      display: grid;
      place-items: center;
    }

    &:focus-visible {
      @include utils.useDefaultOutline;
    }

    &:hover {
      outline: none;
      @include utils.useBgColor(alpha, 600);
      @include utils.useTextColor(primary, 1);
    }
  }
}
</style>
