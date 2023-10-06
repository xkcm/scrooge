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
  <div v-else class="no-operations-text__wrapper">
    <NoOperationsText :redirect="() => openNewOperation(type)" />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { Operation } from "../../dashboard.types";
import LatestOperationItem from "./LatestOperationItem.vue";
import NoOperationsText from "../NoOperationsText.vue";

defineProps<{
  operations: Operation[];
  type: "EXPENSE" | "INCOME";
}>();
const router = useRouter();

const openItemInHistory = (operationId: Operation["id"]) => {
  router.push({ name: "history/item-details", params: { id: operationId } });
};

const openNewOperation = (operationType: "EXPENSE" | "INCOME") => {
  let routeName;
  switch (operationType) {
    case "EXPENSE":
      routeName = "new-expense";
      break;
    case "INCOME":
      routeName = "new-income";
      break;
    default:
      routeName = "new-operation";
      break;
  }

  router.push({ name: routeName });
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

.no-operations-text__wrapper {
  display: flex;
  height: 100%;
}
</style>
