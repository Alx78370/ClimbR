<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const { fetch } = useUserSession();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });
    await fetch();
    router.push("/");
  } catch {
    errorMessage.value = "Échec de la connexion. Vérifie tes identifiants.";
  }
};
</script>

<template>
  <div
    class="flex h-[80vh] w-full items-center justify-center md:mx-auto md:w-2/3"
  >
    <div
      class="flex w-1/2 flex-col items-center justify-center gap-10 rounded-2xl bg-neutral-900 p-10"
    >
      <h2 class="text-xl">Connexion</h2>
      <form
        class="flex w-full flex-col items-start gap-5"
        @submit.prevent="handleLogin"
      >
        <BaseInput v-model="email" type="email" placeholder="Email" />
        <BaseInput
          v-model="password"
          type="password"
          placeholder="Mot de passe"
        />
        <BaseButton type="submit">Se connecter</BaseButton>
      </form>
      <AuthError v-if="errorMessage">{{ errorMessage }}</AuthError>
      <p>
        Pas encore inscrit ?
        <NuxtLink
          to="/register"
          class="text-orange-500 underline underline-offset-2 transition-colors duration-200 ease-in-out hover:text-white"
        >
          Créer un compte
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
