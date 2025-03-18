<script setup lang="ts">
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
  } catch {
    errorMessage.value = "Échec de l'inscription. Essaye un autre email.";
  } finally {
    navigateTo("/");
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
        <input
          v-model="first_name"
          class="w-full rounded-xl border-2 border-neutral-800 bg-transparent p-3"
          type="text"
          placeholder="Prénom"
          required
        />
        <input
          v-model="last_name"
          class="w-full rounded-xl border-2 border-neutral-800 bg-transparent p-3"
          type="text"
          placeholder="Nom"
          required
        />
        <input
          v-model="email"
          class="w-full rounded-xl border-2 border-neutral-800 bg-transparent p-3"
          type="email"
          placeholder="Email"
          required
        />
        <input
          v-model="password"
          class="w-full rounded-xl border-2 border-neutral-800 p-3"
          type="password"
          placeholder="Mot de passe"
          required
        />
        <button
          class="cursor-pointer rounded-2xl border-2 border-transparent bg-neutral-800 px-10 py-3 hover:border-neutral-400"
          type="submit"
        >
          S'inscrire
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
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
