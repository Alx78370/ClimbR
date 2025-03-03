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
    <div>
        <h2>Inscription</h2>
        <form @submit.prevent="handleRegister">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Mot de passe" required />
            <button type="submit">S'inscrire</button>
        </form>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <p>Déjà un compte ? <NuxtLink to="/login">Se connecter</NuxtLink>
        </p>
    </div>
</template>
