<script setup lang="ts">
import { useBlocs } from "@/composables/useBlocs";
import authMiddleware from "../../middleware/auth";
import CardBloc from "../components/shared/CardBloc.vue";

definePageMeta({
    middleware: [authMiddleware],
});

const { blocs, fetchBlocs, deleteBloc } = useBlocs();

onMounted(fetchBlocs);
</script>

<template>
    <div class="flex flex-col w-full md:w-2/3 md:mx-auto justify-center items-center gap-5">
        <CardBloc v-for="bloc in blocs" :key="bloc.id" :bloc="bloc" @delete="deleteBloc" />
    </div>
</template>
