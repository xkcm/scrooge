<template>
  <div class="app-interactive-icon" :style="{ '--p-icon-size': size + 'px' }">
    <Icon :icon="icon" :height="size" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  icon: string;
  size: number;
}>();
</script>

<style lang="scss">
@use "@client-assets/styles/utils.scss";

.app-interactive-icon {
  --p-overlay-color: #{utils.getTextColor(primary, 0.1)};
  --p-overlay-size: calc(var(--p-icon-size) + 6px);

  height: var(--p-icon-size);
  width: var(--p-icon-size);
  cursor: pointer;
  position: relative;

  &:hover::before {
    content: "";
    position: absolute;
    width: var(--p-overlay-size);
    height: var(--p-overlay-size);
    top: calc((var(--p-icon-size) - var(--p-overlay-size)) / 2);
    left: calc((var(--p-icon-size) - var(--p-overlay-size)) / 2);
    z-index: 1;

    border-radius: 50%;
    background-color: var(--p-overlay-color);
  }

  svg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
  }
}
</style>
