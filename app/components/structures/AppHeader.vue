<script setup lang="ts">
const { loggedIn, clear, fetch } = useUserSession()

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
            <NuxtLink v-if="!loggedIn" to="/login">Connexion</NuxtLink>
            <button v-if="loggedIn" @click="logout">Déconnexion</button>
        </nav>
        <NuxtLink to="/blocs/new" class="bg-orange-500 text-white p-3 rounded-2xl w-fit">Nouveau bloc</NuxtLink>
    </header>
</template>