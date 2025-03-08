<script setup lang="ts">
import { useBlocs } from "@/composables/useBlocs";
import authMiddleware from "../../middleware/auth";
import CardBloc from "../components/shared/CardBloc.vue";

definePageMeta({
    middleware: [authMiddleware],
});

const { blocs, fetchBlocs } = useBlocs();

onMounted(fetchBlocs);
</script>

<template>
    <div v-if="blocs.length === 0">
        <Icon name="si:add-square-duotone" class="text-9xl" />
    </div>
    <div v-else class="flex flex-col w-[30%] md:mx-auto justify-center items-center gap-5">
        <CardBloc v-for="bloc in blocs" :key="bloc.id" :bloc="bloc" :editable="false" />
    </div>
</template>
