<script setup lang="ts">

interface Props {
    blocId: number;
}

const props = defineProps<Props>()
const { userHasLiked, toggleLike } = useLike(props.blocId)
</script>

<template>
    <button @click="toggleLike" class="cursor-pointer">
        <Icon v-if="userHasLiked" name="fa-solid:thumbs-up" class="text-orange-500 text-2xl" />
        <Icon v-else name="fa-regular:thumbs-up" class="text-white text-2xl" />
    </button>
</template>
