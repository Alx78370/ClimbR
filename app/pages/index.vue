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
    <div v-if="isLoading" class="flex h-screen justify-center items-center">
        <p class="text-white text-xl">Chargement...</p>
    </div>

    <div v-else-if="blocs.length === 0" class="flex h-[90vh] -mt-20">
        <img src="/images/cover1.webp" class="w-[40%] h-full object-cover">
        <div class="flex flex-col items-center justify-center w-[20%] h-full bg-neutral-950 px-5">
            <h1 class="text-white text-3xl text-center">
                Commencer à suivre votre progression en ajoutant votre dernier bloc validé !
            </h1>
            <NuxtLink to="/blocs/new"
                class="bg-orange-500 text-white py-2 px-5 rounded-md hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer mt-5">
                Ajouter un bloc
            </NuxtLink>
        </div>
        <img src="/images/cover2.webp" class="w-[40%] h-full object-cover">
    </div>
    <div v-else class="flex flex-col w-[30%] md:mx-auto justify-center items-center gap-5">
        <CardBloc v-for="bloc in blocs" :key="bloc.id" :bloc="bloc" :editable="false" />
    </div>
</template>