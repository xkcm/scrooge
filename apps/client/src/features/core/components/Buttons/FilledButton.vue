<template>
  <button class="button" type="button">
    <span class="button__caption">{{ props.caption }}</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  caption: string;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.button {
  @include utils.useBgColor(beta);
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  outline: none;
  border: none;
  cursor: pointer;

  &:hover {
    @include utils.useBgColor(beta, 500);
  }

  &:active {
    @include utils.useBgColor(beta, 600);
  }

  &:focus-visible {
    @include utils.defaultOutlineOnFocus;
    outline-offset: 1px;
  }
}

.button__caption {
  @include utils.useTextColor(secondary);
  font-family: Poppins;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: -0.15px;
}
</style>
