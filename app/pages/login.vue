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
    <div>
        <h2>Connexion</h2>
        <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Mot de passe" required />
            <button type="submit">Se connecter</button>
        </form>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <p>Pas encore inscrit ? <NuxtLink to="/register">Créer un compte</NuxtLink>
        </p>
    </div>
</template>
