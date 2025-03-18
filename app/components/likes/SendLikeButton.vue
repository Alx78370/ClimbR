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
  <button
    :disabled="userHasLiked"
    class="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
    :class="
      userHasLiked ? 'bg-neutral-600 text-white' : 'bg-orange-500 text-white'
    "
    @click="sendLike"
  >
    <Icon name="fa-solid:thumbs-up" class="text-lg" />
    <span>{{ userHasLiked ? "Like envoyé" : "Envoyer un like" }}</span>
  </button>
</template>
