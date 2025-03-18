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
  <div
    class="flex w-[30%] flex-col items-center justify-center gap-5 md:mx-auto"
  >
    <CardBloc
      v-for="bloc in blocs"
      :key="bloc.id"
      :bloc="bloc"
      :editable="true"
      @delete="deleteBloc"
    />
  </div>
</template>
