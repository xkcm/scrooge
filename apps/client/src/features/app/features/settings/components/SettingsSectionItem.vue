<template>
  <div
    class="settings-section__item"
    :class="{ 'settings-section__item--href': href }"
    @click="href && router.push({ name: href })"
  >
    <Icon :icon="icon" :width="24"></Icon>
    <span>{{ text }}</span>

    <Icon
      v-if="href"
      class="settings-section__item__link"
      icon="mdi:chevron-right"
      :width="24"
    ></Icon>

    <AppSelect
      v-else-if="inputType === 'options'"
      :options="options"
      :model-value="selectedOption?.value"
      @update:model-value="onUpdate"
    ></AppSelect>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { AppSelect } from "@scrooge/ui-library";

import { SettingsSectionItemProps } from "../settings.types";

const { options } = defineProps<SettingsSectionItemProps>();
const router = useRouter();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.settings-section__item {
  @include utils.useBgColor(alpha);
  @include utils.useTextColor(primary, 0.4);
  padding: 10px 15px;
  display: flex;
  gap: 15px;
  align-items: center;
  font-weight: 300;

  > span {
    @include utils.useTextColor(primary);
    flex-grow: 1;
  }

  &--href:hover {
    @include utils.useBgColor(alpha, 500);
    cursor: pointer;
  }
}
</style>
