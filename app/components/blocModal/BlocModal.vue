<script setup lang="ts">
const {
  fetchFriends,
  sendFriendRequest,
  getFriendshipStatus,
  fetchFriendshipStatus,
} = useFriends();
const { user } = useUserSession();

const props = defineProps<{
  blocId: number;
  blocTitle: string;
  blocOwnerId: number;
  comments: {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  }[];
  likes: {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  }[];
  isOpen: boolean;
  fetchComments: () => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  fetchLikes: () => Promise<void>;
  defaultTab: "comments" | "likes";
}>();

const emit = defineEmits(["close"]);

const activeTab = ref<"comments" | "likes">("comments");

onMounted(() => {
  if (user.value) {
    fetchFriends(user.value.id);
    fetchFriendshipStatus(user.value.id);
  }
});

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      activeTab.value = props.defaultTab;
      openModal();
    }
  },
);

const openModal = async () => {
  await Promise.all([props.fetchComments(), props.fetchLikes()]);
};

const closeModal = () => {
  emit("close");
};

const handleCommentSubmitted = async () => {
  await props.fetchComments();
};

const handleSendFriendRequest = async (friendUsername: string) => {
  if (!user.value) return;
  await sendFriendRequest(user.value.id, friendUsername);
  await fetchFriendshipStatus(user.value.id);
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80"
    @click.self="closeModal"
  >
    <div
      class="flex max-h-[60vh] w-full max-w-2xl flex-col rounded-lg bg-neutral-900 p-4 shadow-lg"
    >
      <HeaderModal :bloc-title="blocTitle" @close="closeModal" />

      <TabsSection
        :active-tab="activeTab"
        :likes-count="likes.length"
        :comments-count="comments.length"
        @tab-change="activeTab = $event"
      />

      <div class="mt-4 max-h-[60vh] flex-1 space-y-3 overflow-y-auto">
        <div v-if="activeTab === 'likes'">
          <LikeItem
            v-for="like in likes"
            :key="like.user_id"
            :like="like"
            :user="user || undefined"
            :friendship-status="getFriendshipStatus(like.user_id)"
            @send-friend-request="handleSendFriendRequest"
          />
        </div>

        <div v-if="activeTab === 'comments'">
          <CommentItem
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            :bloc-owner-id="blocOwnerId"
            :user="user || undefined"
            @delete-comment="deleteComment"
          />
        </div>
      </div>

      <FooterActions
        :active-tab="activeTab"
        :bloc-id="blocId"
        @comment-submitted="handleCommentSubmitted"
      />
    </div>
  </div>
</template>
