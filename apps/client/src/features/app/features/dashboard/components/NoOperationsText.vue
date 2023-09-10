<template>
  <div class="operations-list__message">
    No operations yet, you can add new operation
    <span tabindex="0" @keyup.enter="redirect" @click="redirect">here</span>.
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  redirect: () => void;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.operations-list__message {
  @include utils.useTextColor(primary, 0.3);
  font-weight: 300;
  margin: auto;

  > span {
    cursor: pointer;
    color: utils.getColor(delta, 400);
    font-weight: 400;

    &:hover {
      color: utils.getColor(delta, 500);
    }
    &:active {
      color: utils.getColor(delta, 600);
    }
  }
}
</style>
