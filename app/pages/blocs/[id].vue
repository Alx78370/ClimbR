<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useSalles } from "@/composables/useSalles";
import { useBlocForm } from "@/composables/useBlocForm";

const route = useRoute();
const blocId = route.params.id;
const { salles, fetchSalles } = useSalles();
const bloc = ref(null);
const isLoading = ref(true);

async function fetchBloc() {
    try {
        bloc.value = await $fetch(`/api/blocs/${blocId}`);
        isLoading.value = false;
    } catch (error) {
        console.error("Erreur lors du chargement du bloc :", error);
    }
}

onMounted(async () => {
    await fetchSalles();
    await fetchBloc();
});

const { salleId, essai, couleur, titre, type, description, date_validation, mediaFile, submitBloc } = useBlocForm(bloc.value);
</script>

<template>
    <div v-if="isLoading" class="text-white text-center mt-10">Chargement...</div>

    <div v-else class="flex flex-col items-center text-white mt-10">
        <h1 class="text-2xl mb-5">Modifier le bloc</h1>
        <form class="flex flex-col gap-4 w-80" @submit.prevent="submitBloc">
            <label>
                Date de validation :
                <input v-model="date_validation" type="date" required>
            </label>

            <label>
                Salle :
                <select v-model="salleId" required>
                    <option value="" disabled>Sélectionnez une salle</option>
                    <option v-for="salle in salles" :key="salle.id" :value="salle.id">
                        {{ salle.name }}
                    </option>
                </select>
            </label>

            <label>
                Nb d'essais :
                <div class="flex flex-col">
                    <label><input v-model="essai" type="radio" value="Flash"> Flash</label>
                    <label><input v-model="essai" type="radio" value="2-5"> 2-5</label>
                    <label><input v-model="essai" type="radio" value="6-9"> 6-9</label>
                    <label><input v-model="essai" type="radio" value="10+"> 10+</label>
                </div>
            </label>

            <label>
                Difficulté (couleur) :
                <input v-model="couleur" type="text" required>
            </label>

            <label>
                Titre :
                <input v-model="titre" type="text" required class="text-white">
            </label>

            <label>
                Description :
                <textarea v-model="description"></textarea>
            </label>

            <label>
                Type de bloc :
                <select v-model="type" required>
                    <option value="dalle">Dalle</option>
                    <option value="vertical">Vertical</option>
                    <option value="leger_devers">Léger dévers</option>
                    <option value="gros_devers">Gros dévers</option>
                    <option value="toit">Toit</option>
                    <option value="diedre">Dièdre</option>
                    <option value="arete">Arête</option>
                </select>
            </label>

            <label>
                Image :
                <input type="file" accept="image/*">
            </label>

            <button type="submit" class="bg-green-500 p-3 rounded-2xl">Mettre à jour</button>
        </form>
    </div>
</template>
