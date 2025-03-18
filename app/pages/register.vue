<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleRegister = async () => {
  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        password: password.value,
      },
    });
    router.push("/");
  } catch {
    errorMessage.value = "Échec de l'inscription. Essaye un autre email.";
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
      <h2 class="text-xl">Inscription</h2>
      <form
        class="flex w-full flex-col items-start gap-5"
        @submit.prevent="handleRegister"
      >
        <BaseInput v-model="first_name" placeholder="Prénom" />
        <BaseInput v-model="last_name" placeholder="Nom" />
        <BaseInput v-model="email" type="email" placeholder="Email" />
        <BaseInput
          v-model="password"
          type="password"
          placeholder="Mot de passe"
        />
        <BaseButton type="submit">S'inscrire</BaseButton>
      </form>
      <AuthError v-if="errorMessage">{{ errorMessage }}</AuthError>
      <p>
        Déjà un compte ?
        <NuxtLink
          to="/login"
          class="text-orange-500 underline underline-offset-2 transition-colors duration-200 ease-in-out hover:text-white"
        >
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
