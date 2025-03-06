<script setup lang="ts">
const { loggedIn, clear, fetch, user } = useUserSession();
const { sendFriendRequest, message } = useFriends();

const showDropdown = ref(false);
const showAddFriendInput = ref(false);
const friendUsername = ref('');

const logout = async () => {
    await clear();
    await fetch();
    navigateTo('/login');
};
</script>

<template>
    <header class="flex justify-between w-full bg-transparent text-center p-3 px-5">
        <nav class="text-white flex gap-5 items-center">
            <div class="flex flex-col gap-2">
                <button v-if="loggedIn"
                    class="relative flex items-end justify-center hover:underline underline-offset-4 gap-2"
                    @click="showDropdown = !showDropdown">
                    <Icon name="lucide:circle-user-round" class="text-4xl" />
                    <p>{{ user?.first_name }} {{ user?.last_name }}</p>
                </button>

                <div v-if="loggedIn && showDropdown"
                    class="flex flex-col absolute top-18 left-5 border-2 border-white p-3 rounded bg-black">
                    <p class="underline underline-offset-2 p-2 rounded">{{ user?.username }}</p>
                    <button class="cursor-pointer p-2 rounded hover:bg-gray-800"
                        @click="showAddFriendInput = !showAddFriendInput">
                        Ajouter un ami
                    </button>
                    <div v-if="showAddFriendInput" class="flex flex-col my-2">
                        <input v-model="friendUsername" type="text" placeholder="Pseudo#1234"
                            class="border p-1 rounded bg-gray-800 text-white text-center" />
                        <button @click="sendFriendRequest(user?.id, friendUsername)"
                            class="mt-2 bg-blue-500 text-white p-2 rounded">Envoyer</button>
                        <p v-if="message" class="text-green-400">{{ message }}</p>
                    </div>
                    <NuxtLink to="/friends" class="cursor-pointer rounded p-2 hover:bg-gray-800">
                        Gérer mes demandes d'amis
                    </NuxtLink>
                    <button class="cursor-pointer p-2 rounded hover:bg-orange-500 hover:text-white text-orange-500"
                        @click="logout">Déconnexion</button>
                </div>
            </div>
        </nav>
        <NuxtLink to="/blocs/new" class="bg-orange-500 text-white p-3 rounded w-fit">Nouveau bloc</NuxtLink>
    </header>
</template>
