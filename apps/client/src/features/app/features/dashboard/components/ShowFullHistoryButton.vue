<template>
  <AppButton
    class="show-full-history-button"
    variant="outlined"
    :compact="true"
    @click="
      redirect({
        name: 'history',
        query: { filter },
      })
    "
  >
    Show full history
  </AppButton>
</template>

<script lang="ts" setup>
import { FilterContainer, filters } from "@scrooge/shared";
import { AppButton } from "@scrooge/ui-library";
import { computed } from "vue";
import { RouteLocationRaw } from "vue-router";

const { variant } = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  redirect: (location: RouteLocationRaw) => any;
  variant: "expense" | "income";
}>();

const filter = computed(() =>
  FilterContainer.fromFilters(
    { operationType: variant.toUpperCase() as Uppercase<typeof variant> },
    { schema: filters.GetOperationsSchema },
  ).stringify(),
);
</script>
