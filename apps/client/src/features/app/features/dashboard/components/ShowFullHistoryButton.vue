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
import { Router } from "vue-router";
import { AppButton } from "@scrooge/ui-library";

defineProps<{
  redirect: Router["push"];
  variant: "expense" | "income";
}>();
</script>
