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
  transition: background-color 0.1s ease-in-out;

  &:hover {
    @include utils.useBgColor(beta, 300);
  }

  &:active {
    @include utils.useBgColor(beta, 200);
  }

  &:focus-visible {
    @include utils.defaultOutlineOnFocus;
    outline-offset: 1px;
  }
}

.button__caption {
  @include utils.useTextColor(beta);
  font-family: Poppins;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: -0.15px;
}
</style>
