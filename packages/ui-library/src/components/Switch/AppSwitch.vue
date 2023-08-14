<template>
  <SwitchRoot
    v-model:open="modelValue"
    class="app-switch"
    :class="modelValue && 'app-switch--enabled'"
  >
    <SwitchThumb class="app-switch__thumb"></SwitchThumb>
  </SwitchRoot>
</template>

<script lang="ts" setup>
import { SwitchRoot, SwitchThumb } from "radix-vue";

const modelValue = defineModel<boolean>();
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.app-switch {
  --p-background-color: #{utils.getColor(gamma, 600, 0.4)};
  width: 30px;
  height: 14px;
  border-radius: 10px;
  background-color: var(--p-background-color);
  position: relative;

  &.app-switch--enabled {
    --p-background-color: #{utils.getColor(gamma, 600)};

    .app-switch__thumb {
      left: calc(100% - 13px);
    }
  }

  input {
    cursor: pointer;
  }
}

.app-switch__thumb {
  --p-thumb-color: #{utils.getColor(alpha)};
  display: block;
  background-color: var(--p-thumb-color);
  height: 12px;
  width: 12px;
  border-radius: 50%;
  position: absolute;
  left: 1px;
  top: 1px;
  bottom: 1px;

  transition: 0.25s left ease-in-out;
}
</style>
