<template v-once>
  <AppLayout header-text="Dashboard">
    <div id="dashboard">
      <DashboardTile
        id="chart"
        caption="Past month"
        icon="mdi:chart-timeline-variant"
        subinfo="Summary of operations from the last 30 days"
      ></DashboardTile>

      <DashboardTile
        id="latest-expenses"
        caption="Latest expenses"
        icon="mdi:cash-minus"
      >
        <div ref="expensesList" class="operations-list__wrapper">
          <LatestOperationsList :operations="expenses" />
        </div>

        <ShowFullHistoryButton
          :redirect="(location) => router.push(location)"
          variant="expense"
        />
      </DashboardTile>

      <DashboardTile caption="Latest incomes" icon="mdi:cash-plus">
        <div ref="incomesList" class="operations-list__wrapper">
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

import apiClient from "@/services/api-client/api-client";
import DashboardTile from "../components/DashboardTile.vue";
import ShowFullHistoryButton from "../components/ShowFullHistoryButton.vue";
import LatestOperationsList from "../components/latest-operations/LatestOperationsList.vue";
import { Operation } from "../types";

const router = useRouter();

const expensesList = ref<HTMLDivElement>();
const incomesList = ref<HTMLDivElement>();

const expenses = ref<Operation[]>([]);
const incomes = ref<Operation[]>([]);

const OPERATION_ITEM_HEIGHT = 41;

onMounted(async () => {
  if (expensesList.value && incomesList.value) {
    const expensesListHeight =
      expensesList.value.getBoundingClientRect().height;
    const incomesListHeight = incomesList.value.getBoundingClientRect().height;

    const maxExpenseItems = Math.floor(
      expensesListHeight / OPERATION_ITEM_HEIGHT,
    );
    const maxIncomeItems = Math.floor(
      incomesListHeight / OPERATION_ITEM_HEIGHT,
    );

    console.info({ maxExpenseItems, maxIncomeItems });

    incomes.value = await apiClient.operation.getOperations({
      operationType: "INCOME",
    });
    expenses.value = await apiClient.operation.getOperations({
      operationType: "EXPENSE",
    });
  }
});
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

$dashboardGap: 25px;

#dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
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
  flex-grow: 1;
}

button.show-full-history-button {
  --p-text-color: #{utils.getColor(delta)};
  min-width: 180px;
  border-width: 1px;
  place-self: center;
}
</style>
