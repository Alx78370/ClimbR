<script setup lang="ts">

const props = defineProps<{
    blocId: number;
    commentCount: number;
}>();

const isModalOpen = ref(false);
const { comments, fetchComments } = useComment(props.blocId);

// ✅ Fonction pour ouvrir la modal et charger les commentaires
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
    <!-- ✅ Texte cliquable pour ouvrir la modal -->
    <div v-if="commentCount > 0" class="flex items-center gap-1 text-white cursor-pointer hover:underline"
        @click="openModal">
        <span class="text-sm">{{ commentText }}</span>
    </div>

    <!-- ✅ Affichage du composant modal -->
    <CommentModal :comments="comments" :is-open="isModalOpen" :bloc-id="blocId" :fetch-comments="fetchComments"
        @close="closeModal" />
</template>
