<template>
  <AppLayout header-text="Dashboard">
    <div id="dashboard" :class="loading && 'dashboard--loading'">
      <DashboardTile
        id="chart"
        caption="Past month"
        icon="mdi:chart-timeline-variant"
        subinfo="Summary of operations from the last 30 days"
      >
        <template #header>
          <div v-if="operationsNumber > 0" class="chart-switch__container">
            <div
              class="chart-switch chart-switch--income"
              :class="!showIncomeDataset && 'chart-switch--disabled'"
            >
              <label for="incomes-switch"> Incomes </label>
              <AppSwitch id="incomes-switch" v-model="showIncomeDataset" />
            </div>

            <div
              class="chart-switch chart-switch--expense"
              :class="!showExpenseDataset && 'chart-switch--disabled'"
            >
              <label for="expenses-switch"> Expenses </label>
              <AppSwitch id="expenses-switch" v-model="showExpenseDataset" />
            </div>
          </div>
        </template>

        <div id="operations-summary-chart__wrapper" ref="operationsChart">
          <OperationsChart
            v-if="!loading"
            :height="chartSize.height"
            :width="chartSize.width"
            :chart-data="chartData"
            :chart-options="chartOptions"
            :is-empty="operationsNumber === 0"
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

        <div ref="expenseList" class="operations-list__wrapper">
          <LatestOperationsList
            v-if="!loading"
            :operations="expenseItems"
            type="EXPENSE"
          />
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

        <div ref="incomeList" class="operations-list__wrapper">
          <LatestOperationsList
            v-if="!loading"
            :operations="incomeItems"
            type="INCOME"
          />
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
import { AppButton, AppSkeletonBox, AppSwitch } from "@scrooge/ui-library";
import moment from "moment";
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import AppLayout from "@app/layouts/AppLayout.vue";

import DashboardTile from "../../components/DashboardTile.vue";
import OperationsChart from "../../components/OperationsChart.vue";
import ShowFullHistoryButton from "../../components/ShowFullHistoryButton.vue";
import LatestOperationsList from "../../components/latest-operations/LatestOperationsList.vue";
import OperationListSkeleton from "../../components/skeletons/OperationListSkeleton.vue";

import { useThemeStore } from "@/services/theme/theme.store";
import { themeColorToRgb } from "@/services/theme/theme.utils";
import operationService from "@app/services/operation.service";
import { ChartData, ChartDataset } from "chart.js";
import { Operation } from "../../types";
import {
  calculateMaxItemsNumber,
  isRefDefined,
  mapApiDataToChartDatasets,
} from "./DashboardPage.helpers";

const router = useRouter();
const themeStore = useThemeStore();

const OPERATION_ITEM_HEIGHT = 41;
const maxExpenseItemsNumber = ref(0);
const maxIncomeItemsNumber = ref(0);

const operationsNumber = computed(
  () => incomeItems.value.length + expenseItems.value.length,
);

const expenseList = ref<HTMLDivElement>();
const incomeList = ref<HTMLDivElement>();
const operationsChart = ref<HTMLDivElement>();

const expenseItems = ref<Operation[]>([]);
const incomeItems = ref<Operation[]>([]);
const chartSize = reactive({
  height: 0,
  width: 0,
});

const incomeDataset = ref<number[]>([]);
const expenseDataset = ref<number[]>([]);
const labels = ref<string[]>([]);
const loading = ref(true);
const showIncomeDataset = ref(true);
const showExpenseDataset = ref(true);

const chartData = computed<ChartData<"line">>(() => {
  const chartDatasets: ChartDataset<"line">[] = [];
  const commonOptions: Partial<ChartDataset<"line">> = {
    tension: 0,
    pointRadius: 4,
    borderWidth: 2,
  };

  if (showIncomeDataset.value) {
    const lineColor = themeColorToRgb(themeStore.themeProperties.colors.green);
    chartDatasets.push({
      ...commonOptions,
      data: incomeDataset.value,
      label: "Incomes",
      borderColor: lineColor,
      pointBackgroundColor: lineColor,
    });
  }
  if (showExpenseDataset.value) {
    const lineColor = themeColorToRgb(themeStore.themeProperties.colors.red);
    chartDatasets.push({
      ...commonOptions,
      data: expenseDataset.value,
      label: "Expenses",
      borderColor: lineColor,
      pointBackgroundColor: lineColor,
    });
  }

  return {
    labels: labels.value,
    datasets: chartDatasets,
  };
});

const chartOptions = {
  responsive: true,
};

onMounted(async () => {
  if (isRefDefined(expenseList) && isRefDefined(incomeList)) {
    maxExpenseItemsNumber.value = calculateMaxItemsNumber(
      expenseList,
      OPERATION_ITEM_HEIGHT,
    );
    maxIncomeItemsNumber.value = calculateMaxItemsNumber(
      incomeList,
      OPERATION_ITEM_HEIGHT,
    );

    const { expenses: apiExpenses, incomes: apiIncomes } =
      await operationService.getLatestOperations(
        maxIncomeItemsNumber.value,
        maxExpenseItemsNumber.value,
      );

    incomeItems.value = apiIncomes;
    expenseItems.value = apiExpenses;
  }

  if (isRefDefined(operationsChart)) {
    const { height, width } = operationsChart.value.getBoundingClientRect();

    const summary = await operationService.getOperationsPeriodSummary({
      periodGroup: "day",
      from: moment().startOf("day").subtract(28, "days").valueOf(),
      to: moment().add(1, "day").endOf("day").valueOf(),
      timezone: new Date().getTimezoneOffset(),
    });

    const mappedData = mapApiDataToChartDatasets(summary, navigator.language);

    chartSize.height = height;
    chartSize.width = width;
    labels.value = mappedData.labels;
    expenseDataset.value = mappedData.expenseDataset;
    incomeDataset.value = mappedData.incomeDataset;
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
  padding: 0 20px;
  box-sizing: border-box;
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

.chart-switch__container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  right: 25px;
  top: 15px;

  .chart-switch {
    color: var(--p-legend-color);
    font-size: 0.9rem;
    font-weight: 400;
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: 0.25s color ease-in-out;

    &.chart-switch--income {
      --p-legend-color: #{utils.getColor(green)};
      &.chart-switch--disabled {
        --p-legend-color: #{utils.getColor(green, 400, 0.4)};
      }
    }
    &.chart-switch--expense {
      --p-legend-color: #{utils.getColor(red)};
      &.chart-switch--disabled {
        --p-legend-color: #{utils.getColor(red, 400, 0.4)};
      }
    }

    label::before {
      $squareSize: 0.65rem;
      content: "";
      position: absolute;
      height: $squareSize;
      width: $squareSize;
      border-radius: 2px;
      background-color: var(--p-legend-color);
      left: 0;
      top: 50%;
      transform: translate(calc(-#{$squareSize} - 0.25rem), -50%);
      transition: 0.25s background-color ease-in-out;
    }
  }
}
</style>
