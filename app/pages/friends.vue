<script setup lang="ts">
const { requests, friends, fetchRequests, fetchFriends, acceptRequest, rejectRequest } = useFriends();
const { user } = useUserSession();
const activeTab = ref<'requests' | 'friends'>('requests');
const userId = user.value?.id

function setActiveTab(tab: 'requests' | 'friends') {
    activeTab.value = tab;
}

onMounted(async () => {
    await fetchRequests();
    if (userId) {
        await fetchFriends(userId);
    }
});
</script>

<template>
    <div class="flex flex-col items-center p-6">
        <!-- Onglets -->
        <div class="flex items-center gap-6">
            <button class="font-bold mb-6 pr-6 border-r-2"
                :class="{ 'text-orange-500 border-white': activeTab === 'requests' }" @click="setActiveTab('requests')">
                Demandes d'amis
            </button>
            <button class="font-bold mb-6" :class="{ 'text-orange-500': activeTab === 'friends' }"
                @click="setActiveTab('friends')">
                Ma liste d'amis
            </button>
        </div>

        <!-- Affichage des demandes d'amis -->
        <ul v-if="activeTab === 'requests' && requests.length" class="w-full max-w-md space-y-4">
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
        <p v-else-if="activeTab === 'requests'" class="text-gray-400">Aucune demande en attente.</p>

        <!-- Affichage de la liste d'amis -->
        <ul v-if="activeTab === 'friends' && friends.length" class="w-full max-w-md space-y-4">
            <li v-for="friend in friends" :key="friend.id"
                class="flex justify-between items-center bg-neutral-900 text-white p-4 rounded-lg shadow-md">
                <span class="text-lg">{{ friend.username }}</span>
                <Icon name="typcn:delete" class="text-4xl" />
            </li>
        </ul>
        <p v-else-if="activeTab === 'friends'" class="text-gray-400">Aucun ami pour l'instant.</p>

        <NuxtLink to="/" class="mt-6 text-orange-500 hover:underline text-lg">
            ← Retour à l'accueil
        </NuxtLink>
    </div>
</template>
