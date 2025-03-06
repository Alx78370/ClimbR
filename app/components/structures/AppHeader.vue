<script setup lang="ts">
const { loggedIn, clear, fetch, user } = useUserSession()

const showDropdown = ref(false)

const logout = async () => {
    await clear()
    await fetch()
    navigateTo('/login')
}
</script>

<template>
    <header class="flex justify-between w-full bg-transparent text-center p-3 px-5">
        <nav class="text-white flex gap-5 items-center">
            <NuxtLink to="/">Accueil</NuxtLink>
            <div class="flex flex-col gap-2">
                <button v-if="loggedIn"
                    class="relative flex flex-col items-center justify-center hover:underline underline-offset-8"
                    @click="showDropdown = !showDropdown">
                    <Icon name="lucide:circle-user-round" class="text-xl" />
                    <p> {{ user?.username }}</p>
                </button>

                <div v-if="loggedIn && showDropdown"
                    class="flex flex-col absolute top-18 left-10 border-2 border-white p-3 rounded-2xl">
                    <button>
                        Ajouter un ami
                    </button>
                    <button>
                        Gérer mes demandes d'amis
                    </button>
                    <button @click="logout">Déconnexion</button>
                </div>
            </div>


        </nav>
        <NuxtLink to="/blocs/new" class="bg-orange-500 text-white p-3 rounded-2xl w-fit">Nouveau bloc</NuxtLink>
    </header>
</template>