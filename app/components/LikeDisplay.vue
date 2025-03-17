<script setup lang="ts">
interface Props {
    blocId: number;
    blocTitle: string;
}

const props = defineProps<Props>();
const { likes, likeList, fetchLikes, likePreview } = useLike(props.blocId);
const { comments, fetchComments } = useComment(props.blocId);

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
    <div class="flex items-center space-x-2 cursor-pointer" @click="openLikeModal">
        <!-- ✅ Transition fluide des avatars -->
        <TransitionGroup name="fade" tag="div" class="flex -space-x-2 overflow-hidden flex-shrink-0">
            <template v-for="user in likePreview" :key="user.user_id">
                <img v-if="user.profile_picture" :src="user.profile_picture" :alt="user.username"
                    class="w-6 h-6 rounded-full border-2 border-neutral-900 transition-opacity duration-300" />
                <div v-else
                    class="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-700 border-2 border-neutral-900 transition-opacity duration-300">
                    <Icon name="lucide:circle-user-round" class="text-white text-4xl" />
                </div>
            </template>
        </TransitionGroup>

        <div class="relative h-6 flex items-center">
            <Transition name="fade">
                <span v-if="likes > 0"
                    class="text-white block text-sm hover:text-orange-500 transition-all duration-300 ease-in-out">
                    {{ likes }} {{ likes === 1 ? "j'aime" : "j'aimes" }}
                </span>
            </Transition>
        </div>
    </div>

    <!-- ✅ Affichage du modal -->
    <BlocModal :bloc-id="blocId" :bloc-title="blocTitle" :comments="comments" :likes="likeList" :isOpen="isModalOpen"
        :fetch-comments="fetchComments" :fetch-likes="fetchLikes" :default-tab="'likes'" @close="closeModal" />
</template>
