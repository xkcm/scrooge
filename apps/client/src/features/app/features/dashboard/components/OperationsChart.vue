<template>
  <div class="app-bar-chart">
    <Line :options="chartOptions" :data="chartData" :style="style"></Line>
  </div>
</template>

<script lang="ts" setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  ChartData,
  ChartOptions,
  PointElement,
} from "chart.js";
import { computed } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
);

const { height, width } = defineProps<{
  height?: number;
  width?: number;

  chartData: ChartData<"line">;
  chartOptions: ChartOptions;
}>();

const style = computed(() => {
  const stylesObject: Record<string, any> = {};

  if (height) {
    stylesObject.height = height + "px";
  }
  if (width) {
    stylesObject.width = width + "px";
  }

  return stylesObject;
});
</script>

<style lang="scss">
.app-bar-chart {
  canvas {
    position: relative;
  }
}
</style>
