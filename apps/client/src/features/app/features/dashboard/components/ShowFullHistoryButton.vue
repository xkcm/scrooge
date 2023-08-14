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

type ShowFullHistoryButtonProps = {
  redirect: (location: RouteLocationRaw) => any;
  variant: "expense" | "income";
};

const { variant } = defineProps<ShowFullHistoryButtonProps>();

const filter = computed(() =>
  FilterContainer.fromFilters(
    { operationType: variant.toUpperCase() as Uppercase<typeof variant> },
    { schema: filters.GetOperationsSchema },
  ).stringify(),
);
</script>
