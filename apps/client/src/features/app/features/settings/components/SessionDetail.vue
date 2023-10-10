<template>
  <div class="session-detail">
    <div class="session-detail__label">
      {{ label }}
    </div>
    <div class="session-detail__content">
      <slot />
    </div>
    <div class="session-detail__copy-button">
      <Icon icon="mdi:content-copy" height="18" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  label: string;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.session-detail {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1/4;
  height: 50px;
  padding: 0 1rem;
  border: 1px utils.getColor(alpha) solid;

  &__label {
    @include utils.useTextColor(primary);
    font-weight: 600;
  }

  &__label,
  &__content,
  &__copy-button {
    display: flex;
    align-items: center;
  }

  &:hover {
    @include utils.useBgColor(alpha, 500);
  }

  &__copy-button {
    display: none;
    cursor: pointer;
  }

  &:hover &__copy-button {
    display: flex;
  }
}
</style>
