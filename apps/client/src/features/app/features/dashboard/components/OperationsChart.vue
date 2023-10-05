<template>
  <div class="app-bar-chart">
    <Line
      v-if="!isEmpty"
      :options="resolvedChartOptions"
      :data="chartData"
      :style="style"
    />
    <NoOperationsText
      v-else
      :redirect="() => router.push({ name: 'new-operation' })"
    />
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
import NoOperationsText from "./NoOperationsText.vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/services/theme/theme.store";
import {
  themeColorToRgb,
  themeColorToRgba,
} from "@/services/theme/theme.utils";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
);

const router = useRouter();
const themeStore = useThemeStore();

const { height, width, chartData, chartOptions } = defineProps<{
  height?: number;
  width?: number;

  isEmpty: boolean;
  chartData: ChartData<"line">;
  chartOptions: ChartOptions<"line">;
}>();

const resolvedChartOptions = computed<ChartOptions<"line">>(() => ({
  plugins: {
    tooltip: {
      enabled: true,
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: "Poppins",
          weight: "500",
          size: 12,
        },
        color: themeColorToRgba(
          themeStore.themeProperties.textColors.primary,
          0.5,
        ),
      },
    },
    y: {
      grid: {
        color: themeColorToRgb(themeStore.themeProperties.colors.alpha[600]),
      },
      border: {
        display: false,
      },
      ticks: {
        color: themeColorToRgba(
          themeStore.themeProperties.textColors.primary,
          0.5,
        ),
        font: {
          family: "Poppins",
          weight: "500",
          size: 12,
        },
      },
      beginAtZero: true,
    },
  },
  locale: navigator.language,
  interaction: {
    mode: "nearest",
  },
  borderColor: "black",
  ...chartOptions,
}));

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
  height: 100%;
  display: flex;

  canvas {
    position: relative;
  }
}
</style>
