<template>
  <ul v-if="operations.length" class="operations-list">
    <LatestOperationItem
      v-for="(operation, i) of operations"
      :key="i"
      :row-number="i + 1"
      v-bind="operation"
    >
      {{ JSON.stringify(operation) }}
    </LatestOperationItem>
  </ul>
</template>

<script lang="ts" setup>
import LatestOperationItem from "./LatestOperationItem.vue";

import { Operation } from "../../types";

defineProps<{
  operations: Operation[];
}>();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.operations-list {
  @include utils.clearListStyles;
  @include utils.useBgColor(alpha, 600);
  display: flex;
  flex-direction: column;
  gap: 1px;
}
</style>
