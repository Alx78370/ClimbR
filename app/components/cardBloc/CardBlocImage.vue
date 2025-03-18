<script setup lang="ts">
defineProps<{
  media?: string;
  altText: string;
}>();
</script>

<template>
  <img
    :src="media"
    :alt="altText"
    class="h-[500px] w-full rounded object-cover"
  />
</template>
