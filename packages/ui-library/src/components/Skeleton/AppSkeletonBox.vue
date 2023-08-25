<template>
  <div class="app-skeleton-box"></div>
</template>

<script lang="ts" setup>
const { animationDelay = "0s", animationDuration = "2s" } = defineProps<{
  animationDuration?: `${number}${"s" | "ms"}`;
  animationDelay?: `${number}${"s" | "ms"}`;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.app-skeleton-box {
  --p-bg-color: #{utils.getColor(beta, 400, 0.1)};
  --p-shimmer-color: #{utils.getColor(alpha, 400, 0.3)};

  background-color: var(--p-bg-color);
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      transparent 0,
      var(--p-shimmer-color) 20%,
      var(--p-shimmer-color) 60%,
      transparent
    );
    animation: shimmer v-bind(animationDuration) infinite;
    animation-delay: v-bind(animationDelay);
    animation-timing-function: ease-in-out;
    content: "";
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}
</style>
