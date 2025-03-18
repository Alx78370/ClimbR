<script setup lang="ts">
const emit = defineEmits<{
  (event: "toggle-comment"): void;
}>();
</script>

<template>
  <button
    class="flex cursor-pointer items-center gap-2"
    @click="emit('toggle-comment')"
  >
    <Icon name="bx:comment-detail" class="text-2xl text-white" />
  </button>
</template>
