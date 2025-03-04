<script setup lang="ts">

const { fetch } = useUserSession()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
    try {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: { email: email.value, password: password.value },
        })
        await fetch()
        navigateTo('/')
    } catch {
        errorMessage.value = "Échec de la connexion. Vérifie tes identifiants."
    }
}
</script>

<template>
    <div class="w-full md:w-2/3 md:mx-auto flex justify-center items-center h-[80vh]">
        <div class="flex flex-col justify-center items-center w-1/2 bg-neutral-900 p-10 gap-10 rounded-2xl">
            <h2 class="text-xl">Connexion</h2>
            <form class="flex flex-col items-start w-full gap-5" @submit.prevent="handleLogin">
                <input class="border-2 border-neutral-800 rounded-xl p-3 w-full" v-model="email" type="email"
                    placeholder="Email" required />
                <input class="border-2 border-neutral-800 rounded-xl p-3 w-full" v-model="password" type="password"
                    placeholder="Mot de passe" required />
                <button
                    class="py-3 px-10 rounded-2xl bg-neutral-800 border-2 border-transparent hover:border-2 hover:border-neutral-400 cursor-pointer"
                    type="submit">Se
                    connecter</button>
            </form>
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <p>Pas encore inscrit ? <NuxtLink to="/register"
                    class="text-orange-500 underline underline-offset-2 hover:text-white transition-colors duration-200 ease-in-out">
                    Créer un compte</NuxtLink>
            </p>
        </div>
    </div>
</template>
