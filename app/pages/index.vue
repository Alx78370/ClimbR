<script setup lang="ts">
const { data: blocs } = await useFetch('/api/blocs');
</script>

<template>
    <div class="flex flex-col w-full justify-center items-center mt-10">
        <div class="text-white">
            <h1>Liste des blocs</h1>
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="border px-4 py-2">Nom de la salle</th>
                        <th class="border px-4 py-2">Réussi le</th>
                        <th class="border px-4 py-2">Difficulté</th>
                        <th class="border px-4 py-2">Media</th>
                        <th class="border px-4 py-2">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="bloc in blocs" :key="bloc.id">
                        <td class="border px-4 py-2">{{ bloc.salle_name }}</td>
                        <td class="border px-4 py-2">{{ bloc.date_success }}</td>
                        <td class="border px-4 py-2">{{ bloc.couleur }}</td>
                        <td class="border px-4 py-2">
                            <img :src="`/uploads/${bloc.media}`" :alt="`bloc ${bloc.couleur} à ${bloc.salle_name}`"
                                class="w-20 h-20 rounded" />
                        </td>
                        <td class="border px-4 py-2">{{ bloc.note }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>