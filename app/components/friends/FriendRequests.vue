<script setup lang="ts">
defineProps<{
  requests: { id: string | number; username: string }[];
  acceptRequest: (id: string | number) => Promise<void>;
  rejectRequest: (id: string | number) => Promise<void>;
}>();
</script>

<template>
  <ul v-if="requests.length" class="w-full max-w-md space-y-4">
    <li
      v-for="request in requests"
      :key="request.id"
      class="flex items-center justify-between rounded-lg bg-neutral-900 p-4 text-white shadow-md"
    >
      <span class="text-lg">{{ request.username }}</span>
      <div class="flex space-x-2">
        <button
          class="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
          @click="acceptRequest(request.id)"
        >
          Accepter
        </button>
        <button
          class="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          @click="rejectRequest(request.id)"
        >
          Refuser
        </button>
      </div>
    </li>
  </ul>
  <p v-else class="text-gray-400">Aucune demande en attente.</p>
</template>
