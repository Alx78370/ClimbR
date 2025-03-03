<script setup lang="ts">
import { useBlocs } from '@/composables/useBlocs';
import authMiddleware from '../../middleware/auth';

definePageMeta({
    middleware: [authMiddleware]
});

const { blocs, fetchBlocs, deleteBloc } = useBlocs();

const colorClasses: { [key: string]: string } = {
    jaune: 'text-yellow-500',
    orange: 'text-orange-500',
    vert: 'text-green-500',
    bleu: 'text-blue-500',
    rose: 'text-pink-500',
    rouge: 'text-red-500',
    noir: 'text-black',
    violet: 'text-purple-500',
};

const blocTypeMap = {
    dalle: 'Dalle',
    vertical: 'Vertical',
    leger_devers: 'Léger dévers',
    gros_devers: 'Gros dévers',
    toit: 'Toit',
    diedre: 'Dièdre',
    arete: 'Arête',
};

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
                    <div class="flex justify-between items-start w-full">
                        <div>
                            <p class="font-bold">{{ bloc.titre }}</p>
                            <p class="text-sm text-gray-300 mb-5">Validé le {{ bloc.date_validation }} - {{
                                bloc.salle_name }}</p>
                            <p class="mb-5"> {{ bloc.description }}</p>
                            <div class="flex gap-10">
                                <div class="flex flex-col items-start">
                                    <p class="text-sm text-gray-300">Difficulté</p>
                                    <Icon name="icon-park-outline:dot" class="text-3xl"
                                        :class="colorClasses[bloc.couleur]" />
                                </div>
                                <div>
                                    <p class="text-sm text-gray-300">Type de bloc</p>
                                    <p>{{ blocTypeMap[bloc.type] }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-300">Nb d'essais</p>
                                    <div v-if="bloc.essai === 'Flash'" class="flex items-center gap-2">
                                        <p>{{ bloc.essai }}</p>
                                        <Icon name="typcn:flash" class="text-yellow-500" />
                                    </div>
                                    <p v-else>{{ bloc.essai }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-5">
                            <NuxtLink :to="`/blocs/${bloc.id}`">
                                <Icon name="fa6-solid:pen-to-square"
                                    class="text-white text-2xl hover:scale-110 hover:duration-300 hover:ease-in-out transition-all cursor-pointer" />
                            </NuxtLink>
                            <button @click="deleteBloc(bloc.id)">
                                <Icon name="ion:trash"
                                    class="text-white text-2xl hover:scale-110 hover:duration-300 hover:ease-in-out transition-all cursor-pointer" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>