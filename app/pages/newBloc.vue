<script setup lang="ts">
import { useSalles } from '@/composables/useSalles';
import { useBlocForm } from '@/composables/useBlocForm';

const { salles, fetchSalles } = useSalles();
const { salleId, essai, couleur, titre, description, date_validation, mediaFile, submitBloc } = useBlocForm();

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    mediaFile.value = target.files?.[0] || null;
}

onMounted(fetchSalles);
</script>

<template>
    <div class="flex flex-col items-center text-white mt-10">
        <h1 class="text-2xl mb-5">Ajouter un nouveau bloc</h1>
        <form class="flex flex-col gap-4 w-80" @submit.prevent="submitBloc">
            <label>
                Date de validation :
                <input v-model="date_validation" type="date" required>
            </label>

            <label>
                Salle :
                <select v-model="salleId" required>
                    <option value="" class="text-white" disabled>Sélectionnez une salle</option>
                    <option v-for="salle in salles" :key="salle.id" :value="salle.id" class="text-black">
                        {{ salle.name }}
                    </option>
                </select>
            </label>

            <label>
                Nb d'essais :
                <div class="flex flex-col">
                    <label>
                        <input v-model="essai" type="radio" value="Flash">
                        Flash
                    </label>
                    <label>
                        <input v-model="essai" type="radio" value="2-5">
                        Entre 2 et 5
                    </label>
                    <label>
                        <input v-model="essai" type="radio" value="6-9">
                        Entre 6 et 9
                    </label>
                    <label>
                        <input v-model="essai" type="radio" value="10+">
                        10 et plus
                    </label>
                </div>
            </label>

            <label>
                Difficulté (couleur) :
                <input v-model="couleur" type="text" placeholder="ex: Facile, Moyen, Difficile" required>
            </label>

            <label>
                Titre :
                <input v-model="titre" type="text" placeholder="ex: Bloc rouge" required>
            </label>

            <label>
                Description :
                <textarea v-model="description" placeholder="Ajoutez une description" />
            </label>

            <label>
                Image :
                <input type="file" accept="image/*" @change="handleFileChange">
            </label>

            <button type="submit" class="bg-blue-500 p-3 rounded-2xl">Ajouter le bloc</button>
        </form>
    </div>
</template>
