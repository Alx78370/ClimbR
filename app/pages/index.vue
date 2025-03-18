<script setup lang="ts">
import { useBlocs } from "@/composables/useBlocs";
import authMiddleware from "../../middleware/auth";
import CardBloc from "../components/shared/CardBloc.vue";

definePageMeta({
  middleware: [authMiddleware],
});

const { blocs, fetchBlocs, isLoading } = useBlocs();

onMounted(fetchBlocs);
</script>

<template>
  <div v-if="isLoading" class="flex h-screen items-center justify-center">
    <p class="text-xl text-white">Chargement...</p>
  </div>

  <div v-else-if="blocs.length === 0" class="-mt-20 flex h-[90vh]">
    <img src="/images/cover1.webp" class="h-full w-[40%] object-cover" />
    <div
      class="flex h-full w-[20%] flex-col items-center justify-center bg-neutral-950 px-5"
    >
      <h1 class="text-center text-3xl text-white">
        Commencer à suivre votre progression en ajoutant votre dernier bloc
        validé !
      </h1>
      <NuxtLink
        to="/blocs/new"
        class="mt-5 cursor-pointer rounded-md bg-orange-500 px-5 py-2 text-white transition-all duration-200 ease-in-out hover:scale-105"
      >
        Ajouter un bloc
      </NuxtLink>
    </div>
    <img src="/images/cover2.webp" class="h-full w-[40%] object-cover" />
  </div>
  <div
    v-else
    class="flex w-[30%] flex-col items-center justify-center gap-5 md:mx-auto"
  >
    <CardBloc
      v-for="bloc in blocs"
      :key="bloc.id"
      :bloc="bloc"
      :editable="false"
    />
  </div>
</template>
