<script setup lang="ts">
import { useLike } from "@/composables/useLike";

interface Props {
    blocId: number;
}

const props = defineProps<Props>();
const { userHasLiked, toggleLike } = useLike(props.blocId);
</script>

<template>
    <button @click="toggleLike" class="cursor-pointer relative">
        <Transition name="fade" mode="out-in">
            <Icon v-if="userHasLiked" key="liked" name="fa-solid:thumbs-up"
                class="text-orange-500 text-2xl transition-transform transform duration-300 ease-out" />
            <Icon v-else key="unliked" name="fa-regular:thumbs-up"
                class="text-white text-2xl transition-transform transform duration-300 ease-in" />
        </Transition>
    </button>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: scale(1);
}
</style>
