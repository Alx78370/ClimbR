<script setup lang="ts">
defineProps<{
    friends: { id: string | number, username: string }[];
}>();
</script>

<template>
    <ul v-if="friends.length" class="w-full max-w-md space-y-4">
        <li v-for="friend in friends" :key="friend.id"
            class="flex justify-between items-center bg-neutral-900 text-white p-4 rounded-lg shadow-md">
            <span class="text-lg">{{ friend.username }}</span>
            <Icon name="typcn:delete" class="text-4xl" />
        </li>
    </ul>
    <p v-else class="text-gray-400">Aucun ami pour l'instant.</p>
</template>