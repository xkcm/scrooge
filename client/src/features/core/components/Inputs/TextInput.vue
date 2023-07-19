<template>
  <div class="input text-input">
    <div class="input__icon">
      <slot class="input__icon-body" name="icon"></slot>
    </div>

    <input v-model="modelValue" type="text" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
import "./styles/common.scss";

const { placeholder } = defineProps<{
  placeholder?: string;
}>();
const modelValue = defineModel<string>();
</script>
