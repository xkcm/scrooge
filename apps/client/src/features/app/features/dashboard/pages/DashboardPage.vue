<template v-once>
  <AppLayout header-text="Dashboard">
    <div id="dashboard" :class="loading && 'dashboard--loading'">
      <DashboardTile
        id="chart"
        caption="Past month"
        icon="mdi:chart-timeline-variant"
        subinfo="Summary of operations from the last 30 days"
      >
        <template #header>
          <!-- todo: add switch components -->
          Incomes
          <input v-model="datasets.income.isShown" type="checkbox" />
          Expenses
          <input v-model="datasets.expense.isShown" type="checkbox" />
        </template>

        <div id="operations-summary-chart__wrapper" ref="operationsChart">
          <OperationsChart
            v-if="!loading"
            :height="chartSize.height"
            :width="chartSize.width"
            :chart-data="chartData"
            :chart-options="chartOptions"
          />
          <AppSkeletonBox v-else id="chart-skeleton" />
        </div>
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
          <LatestOperationsList v-if="!loading" :operations="expenses" />
          <OperationListSkeleton v-else :items-number="maxExpenseItemsNumber" />
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
          <LatestOperationsList v-if="!loading" :operations="incomes" />
          <OperationListSkeleton v-else :items-number="maxIncomeItemsNumber" />
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
import { AppButton, AppSkeletonBox } from "@scrooge/ui-library";
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import AppLayout from "@app/layouts/AppLayout.vue";

import DashboardTile from "../components/DashboardTile.vue";
import ShowFullHistoryButton from "../components/ShowFullHistoryButton.vue";
import LatestOperationsList from "../components/latest-operations/LatestOperationsList.vue";
import OperationsChart from "../components/OperationsChart.vue";
import OperationListSkeleton from "../components/skeletons/OperationListSkeleton.vue";

import operationService from "@app/services/operation.service";
import { Operation } from "../types";

const router = useRouter();

const OPERATION_ITEM_HEIGHT = 41;
const maxExpenseItemsNumber = ref(0);
const maxIncomeItemsNumber = ref(0);

const expensesListElement = ref<HTMLDivElement>();
const incomesListElement = ref<HTMLDivElement>();
const operationsChart = ref<HTMLDivElement>();

const expenses = ref<Operation[]>([]);
const incomes = ref<Operation[]>([]);
const chartSize = reactive({
  height: 0,
  width: 0,
});

const loading = ref(true);

const datasets = reactive({
  income: {
    isShown: true,
    dataset: { data: [40, 20, 12, 30, 94, 129, 30, 12], label: "Incomes" },
  },
  expense: {
    isShown: true,
    dataset: { data: [20, 40, 22, 89, 20, 19, 31, 21], label: "Expenses" },
  },
});

const chartData = computed(() => {
  const chartDatasets = [];

  if (datasets.income.isShown) {
    chartDatasets.push(datasets.income.dataset);
  }
  if (datasets.expense.isShown) {
    chartDatasets.push(datasets.expense.dataset);
  }

  return {
    labels: [
      "01/01",
      "02/01",
      "03/01",
      "04/01",
      "05/01",
      "06/01",
      "07/01",
      "08/01",
    ],
    datasets: chartDatasets,
  };
});

const chartOptions = {
  responsive: true,
};

onMounted(async () => {
  if (expensesListElement.value && incomesListElement.value) {
    const expenseListHeight =
      expensesListElement.value.getBoundingClientRect().height;
    const incomeListHeight =
      incomesListElement.value.getBoundingClientRect().height;

    maxExpenseItemsNumber.value = Math.floor(
      expenseListHeight / OPERATION_ITEM_HEIGHT,
    );
    maxIncomeItemsNumber.value = Math.floor(
      incomeListHeight / OPERATION_ITEM_HEIGHT,
    );

    const { expenses: apiExpenses, incomes: apiIncomes } =
      await operationService.getLatestOperations(
        maxIncomeItemsNumber.value,
        maxExpenseItemsNumber.value,
      );
    incomes.value = apiIncomes;
    expenses.value = apiExpenses;
  }

  if (operationsChart.value) {
    const { height, width } = operationsChart.value.getBoundingClientRect();
    chartSize.height = height;
    chartSize.width = width;
  }

  loading.value = false;
});
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

$dashboardGap: 25px;

#dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(0, 1fr) 50%;
  gap: $dashboardGap;
  padding: $dashboardGap;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}

#chart {
  grid-column: 1 / 3;
}

#operations-summary-chart__wrapper:has(#chart-skeleton) {
  padding: 15px 20px;
  box-sizing: border-box;
  #chart-skeleton {
    height: 100%;
  }
}

#operations-summary-chart__wrapper {
  flex-grow: 1;
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
