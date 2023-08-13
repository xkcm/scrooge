<template>
  <button class="app-button" :class="classList" type="button">
    <span class="app-button__caption">
      <slot />
    </span>
    <Icon
      v-if="icon"
      class="app-button__icon"
      :icon="icon"
      :height="iconHeight"
    />
  </button>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";

const {
  variant = "filled",
  compact = false,
  iconSize,
} = defineProps<{
  variant?: "filled" | "outlined";
  icon?: string;
  iconSize?: number;
  compact?: boolean;
}>();

const classList = computed(() => {
  const classes = [`app-button--${variant}`];
  if (compact) {
    classes.push("app-button--compact");
  }
  return classes;
});

const iconHeight = computed(() => iconSize ?? (compact ? 24 : 18));
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.app-button {
  all: unset;
  outline: none;
  border: none;
  cursor: pointer;
  font-family: inherit;

  padding: 8px 20px;
  box-sizing: border-box;
  border-radius: 10px;
  outline-offset: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  background-color: var(--p-bg-color);
  color: var(--p-text-color);

  &:focus-visible {
    @include utils.defaultOutlineOnFocus;
  }

  &--filled {
    --p-bg-color: #{utils.getColor(beta)};
    --p-text-color: #{utils.getTextColor(secondary)};

    &:hover {
      --p-bg-color: #{utils.getColor(beta, 500)};
    }

    &:active {
      --p-bg-color: #{utils.getColor(beta, 600)};
    }
  }

  &--outlined {
    --p-bg-color: #{utils.getColor(alpha)};
    --p-text-color: #{utils.getColor(beta)};
    border: 2px solid var(--p-text-color);

    .app-button__caption {
      font-weight: 500;
    }

    &:hover {
      --p-bg-color: #{utils.getColor(alpha, 500)};
    }

    &:active {
      --p-bg-color: #{utils.getColor(alpha, 600)};
    }
  }

  &--compact {
    padding: 5px 10px;

    .app-button__caption {
      font-size: 0.75rem;
      line-height: 1.125rem;
      font-weight: 600;
    }
  }
}

.app-button__caption {
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: -0.15px;
}
</style>
