<template>
  <div class="dashboard-tile">
    <div class="dashboard-tile__title">
      <Icon width="25" :icon="icon" />
      <h4>{{ caption }}</h4>
    </div>
    <span v-if="subinfo" class="dashboard-tile__subinfo">
      Summary of operations from the last 30 days
      {{ subinfo }}
    </span>

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
  padding: 15px 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &__title {
    @include utils.useTextColor(beta);
    display: flex;
    align-items: center;

    h4 {
      margin-left: 8px;
      font-size: 1.5rem;
      font-weight: 500;
    }
  }

  &__subinfo {
    @include utils.useTextColor(primary, 0.6);
    margin-left: 33px;
    margin-top: 5px;
  }
}
</style>
