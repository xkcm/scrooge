<template>
  <span class="app-breadcrumbs">
    <span v-for="(item, key) of items" :key="key" class="app-breadcrumbs__item">
      <span
        class="app-breadcrumbs__item-content"
        @click="handleClick(item.routeName, item.onClick)"
      >
        {{ item.caption }}
      </span>
      <span class="app-breadcrumbs__item-separator">
        <slot name="separator"> / </slot>
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Breadcrumb } from "./AppBreadcrumbs.types";

defineProps<{
  items: Breadcrumb[];
}>();
const router = useRouter();

const handleClick = (routeName?: string, onClick?: () => any) => {
  if (routeName) {
    router.push({ name: routeName });
  } else {
    onClick?.();
  }
};
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.app-breadcrumbs__item {
  @include utils.useTextColor(primary, 0.6);
  // color: utils.getColor(gamma);

  font-size: 0.75rem;
  font-weight: 300;

  &:last-child .app-breadcrumbs__item-separator {
    display: none;
  }

  &-content:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  &-separator {
    user-select: none;
  }
}
</style>
