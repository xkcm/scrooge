<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger class="app-tooltip__trigger">
        <slot name="trigger" />
      </TooltipTrigger>
      <Teleport to="body">
        <TooltipContent
          class="app-tooltip"
          :class="tooltipClass"
          :side="side"
          :side-offset="sideOffset"
        >
          <slot />
        </TooltipContent>
      </Teleport>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script lang="ts" setup>
import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "radix-vue";

const { side = "top", sideOffset = 0 } = defineProps<{
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  tooltipClass?: string;
}>();
</script>

<style lang="scss">
@use "@client-assets/styles/utils.scss";

.app-tooltip {
  --p-tooltip-color: #{utils.getColor(alpha)};
  --p-tooltip-text-color: #{utils.getTextColor(primary)};

  background-color: var(--p-tooltip-color);
  color: var(--p-tooltip-text-color);
  font-size: 0.9rem;
  padding: 8px 14px;
  border-radius: 16px;
  box-shadow: 0px 2px 6px 0 utils.getColor(alpha, 600, 0.4);
  border: 1px solid utils.getColor(alpha, 600);
}

.app-tooltip__arrow {
  fill: var(--p-tooltip-color);
}

.app-tooltip__trigger {
  @include utils.clearButtonStyles;
}
</style>
