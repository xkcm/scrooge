<template>
  <SelectRoot v-model="modelValue" @update:open="scrollToCurrentItem">
    <SelectTrigger class="app-select__trigger">
      <SelectValue class="app-select__trigger__content">{{
        caption
      }}</SelectValue>
      <Icon icon="mdi:chevron-down" :width="16"></Icon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="app-select"
        :side-offset="5"
        position="popper"
        align="end"
      >
        <div v-bind="containerProps" class="app-select__container">
          <SelectViewport v-bind="wrapperProps">
            <SelectItem
              v-for="option of list"
              :key="option.index"
              class="app-select__item"
              :value="option.data.value"
            >
              <SelectItemIndicator class="app-select__item-indicator">
                <Icon icon="mdi:check" :width="12"></Icon>
              </SelectItemIndicator>
              <SelectItemText>
                {{ option.data.caption }}
              </SelectItemText>
            </SelectItem>
          </SelectViewport>
        </div>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useVirtualList } from "@vueuse/core";
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "radix-vue";
import { computed, nextTick } from "vue";

import { AppSelectOption } from "./AppSelect.types";

const modelValue = defineModel<string>();
const { options } = defineProps<{
  options?: AppSelectOption[];
}>();

const caption = computed(
  () => options?.find((option) => option.value === modelValue.value)?.caption,
);
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  computed(() => options ?? []),
  {
    itemHeight: 35,
    overscan: 9,
  },
);

const scrollToCurrentItem = (isOpen: boolean) => {
  if (!isOpen) {
    return;
  }
  const currentIndex =
    options?.findIndex(({ value }) => value === modelValue.value) ?? 0;
  nextTick(() => scrollTo(currentIndex));
};
</script>

<style lang="scss">
@use "@client-assets/styles/utils.scss";

.app-select {
  --p-bg-color: #{utils.getColor(alpha, 500)};
  --p-text-color: #{utils.getTextColor(primary, 0.9)};
  --p-hover-bg-color: #{utils.getColor(alpha, 600)};
  --p-selected-text-color: #{utils.getColor(gamma)};
  --p-scrollbar-color: #{utils.getColor(beta)};
  @include utils.useTheme(dark) {
    --p-scrollbar-color: #{utils.getTextColor(primary)};
  }

  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid utils.getColor(alpha, 500);
  background-color: var(--p-bg-color);
  color: var(--p-text-color);
  padding: 0.25rem 0;
  width: 200px;
  box-sizing: border-box;

  &__container {
    max-height: 300px;
    @include utils.useCustomScrollbar(var(--p-scrollbar-color), 5px);
  }

  &__item {
    &:focus-visible {
      outline: none;
      background-color: var(--p-hover-bg-color);
    }

    font-family: "Poppins";
    font-weight: 300;
    display: flex;
    align-items: center;
    padding: 0.2rem 1.5rem;
    font-size: 0.75rem;
    cursor: pointer;
    min-height: 35px;
    width: 100%;
    box-sizing: border-box;

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
  width: 200px;
  box-sizing: border-box;
  font-weight: 300;

  &__content {
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  span {
    flex-grow: 1;
  }
}
</style>
