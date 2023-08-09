<template>
  <ErrorLayout v-if="errorMessage" :message="errorMessage"></ErrorLayout>
  <Suspense v-else>
    <App></App>
    <template #fallback>
      <LoadingLayout></LoadingLayout>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from "vue";
import { initTheme } from "@/services/theme/theme";

import App from "./AppLayout.vue";
import LoadingLayout from "./LoadingLayout.vue";
import ErrorLayout from "./ErrorLayout.vue";

initTheme();

// todo: add loading screen and error handling
const errorMessage = ref<string>();
onErrorCaptured((error) => {
  errorMessage.value = error.message;
});
</script>
@/services/theme
