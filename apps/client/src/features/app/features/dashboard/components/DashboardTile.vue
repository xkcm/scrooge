<template>
  <div class="dashboard-tile">
    <div class="dashboard-tile__header">
      <div class="dashboard-tile__title">
        <Icon width="25" :icon="icon" />
        <h4>{{ caption }}</h4>
        <slot name="header" />
      </div>

      <span v-if="subinfo" class="dashboard-tile__subinfo">
        {{ subinfo }}
      </span>
    </div>

    <slot />
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";

defineProps<{
  caption: string;
  icon: string;
  subinfo?: string;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.dashboard-tile {
  @include utils.useBgColor(alpha);
  border-radius: 10px;
  padding: 25px;
  padding-top: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &__header {
    padding-bottom: 15px;
  }

  &__title {
    color: utils.getColor(beta);
    display: flex;
    align-items: center;

    h4 {
      flex-grow: 1;
      margin-left: 8px;
      font-size: 1.5rem;
      font-weight: 500;
    }
  }

  &__subinfo {
    @include utils.useTextColor(primary, 0.6);
    font-size: 0.875rem;
    padding-left: 33px;
    margin-top: 5px;
  }
}
</style>
