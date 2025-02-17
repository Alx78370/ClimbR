<script setup lang="ts">
import { useBlocs } from '@/composables/useBlocs';

const { blocs, fetchBlocs, deleteBloc } = useBlocs();

onMounted(fetchBlocs);
</script>

<template>
    <div class="flex flex-col w-full md:w-2/3 md:mx-auto justify-center items-center gap-5">
        <article v-for="bloc in blocs" :key="bloc.id"
            class="flex bg-neutral-900 text-white w-full h-[500px] rounded p-5 gap-10">
            <img :src="`/uploads/${bloc.media}`" :alt="`bloc ${bloc.couleur} à ${bloc.salle_name}`"
                class="w-1/2 rounded object-cover">
            <div class="flex flex-col gap-5 w-1/2">
                <div>
                    <div class="flex justify-between items-center w-full">
                        <p class="font-bold">{{ bloc.titre }}</p>
                        <div class="flex gap-5">
                            <button>
                                <Icon name="fa6-solid:pen-to-square"
                                    class="text-white text-2xl hover:scale-110 hover:duration-300 hover:ease-in-out transition-all cursor-pointer" />
                            </button>
                            <button @click="deleteBloc(bloc.id)">
                                <Icon name="ion:trash"
                                    class="text-white text-2xl hover:scale-110 hover:duration-300 hover:ease-in-out transition-all cursor-pointer" />
                            </button>
                        </div>
                    </div>
                    <p>Validé le {{ bloc.date_validation }}</p>
                    <p>{{ bloc.essai }}</p>
                    <p>bloc {{ bloc.couleur }}</p>
                </div>
                <h2> {{ bloc.salle_name }}</h2>
                <p> {{ bloc.description }}</p>
            </div>
        </article>
    </div>
</template>