<template v-once>
  <AppLayout header-text="Dashboard">
    <div id="dashboard">
      <DashboardTile
        id="chart"
        caption="Past month"
        icon="mdi:chart-timeline-variant"
        subinfo="Summary of operations from the last 30 days"
      >
        <template #header>
          <AppButton
            class="add-new-button"
            variant="outlined"
            compact
            icon="mdi:plus"
            :icon-size="20"
            @click="router.push({ name: 'new-expense' })"
          >
            test
          </AppButton>
        </template>
      </DashboardTile>

      <DashboardTile
        id="latest-expenses"
        caption="Latest expenses"
        icon="mdi:cash-minus"
      >
        <template #header>
          <AppButton
            class="add-new-button"
            variant="outlined"
            compact
            icon="mdi:plus"
            :icon-size="20"
            @click="router.push({ name: 'new-expense' })"
          >
            Add new
          </AppButton>
        </template>

        <div ref="expensesListElement" class="operations-list__wrapper">
          <LatestOperationsList :operations="expenses" />
        </div>

        <ShowFullHistoryButton
          :redirect="(location) => router.push(location)"
          variant="expense"
        />
      </DashboardTile>

      <DashboardTile caption="Latest incomes" icon="mdi:cash-plus">
        <template #header>
          <AppButton
            class="add-new-button"
            variant="outlined"
            compact
            icon="mdi:plus"
            :icon-size="20"
            @click="router.push({ name: 'new-income' })"
          >
            Add new
          </AppButton>
        </template>

        <div ref="incomesListElement" class="operations-list__wrapper">
          <LatestOperationsList :operations="incomes" />
        </div>

        <ShowFullHistoryButton
          :redirect="(location) => router.push(location)"
          variant="income"
        />
      </DashboardTile>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import AppLayout from "@app/layouts/AppLayout.vue";
import { AppButton } from "@scrooge/ui-library";

import operationService from "@app/services/operation.service";
import DashboardTile from "../components/DashboardTile.vue";
import ShowFullHistoryButton from "../components/ShowFullHistoryButton.vue";
import LatestOperationsList from "../components/latest-operations/LatestOperationsList.vue";
import { Operation } from "../types";

const router = useRouter();

const expensesListElement = ref<HTMLDivElement>();
const incomesListElement = ref<HTMLDivElement>();

const expenses = ref<Operation[]>([]);
const incomes = ref<Operation[]>([]);

const OPERATION_ITEM_HEIGHT = 41;

onMounted(async () => {
  if (expensesListElement.value && incomesListElement.value) {
    const expenseListHeight =
      expensesListElement.value.getBoundingClientRect().height;
    const incomeListHeight =
      incomesListElement.value.getBoundingClientRect().height;

    const maxExpenseItems = Math.floor(
      expenseListHeight / OPERATION_ITEM_HEIGHT,
    );
    const maxIncomeItems = Math.floor(incomeListHeight / OPERATION_ITEM_HEIGHT);

    [incomes.value, expenses.value] = await Promise.all([
      operationService.getIncomeOperations({ limit: maxIncomeItems }),
      operationService.getExpenseOperations({ limit: maxExpenseItems }),
    ]);
  }
});
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

$dashboardGap: 25px;

#dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: calc(50% - #{$dashboardGap}) 50%;
  gap: $dashboardGap;
  padding: $dashboardGap;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}

#chart {
  grid-column: 1 / 3;
}

.operations-list__wrapper {
  @include utils.useCustomScrollbar(gamma, 6px);

  flex-grow: 1;
  overflow: auto;
}

button.show-full-history-button {
  --p-text-color: #{utils.getColor(delta)};
  margin-top: 10px;
  min-width: 180px;
  border-width: 1px;
  place-self: center;
}

button.add-new-button {
  --p-text-color: #{utils.getColor(gamma)};
  flex-direction: row-reverse;
  border-width: 1px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 14px;
  padding: 2px 4px;
  align-self: center;

  .app-button__caption {
    margin-left: -5px;
    margin-right: 5px;
  }
}
</style>
