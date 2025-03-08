<script setup lang="ts">
import { useBlocs } from "@/composables/useBlocs";
import authMiddleware from "../../../../middleware/auth";
import CardBloc from "../../../components/shared/CardBloc.vue";

definePageMeta({
    middleware: [authMiddleware],
});

const { blocs, fetchUserBlocs, deleteBloc } = useBlocs();

onMounted(fetchUserBlocs);
</script>

<template>
    <div class="flex flex-col w-[30%] md:mx-auto justify-center items-center gap-5">
        <CardBloc v-for="bloc in blocs" :key="bloc.id" :bloc="bloc" :editable="true" @delete="deleteBloc" />
    </div>
</template>
