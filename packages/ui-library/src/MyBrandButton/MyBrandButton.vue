<template>
  <span>Hello, it's {{ new Date() }}</span>
  <span>{{ text }}</span>
</template>

<script lang="ts" setup>
const { text } = defineProps<{
  text: string;
}>();
</script>
