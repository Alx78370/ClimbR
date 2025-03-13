<script setup lang="ts">
defineProps<{
    requests: { id: string | number; username: string }[];
    acceptRequest: (id: string | number) => Promise<void>;
    rejectRequest: (id: string | number) => Promise<void>;
}>();

</script>

<template>
    <ul v-if="requests.length" class="w-full max-w-md space-y-4">
        <li v-for="request in requests" :key="request.id"
            class="flex justify-between items-center bg-neutral-900 text-white p-4 rounded-lg shadow-md">
            <span class="text-lg">{{ request.username }}</span>
            <div class="flex space-x-2">
                <button @click="acceptRequest(request.id)"
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
                    Accepter
                </button>
                <button @click="rejectRequest(request.id)"
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
                    Refuser
                </button>
            </div>
        </li>
    </ul>
    <p v-else class="text-gray-400">Aucune demande en attente.</p>
</template>