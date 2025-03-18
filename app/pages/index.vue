<script setup lang="ts">
import { useBlocs } from "@/composables/useBlocs";
import authMiddleware from "../../middleware/auth";

definePageMeta({
  middleware: [authMiddleware],
});

const { blocs, fetchBlocs, isLoading } = useBlocs();

onMounted(fetchBlocs);
</script>

<template>
  <div>
    <LoadingState v-if="isLoading" />
    <EmptyBlocState v-else-if="blocs.length === 0" />
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
  </div>
</template>
