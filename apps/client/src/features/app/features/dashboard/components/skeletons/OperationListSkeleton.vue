<template>
  <div class="operations-list__skeleton">
    <AppSkeletonBox
      v-for="index in itemsNumber"
      :key="index"
      class="skeleton-box"
      :animation-delay="`${Math.floor(index * 100)}ms`"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppSkeletonBox } from "@scrooge/ui-library";

defineProps<{
  itemsNumber: number;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.operations-list__skeleton {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  box-sizing: border-box;
  gap: 21px;

  .app-skeleton-box {
    height: 20px;

    &:nth-child(2n) {
      margin-right: 40px;
    }
    &:nth-child(3n) {
      margin-right: 60px;
    }
  }
}
</style>
