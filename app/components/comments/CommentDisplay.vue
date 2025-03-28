<script setup lang="ts">
const props = defineProps<{
  blocId: number;
  blocTitle: string;
  blocOwnerId: number;
  commentCount: number;
  customText?: string;
  hideIfEmpty?: boolean;
  minComments?: number;
}>();

const isModalOpen = ref(false);
const { comments, fetchComments, deleteComment } = useComment(props.blocId);
const { likeList, fetchLikes } = useLike(props.blocId);

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
  props.commentCount === 1
    ? "1 commentaire"
    : `${props.commentCount} commentaires`,
);
</script>

<template>
  <div
    v-if="
      (!hideIfEmpty || commentCount > 0) &&
      (!minComments || commentCount >= minComments)
    "
    class="flex cursor-pointer items-center gap-1 text-sm text-white transition-all duration-300 ease-in-out hover:text-orange-500"
    @click="openModal"
  >
    <slot :comment-count="commentCount">{{ customText || commentText }}</slot>
  </div>

  <BlocModal
    :comments="comments"
    :likes="likeList"
    :is-open="isModalOpen"
    :bloc-id="blocId"
    :bloc-title="blocTitle"
    :bloc-owner-id="blocOwnerId"
    :fetch-comments="fetchComments"
    :fetch-likes="fetchLikes"
    :delete-comment="deleteComment"
    :default-tab="'comments'"
    @close="closeModal"
  />
</template>
