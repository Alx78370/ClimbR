<script setup lang="ts">
defineProps<{
  canDelete: boolean;
  onDelete: () => void;
}>();
</script>

<template>
  <button
    v-if="canDelete"
    class="hidden cursor-pointer text-xs text-orange-500 transition-all duration-300 ease-in-out hover:text-orange-600 group-hover:block"
    @click="onDelete"
  >
    <span class="pr-2 text-gray-400">|</span>
    Supprimer
  </button>
</template>
