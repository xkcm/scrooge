<template>
  <ul v-if="operations.length" class="operations-list">
    <LatestOperationItem
      v-for="(operation, i) of operations"
      :key="i"
      :row-number="i + 1"
      v-bind="operation"
      @click="openItemInHistory(operation.id)"
      @keyup.enter="openItemInHistory(operation.id)"
    />
  </ul>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { Operation } from "../../types";
import LatestOperationItem from "./LatestOperationItem.vue";

defineProps<{
  operations: Operation[];
}>();
const router = useRouter();

const openItemInHistory = (operationId: Operation["id"]) => {
  router.push({ name: "history/item-details", query: { id: operationId } });
};
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
