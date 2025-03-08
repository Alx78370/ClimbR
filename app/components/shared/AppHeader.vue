<script setup lang="ts">
const { loggedIn, clear, fetch, user } = useUserSession();
const { sendFriendRequest, message } = useFriends();

const showDropdown = ref(false);
const showAddFriendInput = ref(false);
const friendUsername = ref('');
const copySuccess = ref(false);

const logout = async () => {
    await clear();
    await fetch();
    navigateTo('/login');
};

const copyToClipboard = async () => {
    try {
        if (user.value?.username) {
            await navigator.clipboard.writeText(user.value.username);
            copySuccess.value = true;
            setTimeout(() => (copySuccess.value = false), 2000);
        }
    } catch (err) {
        console.error("Erreur lors de la copie :", err);
    }
};
</script>

<template>
    <header class="w-full bg-neutral-950 text-center border-b-2 border-neutral-900">
        <div class="flex justify-between w-[60%] mx-auto">
            <nav class="text-white flex gap-5 items-center">
                <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
                <NuxtLink to="/users/blocs" class="hover:underline">Mes blocs</NuxtLink>
            </nav>
            <div class="flex gap-5 items-center">
                <div class="group relative flex flex-col gap-2 text-white" @mouseenter="showDropdown = true"
                    @mouseleave="showDropdown = false">
                    <button v-if="loggedIn"
                        class="flex items-center justify-center hover:underline underline-offset-4 border-x-2 border-t-2 border-transparent hover:cursor-pointer group-hover:border-x-2 group-hover:border-t-2 group-hover:pl-2 group-hover:border-neutral-900 rounded-t">
                        <Icon name="lucide:circle-user-round" class="text-4xl" />
                        <Icon name="lucide:chevron-down" class="text-2xl" />
                    </button>
                    <div v-if="loggedIn && showDropdown"
                        class="flex flex-col absolute top-full right-0 border-x-2 border-b-2 border-neutral-900 rounded-b bg-neutral-950 w-[200px]">
                        <div class="absolute top-0 left-0 w-[65.5%] h-[1.5px] bg-neutral-900"></div>
                        <div class="flex items-center justify-center hover:bg-neutral-900">
                            <p class=" cursor-pointer select-text font-bold p-2" @click="copyToClipboard">
                                {{ user?.username }}
                            </p>
                            <button class="cursor-pointer flex items-end justify-center" @click="copyToClipboard">
                                <Icon v-if="copySuccess" name="lucide:copy-check" class="w-5 h-5" />
                                <Icon v-else name="lucide:copy" class="w-5 h-5 " />
                            </button>
                        </div>
                        <button class="cursor-pointer p-2 hover:bg-neutral-900 text-nowrap"
                            @click="showAddFriendInput = !showAddFriendInput">
                            Ajouter un ami
                        </button>

                        <div v-if="showAddFriendInput" class="flex flex-col">
                            <input v-model="friendUsername" type="text" placeholder="Pseudo#1234"
                                class="border p-2 rounded bg-neutral-900 text-white text-center" />
                            <button @click="sendFriendRequest(user?.id, friendUsername)"
                                class="mt-2 bg-orange-500 text-white p-2 rounded cursor-pointer">Envoyer</button>
                            <p v-if="message" class="text-green-400">{{ message }}</p>
                        </div>

                        <NuxtLink to="/profil" class="cursor-pointer p-2 hover:bg-neutral-900 text-nowrap">
                            Mon profil
                        </NuxtLink>
                        <button
                            class="cursor-pointer p-2 rounded-b hover:bg-orange-500 hover:text-white text-orange-500"
                            @click="logout">Déconnexion</button>
                    </div>
                </div>

                <NuxtLink to="/blocs/new" class="group relative w-fit flex items-center justify-center">
                    <Icon name="icon-park-outline:add-one"
                        class="text-4xl text-orange-500 absolute opacity-100 group-hover:opacity-0 transition-opacity duration-200" />
                    <Icon name="icon-park-solid:add-one"
                        class="text-4xl text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </NuxtLink>
            </div>
        </div>
    </header>
</template>
