<template>
  <ContextMenuRoot>
    <ContextMenuTrigger class="app-context-menu__trigger" as-child>
      <slot name="trigger" />
    </ContextMenuTrigger>
    <ContextMenuPortal to="body">
      <ContextMenuContent class="app-context-menu">
        <slot name="content">
          <RadixContextMenuItem
            v-for="item of items"
            v-bind="item"
            :key="item.key"
            class="app-context-menu__item"
            :data-key="item.key"
            @select="item.onSelect"
          >
            <div class="app-context-menu__item-icon">
              <Icon :icon="item.icon" :height="20" />
            </div>
            <div class="app-context-menu__item-caption">
              {{ item.caption }}
            </div>
          </RadixContextMenuItem>
        </slot>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<script setup lang="ts">
import {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuContent,
  ContextMenuItem as RadixContextMenuItem,
} from "radix-vue";
import { Icon } from "@iconify/vue";

import { ContextMenuItem } from "./AppContextMenu.types";

defineProps<{
  items: ContextMenuItem[];
}>();
</script>

<style lang="scss">
@use "@client-assets/styles/utils.scss";

.app-context-menu {
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
