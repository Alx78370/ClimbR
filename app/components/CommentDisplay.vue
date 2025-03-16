<script setup lang="ts">

const props = defineProps<{
    commentCount: number;
}>();

const commentText = computed(() =>
    props.commentCount === 1 ? "1 commentaire" : `${props.commentCount} commentaires`
);
</script>

<template>
    <div v-if="commentCount > 0" class="flex items-center gap-1 text-white">
        <span class="text-sm">{{ commentText }}</span>
    </div>
</template>
