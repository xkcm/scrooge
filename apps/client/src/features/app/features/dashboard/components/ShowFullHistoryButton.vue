<template>
  <AppButton
    class="show-full-history-button"
    variant="outlined"
    :compact="true"
    @click="
      redirect({
        name: 'history',
        query: { filter: `operationType:${variant}` },
        // todo: change this
      })
    "
  >
    Show full history
  </AppButton>
</template>

<script lang="ts" setup>
import { AppButton } from "@scrooge/ui-library";
import { RouteLocationRaw } from "vue-router";

type ShowFullHistoryButtonProps = {
  redirect: (location: RouteLocationRaw) => any;
  variant: "expense" | "income";
};

defineProps<ShowFullHistoryButtonProps>();
</script>
