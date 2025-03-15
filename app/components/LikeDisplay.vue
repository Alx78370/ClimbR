<script setup lang="ts">
import { useLike } from "@/composables/useLike";

interface Props {
    blocId: number;
}

const props = defineProps<Props>();
const { likes, likeList } = useLike(props.blocId);
</script>

<template>
    <div class="flex items-center space-x-2">
        <!-- Affichage dynamique des avatars -->
        <div v-if="likeList.length" class="flex -space-x-2 overflow-hidden">
            <img v-for="user in likeList" :key="user.user_id" :src="user.profile_picture" :alt="user.username"
                class="w-6 h-6 rounded-full border-2 border-neutral-900" />
        </div>

        <!-- Nombre total de likes -->
        <span v-if="likes === 1" class="text-white ">
            1 j'aime
        </span>
        <span v-else class="text-white">
            {{ likes }} j'aimes
        </span>
    </div>
</template>
