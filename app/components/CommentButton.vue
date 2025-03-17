<script setup lang="ts">
const emit = defineEmits<{
    (event: "toggle-comment"): void;
}>();
</script>

<template>
    <button @click="emit('toggle-comment')" class="cursor-pointer flex items-center gap-2">
        <Icon name="bx:comment-detail" class="text-white text-2xl" />
    </button>
</template>
