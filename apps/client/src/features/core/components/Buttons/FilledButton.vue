<template>
  <button class="button" type="button">
    <span class="button__caption">
      <span>{{ props.caption }}</span>
      <Icon
        v-if="props.icon"
        class="button__icon"
        :icon="props.icon"
        height="24"
      />
    </span>
  </button>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = defineProps<{
  caption: string;
  icon?: string;
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
  margin: 0 0.2em;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.button__icon {
  @include utils.useTextColor(secondary);
  position: absolute;
  right: 0;
}
</style>
