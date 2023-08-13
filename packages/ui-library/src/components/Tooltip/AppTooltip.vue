<template>
  <TooltipRoot>
    <TooltipTrigger class="app-tooltip__trigger">
      <slot name="trigger" />
    </TooltipTrigger>
    <Teleport to="body">
      <TooltipContent
        class="app-tooltip__content"
        :class="tooltipClass"
        :side="side"
        :side-offset="sideOffset"
      >
        <slot />
        <TooltipArrow size="8" class="app-tooltip__arrow" />
      </TooltipContent>
    </Teleport>
  </TooltipRoot>
</template>

<script lang="ts" setup>
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "radix-vue";

const { side = "top", sideOffset = 0 } = defineProps<{
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  tooltipClass?: string;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.app-tooltip__trigger {
  all: unset;
}

.app-tooltip__content {
  --p-tooltip-color: #{utils.getColor(gamma)};
  @include utils.useTextColor(secondary, 1);

  background-color: var(--p-tooltip-color);
  font-size: 0.8rem;
  padding: 2px 12px;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 utils.getColor(alpha, 600);
}

.app-tooltip__arrow {
  fill: var(--p-tooltip-color);
}
</style>
