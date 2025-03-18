<script setup lang="ts">
defineProps<{
  friends: { id: string | number; username: string }[];
}>();
</script>

<template>
  <ul v-if="friends.length" class="w-full max-w-md space-y-4">
    <li
      v-for="friend in friends"
      :key="friend.id"
      class="flex items-center justify-between rounded-lg bg-neutral-900 p-4 text-white shadow-md"
    >
      <span class="text-lg">{{ friend.username }}</span>
      <Icon name="typcn:delete" class="text-4xl" />
    </li>
  </ul>
  <p v-else class="text-gray-400">Aucun ami pour l'instant.</p>
</template>
