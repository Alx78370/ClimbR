<script setup lang="ts">
import { useBlocs } from '@/composables/useBlocs';

const { blocs, fetchBlocs, deleteBloc } = useBlocs();

onMounted(fetchBlocs);
</script>

<template>
    <div class="flex w-full justify-center items-center mt-10">
        <div class="flex flex-col gap-10 text-white">
            <h1>Liste des blocs</h1>
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="border px-4 py-2">Nom de la salle</th>
                        <th class="border px-4 py-2">Statut</th>
                        <th class="border px-4 py-2">Difficulté</th>
                        <th class="border px-4 py-2">Media</th>
                        <th class="border px-4 py-2">Description</th>
                        <th class="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="bloc in blocs" :key="bloc.id">
                        <td class="border px-4 py-2">{{ bloc.salle_name }}</td>
                        <td class="border px-4 py-2">{{ bloc.statut }}</td>
                        <td class="border px-4 py-2">{{ bloc.couleur }}</td>
                        <td class="border px-4 py-2">
                            <img :src="`/uploads/${bloc.media}`" :alt="`bloc ${bloc.couleur} à ${bloc.salle_name}`"
                                class="w-20 h-20 rounded object-cover">
                        </td>
                        <td class="border px-4 py-2">{{ bloc.note }}</td>
                        <td class="border px-4 py-2">
                            <button class="bg-red-500 p-3 rounded-2xl w-fit"
                                @click="deleteBloc(bloc.id)">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <NuxtLink to="/newBloc" class="bg-blue-500 p-3 rounded-2xl w-fit">Nouveau bloc</NuxtLink>
        </div>
    </div>
</template>