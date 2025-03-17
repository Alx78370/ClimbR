<script setup lang="ts">
import { useTimeAgo } from "@vueuse/core";

const props = defineProps<{
    blocId: number;
    blocTitle: string;
    comments: {
        id: number;
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
    fetchLikes: () => Promise<void>;
    defaultTab: "comments" | "likes";
}>();

const { fetchFriends, sendFriendRequest, getFriendshipStatus, fetchFriendshipStatus } = useFriends();
const { user } = useUserSession();

const emit = defineEmits(["close"]);



// ✅ Charger la liste des amis lorsque le modal s'ouvre
onMounted(() => {
    if (user.value) {
        fetchFriends(user.value.id);
        fetchFriendshipStatus(user.value.id);
    }
});

const openModal = async () => {
    await Promise.all([props.fetchComments(), props.fetchLikes()]);
};

watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        activeTab.value = props.defaultTab;
        openModal();
    }
});

const closeModal = () => {
    emit("close");
};

// ✅ Rafraîchir les commentaires après ajout
const handleCommentSubmitted = async () => {
    await props.fetchComments();
};

// ✅ Gérer les onglets
const activeTab = ref<"comments" | "likes">("comments");

const handleTabChange = (tab: "comments" | "likes") => {
    activeTab.value = tab;
};

const handleSendFriendRequest = async (friendUsername: string) => {
    if (!user.value) return;

    console.log("📩 Envoi de la demande d'ami à :", friendUsername);

    await sendFriendRequest(user.value.id, friendUsername);
    await fetchFriendshipStatus(user.value.id); // ✅ Met à jour la liste des amis

    console.log("✅ Demande envoyée, amis mis à jour !");
};



</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 bg-neutral-950/80 flex items-center justify-center z-50"
        @click.self="closeModal">

        <div class="bg-neutral-900 rounded-lg w-full max-w-2xl p-4 shadow-lg flex flex-col max-h-[60vh]">
            <div class="flex justify-between items-center border-b pb-2">
                <h2 class="text-lg font-semibold text-white">{{ blocTitle }}</h2>
                <button @click="closeModal">
                    <Icon name="ooui:close" class="text-xl text-orange-500 cursor-pointer hover:text-orange-400" />
                </button>
            </div>

            <div class="flex border-b">
                <button @click="handleTabChange('likes')" class="flex-1 py-2 text-center cursor-pointer"
                    :class="[activeTab === 'likes' ? 'border-orange-500 text-orange-500' : 'text-gray-400']">
                    J'aime ({{ likes.length }})
                </button>
                <button @click="handleTabChange('comments')" class="flex-1 py-2 text-center cursor-pointer"
                    :class="[activeTab === 'comments' ? 'border-orange-500 text-orange-500' : 'text-gray-400']">
                    Commentaires ({{ comments.length }})
                </button>
            </div>

            <div class="flex-1 overflow-y-auto mt-4 space-y-3 max-h-[60vh]">
                <div v-if="activeTab === 'likes'">
                    <div v-for="like in likes" :key="like.user_id"
                        class="flex items-center justify-between border-b border-neutral-800 py-2">
                        <div class="flex items-center gap-3">
                            <img v-if="like.profile_picture" :src="like.profile_picture" alt="profile"
                                class="w-8 h-8 rounded-full border border-neutral-900">
                            <Icon v-else name="lucide:circle-user-round" class="w-8 h-8 text-gray-500" />

                            <p class="text-sm text-white">{{ like.first_name }} {{ like.last_name }}</p>
                        </div>
                        <button v-if="user && like.user_id !== user.id && getFriendshipStatus(like.user_id) === 'none'"
                            class="text-orange-500 border border-orange-500 px-2 py-1 rounded text-sm hover:bg-orange-500 hover:text-white cursor-pointer transition-all duration-300 ease-in-out"
                            @click="handleSendFriendRequest(like.username)">
                            Devenir ami
                        </button>

                        <!-- ✅ Si la demande est en attente, afficher "En attente..." -->
                        <span v-else-if="getFriendshipStatus(like.user_id) === 'pending'" class="text-gray-400 italic">
                            Demande en attente
                        </span>
                    </div>
                </div>

                <div v-if="activeTab === 'comments'">
                    <div v-for="comment in comments" :key="comment.id"
                        class="flex items-start gap-3 border-b border-neutral-800 pb-2 pr-3">
                        <img v-if="comment.profile_picture" :src="comment.profile_picture" alt="profile"
                            class="w-8 h-8 rounded-full border border-neutral-900">
                        <Icon v-else name="lucide:circle-user-round" class="w-8 h-8 text-gray-500" />

                        <div class="flex-1">
                            <p class="text-sm font-semibold text-white">
                                {{ comment.first_name }} {{ comment.last_name }}
                            </p>
                            <p class="mt-1 text-sm text-gray-300">{{ comment.content }}</p>
                        </div>
                        <p class="text-xs text-gray-500">
                            {{ useTimeAgo(new Date(comment.created_at), { updateInterval: 60000 }) }}
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'comments'" class="pt-3">
                <CommentInput :bloc-id="blocId" :autoClose="false" @submit="handleCommentSubmitted"
                    @cancel="() => { }" />
            </div>
            <div v-else class="pt-3">
                <SendLikeButton :bloc-id="blocId" />
            </div>
        </div>
    </div>
</template>
