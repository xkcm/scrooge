<template>
  <div class="app-table" :style="{ '--p-number-of-columns': numberOfColumns }">
    <div class="app-table__header">
      <div
        v-for="headerCell of header"
        :key="headerCell.key"
        class="app-table__cell"
      >
        {{ headerCell.caption }}
      </div>
    </div>
    <slot v-for="(row, i) of rows" v-bind="(row as any)" :key="i" name="row">
      <div class="app-table__row">
        <div
          v-for="headerCell of header"
          :key="headerCell.key"
          class="app-table__cell"
        >
          {{ row[headerCell.key] }}
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<PropertyKey, any>">
import { computed } from "vue";

import {
  AppDataTableHeaderConfig,
  AppDataTableSlots,
} from "./AppDataTable.types";

const { header } = defineProps<{
  header: AppDataTableHeaderConfig;
  rows: T[];
}>();
defineSlots<AppDataTableSlots<T>>();

const numberOfColumns = computed(() => header.length);
</script>

<style lang="scss">
@use "@client-assets/styles/utils.scss";
$baseCellHeight: 50px;
.app-table {
  display: grid;
  grid-template-columns: repeat(var(--p-number-of-columns), 1fr);

  @include utils.useBgColor(alpha);
  @include utils.useTextColor(primary, 0.8);
  border-radius: 5px;
  padding-bottom: 5px;
  gap: 5px;
  border: 1px utils.getColor(alpha) solid;

  &__header,
  &__row {
    grid-column: 1 / calc(var(--p-number-of-columns) + 1);
    font-size: 0.9rem;
    display: grid;
    grid-template-columns: subgrid;
  }

  &__header {
    min-height: $baseCellHeight;
  }

  &__row {
    min-height: $baseCellHeight + 10px;
    font-weight: 500;
    &:hover {
      @include utils.useBgColor(alpha, 500);
    }
  }

  &__cell {
    display: flex;
    align-items: center;
  }
}
</style>
