<script setup lang="ts">
import { useLike } from "@/composables/useLike";

const props = defineProps<{ blocId: number }>();
const { userHasLiked, toggleLike } = useLike(props.blocId);

const sendLike = async () => {
    if (!userHasLiked.value) {
        await toggleLike();
    }
};
</script>

<template>
    <button @click="sendLike" :disabled="userHasLiked" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out 
            cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        :class="userHasLiked ? 'bg-neutral-600 text-white' : 'bg-orange-500 text-white'">

        <Icon name="fa-solid:thumbs-up" class="text-lg" />
        <span>{{ userHasLiked ? "Like envoyé" : "Envoyer un like" }}</span>

    </button>
</template>
