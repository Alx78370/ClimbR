<script setup lang="ts">
defineProps<{
    canDelete: boolean;
    onDelete: () => void;
}>();
</script>

<template>
    <button v-if="canDelete"
        class="hidden group-hover:block transition-all duration-300 ease-in-out text-orange-500 hover:text-orange-600 text-xs cursor-pointer"
        @click="onDelete">
        <span class="text-gray-400 pr-2">|</span>Supprimer
    </button>
</template>
