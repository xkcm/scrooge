<template>
  <button
    class="app-button"
    :class="classList"
    type="button"
    :disabled="disabled || loading"
    :data-loading="loading"
    :data-disabled="disabled"
  >
    <span class="app-button__caption">
      <slot />
    </span>
    <Icon
      v-if="icon"
      class="app-button__icon"
      :icon="icon"
      :height="resolvedIconSize"
    />

    <Icon
      class="app-button__loading-icon"
      icon="mdi:loading"
      :height="resolvedIconSize * 1.25"
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
  loading?: boolean;
  disabled?: boolean;
}>();

const classList = computed(() => {
  const classes = [`app-button--${variant}`];
  if (compact) {
    classes.push("app-button--compact");
  }
  return classes;
});

const resolvedIconSize = computed(() => iconSize ?? (compact ? 24 : 18));
</script>

<style lang="scss">
@use "@client-assets/styles/utils.scss";

.app-button {
  all: unset;
  outline: none;
  border: none;
  cursor: pointer;
  font-family: inherit;

  padding: 5px 20px;
  position: relative;
  box-sizing: border-box;
  border-radius: 10px;
  outline-offset: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  background-color: var(--p-bg-color);
  color: var(--p-text-color);

  &[data-loading="true"] {
    cursor: progress;
    .app-button__loading-icon {
      display: block;
    }
  }

  &[data-loading="true"],
  &[data-disabled="true"] {
    &::before {
      content: "";

      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      @include utils.useBgColor(alpha, 400, 0.6);
      border-radius: 10px;
    }
  }

  &[data-disabled="true"] {
    cursor: not-allowed;
  }

  &__loading-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: 0 0;
    display: none;
    animation: rotate 0.5s linear infinite;
    color: utils.getColor(alpha);
    @include utils.useTheme(dark) {
      color: utils.getTextColor(primary);
    }
  }

  &:focus-visible {
    @include utils.useDefaultOutline;
  }

  &--filled {
    --p-bg-color: #{utils.getColor(beta)};
    --p-text-color: #{utils.getTextColor(secondary)};

    @include utils.useTheme(dark) {
      --p-text-color: #{utils.getTextColor(primary)};
    }

    &:not([disabled]):hover {
      --p-bg-color: #{utils.getColor(beta, 500)};
    }

    &:not([disabled]):active {
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

    &:not([disabled]):hover {
      --p-bg-color: #{utils.getColor(alpha, 500)};
    }

    &:not([disabled]):active {
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
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: -0.15px;
}

@keyframes rotate {
  0% {
    rotate: 0deg;
  }
  100% {
    rotate: 360deg;
  }
}
</style>
