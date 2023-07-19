<template>
  <span>{{ message }}</span>
</template>

<script setup lang="ts">
const { message } = defineProps<{
  message: string;
}>();
</script>
