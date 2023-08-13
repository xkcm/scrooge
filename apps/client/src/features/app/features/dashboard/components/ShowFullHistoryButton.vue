<template>
  <AppButton
    class="show-full-history-button"
    variant="outlined"
    :compact="true"
    @click="
      redirect({
        name: 'history',
        query: { filter },
        // todo: change this
      })
    "
  >
    Show full history
  </AppButton>
</template>

<script lang="ts" setup>
import { QueryFilter, filters } from "@scrooge/shared";
import { AppButton } from "@scrooge/ui-library";
import { computed } from "vue";
import { RouteLocationRaw } from "vue-router";

type ShowFullHistoryButtonProps = {
  redirect: (location: RouteLocationRaw) => any;
  variant: "expense" | "income";
};

const { variant } = defineProps<ShowFullHistoryButtonProps>();

const filter = computed(() =>
  QueryFilter.fromFilters<{ operationType: string }>(
    { operationType: variant.toUpperCase() },
    filters.GetOperationsFilterQuerySchema,
  ).stringify(),
);
</script>
