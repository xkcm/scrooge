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
        <ShowFullHistoryButton
          :redirect="(location) => router.push(location)"
          variant="expense"
        />
      </DashboardTile>

      <DashboardTile caption="Latest incomes" icon="mdi:cash-plus">
        <ShowFullHistoryButton
          :redirect="(location) => router.push(location)"
          variant="income"
        />
      </DashboardTile>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import AppLayout from "@app/layouts/AppLayout.vue";
import DashboardTile from "../layouts/DashboardTile.vue";
import ShowFullHistoryButton from "../components/ShowFullHistoryButton.vue";

const router = useRouter();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

$dashboardGap: 25px;

#dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 100%;
  height: 100%;
  gap: $dashboardGap;
  padding: $dashboardGap;
  box-sizing: border-box;
}

#chart {
  grid-column: 1 / 3;
}

button.show-full-history-button {
  --p-text-color: #{utils.getColor(delta)};
  min-width: 180px;
  border-width: 1px;
  place-self: center;
}
</style>
