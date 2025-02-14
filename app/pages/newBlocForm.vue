<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Salle } from "../../types/salle";
import type { Bloc } from "../../types/bloc";

const router = useRouter()

// Champs du formulaire
const salleId = ref<number | null>(null)
const statut = ref<'en cours' | 'complété' | 'non complété'>('en cours')
const couleur = ref('')
const note = ref('')
const mediaFile = ref<File | null>(null);

// Récupération des salles pour le formulaire
const salles = ref<Salle[]>([])
const { data: sallesData } = await useFetch('/api/salles')
if (sallesData.value) {
    salles.value = sallesData.value
}

async function submitForm() {
    const formData = new FormData()
    formData.append('salle_id', salleId.value?.toString() || '')
    formData.append('statut', statut.value)
    formData.append('couleur', couleur.value)
    formData.append('note', note.value)
    if (mediaFile.value) {
        formData.append('media', mediaFile.value)
    }

    try {
        await useFetch<Bloc[]>('/api/blocs', {
            method: 'POST',
            body: formData,
        })
        router.push('/')
    } catch (error) {
        console.error("Erreur lors de l'ajout du bloc:", error)
    }
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    mediaFile.value = target.files?.[0] ?? null;
}

</script>

<template>
    <div class="flex flex-col items-center text-white mt-10">
        <h1 class="text-2xl mb-5">Ajouter un nouveau bloc</h1>
        <form @submit.prevent="submitForm" class="flex flex-col gap-4 w-80">
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
                Statut :
                <div class="flex flex-col">
                    <label>
                        <input type="radio" value="en cours" v-model="statut" />
                        En cours
                    </label>
                    <label>
                        <input type="radio" value="complété" v-model="statut" />
                        Complété
                    </label>
                    <label>
                        <input type="radio" value="non complété" v-model="statut" />
                        Non complété
                    </label>
                </div>
            </label>

            <label>
                Difficulté (couleur) :
                <input type="text" v-model="couleur" placeholder="ex: Facile, Moyen, Difficile" required />
            </label>

            <label>
                Description :
                <textarea v-model="note" placeholder="Ajoutez une description"></textarea>
            </label>

            <label>
                Image :
                <input type="file" @change="handleFileChange" accept="image/*" required />
            </label>

            <button type="submit" class="bg-blue-500 p-3 rounded-2xl">Ajouter le bloc</button>
        </form>
    </div>
</template>
