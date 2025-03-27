<script setup lang="ts">
import { capitalizeFirstLetter } from "~~/utils/capitalize";

const props = defineProps<{
  bloc: {
    id: number;
    first_name: string;
    last_name: string;
    date_validation: string;
    salle_name: string;
    profile_picture?: string;
  };
  editable?: boolean;
}>();

const emit = defineEmits<{
  (event: "delete", id: number): void;
}>();

const handleDelete = () => {
  emit("delete", props.bloc.id);
};
</script>

<template>
  <div class="flex w-full items-start justify-between">
    <div class="mb-5 flex h-12 items-start gap-3">
      <img
        v-if="bloc.profile_picture"
        :src="bloc.profile_picture"
        alt="profile picture"
        class="h-12 w-12 rounded-full object-cover"
      />
      <Icon v-else name="lucide:circle-user-round" class="text-5xl" />
      <div>
        <p class="font-semibold">
          {{ capitalizeFirstLetter(bloc.first_name) }}
          {{ capitalizeFirstLetter(bloc.last_name) }}
        </p>
        <p class="mb-5 text-sm text-gray-300">
          Validé le {{ bloc.date_validation }} - {{ bloc.salle_name }}
        </p>
      </div>
    </div>

    <div v-if="editable" class="flex gap-5">
      <NuxtLink :to="`/blocs/${bloc.id}`">
        <Icon
          name="fa6-solid:pen-to-square"
          class="cursor-pointer text-2xl text-white transition-all hover:scale-110"
        />
      </NuxtLink>
      <button @click="handleDelete">
        <Icon
          name="ion:trash"
          class="cursor-pointer text-2xl text-white transition-all hover:scale-110"
        />
      </button>
    </div>
  </div>
</template>
