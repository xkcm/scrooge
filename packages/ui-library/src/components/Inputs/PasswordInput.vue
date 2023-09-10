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
      <Icon
        v-if="currentType === 'password'"
        icon="mdi:eye-outline"
        height="24"
      />
      <Icon v-else icon="mdi:eye-off-outline" height="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { Icon } from "@iconify/vue";

import "./styles/common.scss";

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
