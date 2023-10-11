<template>
  <div class="session-detail">
    <div class="session-detail__label">
      {{ label }}
    </div>
    <div class="session-detail__content" :data-unknown="!value">
      <slot>{{ value || "N/A" }}</slot>
    </div>
    <div v-if="value" class="session-detail__copy-button">
      <AppTooltip side="left">
        <template #trigger>
          <AppInteractiveIcon
            icon="mdi:content-copy"
            :size="18"
            @click="value && copyText(value)"
          />
        </template>
        Copy to clipboard
      </AppTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppInteractiveIcon, AppTooltip } from "@scrooge/ui-library";

import notificationService from "@/features/notifications/notification.service";

defineProps<{
  label: string;
  value?: string | null;
}>();

const copyText = async (value: string) => {
  await navigator.clipboard.writeText(value);

  notificationService.pushNotification({
    title: "Copied to clipboard",
    type: "info",
  });
};
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
  @include utils.useTextColor(primary);

  &__label {
    font-weight: 600;
  }

  &__label,
  &__content,
  &__copy-button {
    display: flex;
    align-items: center;
  }

  &__content[data-unknown="true"] {
    @include utils.useTextColor(primary, 0.4);
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
