<template>
  <div class="error-box__wrapper">
    <div class="error-box">
      <div class="error-box__icon">
        <Icon icon="mdi:alert-octagon" height="48"></Icon>
      </div>
      <h4 class="error-box__header">{{ title }}</h4>
      <span class="error-box__message">{{ message }}</span>
      <span class="error-box__submessage">
        Try refreshing the app or try later
      </span>
      <MyBrandButton text="Hello maciej"></MyBrandButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { MyBrandButton } from "@scrooge/ui-library";

const { message, title = "Critical error" } = withDefaults(
  defineProps<{
    title?: string;
    message: string;
  }>(),
  {
    title: "Critical error",
  },
);
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.error-box__wrapper {
  @include utils.useBgColor(alpha, 400, 0.9);
  display: grid;
  width: 100%;
  height: 100vh;
}

.error-box {
  @include utils.useBgColor(error);
  @include utils.useTextColor(light);
  padding: 1em 2em;
  display: grid;
  grid-template-columns: min-content max-content;
  margin: auto;
  place-self: center;
  border-radius: 10px;
  box-shadow: 2px 2px 5px 0 utils.getColor(error, 400, 0.5);

  .error-box__icon {
    grid-row: 1 / 4;
    margin-right: 2em;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      margin: auto;
    }
  }

  .error-box__header {
    font-weight: 500;
  }

  .error-box__submessage {
    font-weight: 300;
    font-size: 0.9em;
  }
}
</style>
