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
        <!-- ✅ Transition fluide des avatars sans déplacement -->
        <TransitionGroup name="fade" tag="div" class="flex -space-x-2 overflow-hidden flex-shrink-0">
            <template v-for="user in likeList" :key="user.user_id">
                <img v-if="user.profile_picture" :src="user.profile_picture" :alt="user.username"
                    class="w-6 h-6 rounded-full border-2 border-neutral-900 transition-opacity duration-300" />

                <div v-else
                    class="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-700 border-2 border-neutral-900 transition-opacity duration-300">
                    <Icon name="lucide:circle-user-round" class="text-white text-xs" />
                </div>
            </template>
        </TransitionGroup>

        <!-- ✅ Texte avec transition naturelle -->
        <div class="relative h-6 flex items-center">
            <Transition name="fade">
                <span v-if="likes > 0" class="text-white block">
                    {{ likes }} {{ likes === 1 ? "j'aime" : "j'aimes" }}
                </span>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
/* ✅ Transition fluide pour le texte */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}

/* ✅ Transition fluide pour les avatars sans déplacement */
.fade-move {
    transition: none;
}
</style>
