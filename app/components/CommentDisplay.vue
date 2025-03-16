<script setup lang="ts">

const props = defineProps<{
    blocId: number;
    commentCount: number;
    customText?: string; // ✅ Texte personnalisé
    hideIfEmpty?: boolean; // ✅ Masquer si `commentCount === 0`
    minComments?: number; // ✅ Afficher seulement si `commentCount >= minComments`
}>();

const isModalOpen = ref(false);
const { comments, fetchComments } = useComment(props.blocId);

// ✅ Ouvrir la modal et charger les commentaires
const openModal = async () => {
    isModalOpen.value = true;
    if (comments.value.length === 0) {
        await fetchComments();
    }
};

const closeModal = () => {
    isModalOpen.value = false;
};

const commentText = computed(() =>
    props.commentCount === 1 ? "1 commentaire" : `${props.commentCount} commentaires`
);
</script>

<template>
    <!-- ✅ Conditions d'affichage -->
    <div v-if="(!hideIfEmpty || commentCount > 0) && (!minComments || commentCount >= minComments)"
        class="flex items-center gap-1 text-white cursor-pointer hover:text-orange-500 transition-all duration-300 ease-in-out text-sm"
        @click="openModal">

        <!-- ✅ Slot pour personnaliser l'affichage -->
        <slot :comment-count="commentCount">{{ customText || commentText }}</slot>
    </div>

    <!-- ✅ Affichage du composant modal -->
    <CommentModal :comments="comments" :is-open="isModalOpen" :bloc-id="blocId" :fetch-comments="fetchComments"
        @close="closeModal" />
</template>
