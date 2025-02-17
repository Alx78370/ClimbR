<script setup lang="ts">
import { useSalles } from '@/composables/useSalles';
import { useBlocForm } from '@/composables/useBlocForm';

const { salles, fetchSalles } = useSalles();
const { salleId, essai, couleur, titre, type, description, date_validation, mediaFile, submitBloc } = useBlocForm();

const selectedFileName = ref("");

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] || null;

    if (file) {
        mediaFile.value = file;
        selectedFileName.value = file.name;
    }
}



onMounted(fetchSalles);
</script>

<template>
    <div class="flex flex-col items-center text-white mt-10">
        <h1 class="text-2xl mb-5">Ajouter un nouveau bloc</h1>
        <form class="flex flex-col gap-4 w-96" @submit.prevent="submitBloc">
            <label>
                Date de validation :
                <br>
                <input v-model="date_validation" type="date" required
                    class="border-2 border-white text-[#858585] rounded-2xl p-2 w-full">
            </label>

            <label>
                Salle :
                <select v-model="salleId" required class="border-2 border-white rounded-2xl p-2 w-full text-[#858585]">
                    <option :value="null" disabled>Sélectionnez une salle</option>
                    <option v-for="salle in salles" :key="salle.id" :value="salle.id" class="text-black">
                        {{ salle.name }}
                    </option>
                </select>
            </label>

            <label>
                Titre :
                <br>
                <input v-model="titre" type="text" placeholder="Ajouter un titre" required
                    class="border-2 border-white rounded-2xl p-2 w-full">
            </label>

            <label>
                Description :
                <br>
                <textarea v-model="description" placeholder="Ajoutez une description"
                    class="border-2 border-white rounded-2xl p-2 w-full" />
            </label>

            <label>
                Nb d'essais :
                <div class="flex w-full justify-between">
                    <div class="flex flex-col">
                        <label>
                            <input v-model="essai" type="radio" value="Flash">
                            Flash
                        </label>
                        <label>
                            <input v-model="essai" type="radio" value="2-5">
                            Entre 2 et 5
                        </label>
                    </div>
                    <div class="flex flex-col">
                        <label>
                            <input v-model="essai" type="radio" value="6-9">
                            Entre 6 et 9
                        </label>
                        <label>
                            <input v-model="essai" type="radio" value="10+">
                            10 et plus
                        </label>
                    </div>
                </div>
            </label>

            <label>
                Difficulté (couleur) :
                <select v-model="couleur" required class="border-2 border-white rounded-2xl p-2 w-full text-[#858585]">
                    <option value="" disabled>Sélectionnez une couleur</option>
                    <option value="jaune" class="text-black">Jaune</option>
                    <option value="orange" class="text-black">Orange</option>
                    <option value="vert" class="text-black">Vert</option>
                    <option value="bleu" class="text-black">Bleu</option>
                    <option value="rose" class="text-black">Rose</option>
                    <option value="rouge" class="text-black">Rouge</option>
                    <option value="noir" class="text-black">Noir</option>
                    <option value="violet" class="text-black">Violet</option>
                </select>
            </label>

            <label>
                Type de bloc :
                <br>
                <select v-model="type" required class="border-2 border-white rounded-2xl p-2 w-full text-[#858585]">
                    <option value="" disabled>Sélectionnez un type de bloc</option>
                    <option value="dalle" class="text-black">Dalle</option>
                    <option value="vertical" class="text-black">Vertical</option>
                    <option value="leger_devers" class="text-black">Léger dévers</option>
                    <option value="gros_devers" class="text-black">Gros dévers</option>
                    <option value="toit" class="text-black">Toit</option>
                    <option value="diedre" class="text-black">Dièdre</option>
                    <option value="arete" class="text-black">Arête</option>
                </select>
            </label>

            <label>
                Image :
                <div class="flex items-center gap-2 cursor-pointer border-2 border-white text-white p-2 rounded-2xl ">
                    <div class="flex items-center gap-2">
                        <Icon name="heroicons-solid:photograph" class="text-white text-2xl" />
                        <p v-if="selectedFileName" class="text-sm text-[#858585]">{{ selectedFileName }}</p>
                        <p v-else class="text-[#858585]">Choisir une image</p>
                    </div>
                    <input type="file" accept="image/*" class="hidden" @change="handleFileChange">
                </div>
            </label>

            <button type="submit"
                class="bg-orange-500 p-3 rounded-2xl cursor-pointer font-bold hover:scale-105 hover:ease-in-out hover:duration-300 transition-all">Ajouter
                le
                bloc</button>
        </form>
    </div>
</template>
