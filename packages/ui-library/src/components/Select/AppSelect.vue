<template>
  <SelectRoot v-model="modelValue">
    <SelectTrigger class="app-select__trigger">
      <span>{{ caption }}</span>
      <Icon icon="mdi:chevron-down" :width="16"></Icon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="app-select"
        :side-offset="5"
        position="popper"
        align="end"
      >
        <SelectItem
          v-for="(option, index) of options"
          :key="index"
          class="app-select__item"
          :value="option.value"
        >
          <SelectItemIndicator class="app-select__item-indicator">
            <Icon icon="mdi:check" :width="12"></Icon>
          </SelectItemIndicator>
          <span>
            {{ option.caption }}
          </span>
        </SelectItem>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
} from "radix-vue";

import { AppSelectOption } from "./AppSelect.types";

const modelValue = defineModel<string>();
const { options = [] } = defineProps<{
  options?: AppSelectOption[];
}>();
const caption = computed(
  () => options.find((option) => option.value === modelValue.value)?.caption,
);
</script>

<style lang="scss">
@use "@client-assets/styles/utils.scss";

@include utils.useTheme(dark) {
  .app-select {
    --p-scrollbar-color: #{utils.getTextColor(primary)};
  }
}

.app-select {
  --p-bg-color: #{utils.getColor(alpha, 500)};
  --p-text-color: #{utils.getTextColor(primary, 0.9)};
  --p-hover-bg-color: #{utils.getColor(alpha, 600)};
  --p-selected-text-color: #{utils.getColor(gamma)};
  --p-scrollbar-color: #{utils.getColor(beta)};
  @include utils.useCustomScrollbar(var(--p-scrollbar-color), 5px);

  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid utils.getColor(alpha, 500);
  background-color: var(--p-bg-color);
  color: var(--p-text-color);
  padding: 0.25rem 0;
  min-width: 200px;
  box-sizing: border-box;
  font-weight: 300;

  &__item {
    font-family: "Poppins";
    display: flex;
    align-items: center;
    padding: 0.2rem 1.5rem;
    font-size: 0.75rem;
    cursor: pointer;

    &:hover {
      background-color: var(--p-hover-bg-color);
    }

    &[data-state="checked"] {
      $gap: calc((1.5rem - 12px) / 2);
      color: var(--p-selected-text-color);
      padding-left: $gap;
      gap: $gap;
    }

    &-indicator {
      display: grid;
      place-items: center;
    }
  }
}

.app-select__trigger {
  --p-bg-color: #{utils.getColor(alpha, 500)};
  --p-text-color: #{utils.getTextColor(primary, 0.9)};
  @include utils.clearButtonStyles;

  background-color: var(--p-bg-color);
  color: var(--p-text-color);

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  border-radius: 4px;
  font-size: 0.8rem;
  padding: 0.2rem 0.8rem;
  min-width: 200px;
  box-sizing: border-box;
  font-weight: 300;

  span {
    flex-grow: 1;
  }
}
</style>
