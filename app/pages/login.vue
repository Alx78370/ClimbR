<script setup lang="ts">
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
    navigateTo("/");
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
          class="cursor-pointer rounded-2xl border-2 border-transparent bg-neutral-800 px-10 py-3 hover:border-2 hover:border-neutral-400"
          type="submit"
        >
          Se connecter
        </button>
      </form>
      <p v-if="errorMessage">{{ errorMessage }}</p>
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
