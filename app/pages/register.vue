<script setup lang="ts">

const { fetch } = useUserSession()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: { email: email.value, password: password.value },
        })
        await fetch()
        navigateTo('/')
    } catch {
        errorMessage.value = "Échec de l'inscription. Essaye un autre email."
    }
}
</script>

<template>
    <div class="w-full md:w-2/3 md:mx-auto flex justify-center items-center h-[80vh]">
        <div class="flex flex-col justify-center items-center w-1/2 bg-neutral-900 p-10 gap-10 rounded-2xl">
            <h2 class="text-xl">Inscription</h2>
            <form class="flex flex-col items-start w-full gap-5" @submit.prevent="handleRegister">
                <input class="border-2 border-neutral-800 rounded-xl p-3 w-full bg-transparent" v-model="email"
                    type="email" placeholder="Email" required />
                <input class="border-2 border-neutral-800 rounded-xl p-3 w-full" v-model="password" type="password"
                    placeholder="Mot de passe" required />
                <button
                    class="py-3 px-10 rounded-2xl bg-neutral-800 border-2 border-transparent hover:border-2 hover:border-neutral-400 cursor-pointer"
                    type="submit">S'inscrire</button>
            </form>
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <p>Déjà un compte ? <NuxtLink to="/login"
                    class="text-orange-500 underline underline-offset-2 hover:text-white transition-colors duration-200 ease-in-out">
                    Se connecter
                </NuxtLink>
            </p>
        </div>
    </div>
</template>


<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #1e293b00 inset !important;
    -webkit-text-fill-color: #fff !important;
    box-shadow: 0 0 0 1000px #1e293b00 inset !important;
    transition: background-color 5000s ease-in-out 0s;
}
</style>