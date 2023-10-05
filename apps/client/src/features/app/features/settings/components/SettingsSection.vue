<template>
  <div
    class="settings-section"
    :class="{ 'settings-section__with-items': items }"
  >
    <SettingsSectionItem
      :icon="header.icon"
      :text="header.text"
      :href="header.href"
      class="settings-section__header"
    />
    <SettingsSectionItem v-for="(item, i) of items" :key="i" v-bind="item" />
  </div>
</template>

<script lang="ts" setup>
import { SettingsSectionProps } from "../settings.types";
import SettingsSectionItem from "./SettingsSectionItem.vue";

defineProps<SettingsSectionProps>();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.settings-section {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid utils.getColor(alpha);
  box-sizing: border-box;

  &.settings-section__with-items &__header {
    border-bottom: 1px solid utils.getColor(alpha, 600);
  }

  &__header {
    font-weight: 400;
  }
}
</style>
