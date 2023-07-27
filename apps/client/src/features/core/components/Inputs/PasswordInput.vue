<template>
  <div class="input password-input">
    <div class="input__icon">
      <slot class="input__icon-body" name="icon"></slot>
    </div>

    <input
      v-model="modelValue"
      :type="currentType"
      :placeholder="placeholder"
    />

    <button class="input__icon" type="button" @click="toggleType">
      <OpenEyeIcon v-if="currentType === 'password'" />
      <ClosedEyeIcon v-else />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineModel } from "vue";
import "./styles/common.scss";

import OpenEyeIcon from "@icons/View_light.svg";
import ClosedEyeIcon from "@icons/View_hide_light.svg";

const { placeholder } = defineProps<{
  placeholder?: string;
}>();
const modelValue = defineModel<string>();

const currentType = ref<"password" | "text">("password");
const toggleType = () =>
  (currentType.value = currentType.value === "password" ? "text" : "password");
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

button.input__icon {
  @include utils.useBgColor(alpha);
  outline: none;
  border: none;
  cursor: pointer;
  margin-left: 14px;
  padding: 0;

  &:focus-visible {
    @include utils.defaultOutlineOnFocus;
  }
}
</style>
