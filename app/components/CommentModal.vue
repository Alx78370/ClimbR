<script setup lang="ts">
import { useTimeAgo } from "@vueuse/core";

const props = defineProps<{
    comments: {
        id: number;
        content: string;
        created_at: string;
        first_name: string;
        last_name: string;
        profile_picture?: string;
    }[];
    isOpen: boolean;
    blocId: number;
    fetchComments: () => Promise<void>;
}>();

const emit = defineEmits(["close"]);

const closeModal = () => {
    emit("close");
};

const handleCommentSubmitted = async () => {
    await props.fetchComments();
};

const handleCancel = () => {
    console.log("Annulation dans la modal - ne pas fermer");
};
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 bg-neutral-950/80 flex items-center justify-center z-50">
        <div class="bg-neutral-900 rounded-lg w-full max-w-2xl p-4 shadow-lg">
            <div class="flex justify-between items-center border-b pb-2">
                <h2 class="text-lg font-semibold text-white">Commentaires</h2>
                <button @click="closeModal">
                    <Icon name="ooui:close" class="text-xl text-orange-500 cursor-pointer hover:text-orange-400" />
                </button>
            </div>

            <div class="mt-4 space-y-3 max-h-96 overflow-y-auto">
                <div v-for="comment in comments" :key="comment.id"
                    class="flex items-start gap-3 border-b border-neutral-800 pb-2">
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

            <div class="mt-4">
                <CommentInput :blocId="blocId" :autoClose="false" @submit="handleCommentSubmitted"
                    @cancel="handleCancel" />
            </div>
        </div>
    </div>
</template>
