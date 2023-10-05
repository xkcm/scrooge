<template>
  <div class="settings-section__item">
    <Icon :icon="icon" :width="24"></Icon>
    <span>{{ text }}</span>

    <Icon
      v-if="href"
      class="settings-section__item__link"
      icon="mdi:chevron-right"
      :width="24"
      @click="router.push({ name: href })"
    ></Icon>

    <AppSelect
      v-else-if="inputType === 'options'"
      :options="options"
      :model-value="selectedOption"
      @update:model-value="onUpdate"
    ></AppSelect>
    <!-- <select
      v-else-if="inputType === 'options'"
      @change="onUpdate?.(($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="option of options"
        :key="option.value"
        :value="option.value"
        :selected="option.selected"
      >
        {{ option.caption }}
      </option>
    </select> -->
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { SettingsSectionItemProps } from "../settings.types";
import { AppSelect } from "@scrooge/ui-library";

defineProps<SettingsSectionItemProps>();

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

  &__link {
    cursor: pointer;
  }
}
</style>
