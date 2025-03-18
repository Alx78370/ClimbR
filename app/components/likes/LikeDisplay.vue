<script setup lang="ts">
interface Props {
  blocId: number;
  blocTitle: string;
  blocOwnerId: number;
}

const props = defineProps<Props>();
const { likes, likeList, fetchLikes, likePreview } = useLike(props.blocId);
const { comments, fetchComments, deleteComment } = useComment(props.blocId);

// ✅ État du modal
const isModalOpen = ref(false);

const openLikeModal = async () => {
  isModalOpen.value = true;
  await fetchLikes();
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div
    class="flex cursor-pointer items-center space-x-2"
    @click="openLikeModal"
  >
    <!-- ✅ Transition fluide des avatars -->
    <TransitionGroup
      name="fade"
      tag="div"
      class="flex flex-shrink-0 -space-x-2 overflow-hidden"
    >
      <template v-for="user in likePreview" :key="user.user_id">
        <img
          v-if="user.profile_picture"
          :src="user.profile_picture"
          :alt="user.username"
          class="h-6 w-6 rounded-full border-2 border-neutral-900 transition-opacity duration-300"
        />
        <div
          v-else
          class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-700 transition-opacity duration-300"
        >
          <Icon name="lucide:circle-user-round" class="text-4xl text-white" />
        </div>
      </template>
    </TransitionGroup>

    <div class="relative flex h-6 items-center">
      <Transition name="fade">
        <span
          v-if="likes > 0"
          class="block text-sm text-white transition-all duration-300 ease-in-out hover:text-orange-500"
        >
          {{ likes }} {{ likes === 1 ? "j'aime" : "j'aimes" }}
        </span>
      </Transition>
    </div>
  </div>

  <!-- ✅ Affichage du modal -->
  <BlocModal
    :bloc-id="blocId"
    :bloc-title="blocTitle"
    :comments="comments"
    :bloc-owner-id="blocOwnerId"
    :likes="likeList"
    :is-open="isModalOpen"
    :fetch-comments="fetchComments"
    :fetch-likes="fetchLikes"
    :delete-comment="deleteComment"
    :default-tab="'likes'"
    @close="closeModal"
  />
</template>
