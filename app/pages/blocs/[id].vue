<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSalles } from "@/composables/useSalles";
import { useBlocForm } from "@/composables/useBlocForm";
import authMiddleware from "../../../middleware/auth";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const route = useRoute();
const blocId = route.params.id;
const { salles, fetchSalles } = useSalles();
const bloc = ref(null);
const isLoading = ref(true);

definePageMeta({
  middleware: [authMiddleware],
});

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

const {
  salleId,
  essai,
  couleur,
  titre,
  type,
  description,
  date_validation,
  mediaFile,
  mediaFileName,
  selectedFileName,
  submitBloc,
} = useBlocForm(bloc);

const fileInput = ref<HTMLInputElement | null>(null);
const image = ref<string | null>(null);
const croppedImage = ref<string | null>(null);
const cropper = ref<InstanceType<typeof Cropper> | null>(null);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    selectedFileName.value = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      image.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// ✅ Fonction pour recadrer l'image
const cropImage = async () => {
  if (!cropper.value) return;

  const result = cropper.value.getResult();
  if (!result || !result.canvas) {
    console.error("❌ Erreur : Impossible d'obtenir le canvas.");
    return;
  }

  const { canvas } = result;

  canvas.toBlob(async (blob: Blob | null) => {
    if (blob) {
      const file = new File([blob], "bloc_image.jpg", { type: "image/jpeg" });
      croppedImage.value = URL.createObjectURL(blob);

      // ✅ Mettre à jour mediaFile pour soumettre la nouvelle image
      mediaFile.value = file;
    }
  }, "image/jpeg");

  // ✅ Fermer le Cropper
  image.value = null;
};
</script>

<template>
  <div v-if="isLoading" class="mt-10 text-center text-white">Chargement...</div>

  <div v-else class="flex flex-col items-center text-white">
    <h1 class="mb-5 text-2xl">Modifier le bloc</h1>
    <form class="flex w-96 flex-col gap-4" @submit.prevent="submitBloc">
      <label>
        Date de validation :
        <br />
        <div
          class="relative w-full appearance-none rounded-lg border-2 border-white p-2"
        >
          <input
            v-model="date_validation"
            type="date"
            required
            class="focus-border-0 w-full border-0 bg-transparent focus:outline-none"
            :class="date_validation ? 'text-white' : 'text-[#858585]'"
          />
          <Icon
            name="heroicons-solid:calendar"
            class="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-2xl text-white"
          />
        </div>
      </label>

      <label>
        Salle :
        <select
          v-model="salleId"
          required
          class="w-full rounded-lg border-2 border-white p-2"
          :class="salleId ? 'text-white' : 'text-[#858585]'"
        >
          <option :value="null" disabled>Sélectionnez une salle</option>
          <option
            v-for="salle in salles"
            :key="salle.id"
            :value="salle.id"
            class="text-black"
          >
            {{ salle.name }}
          </option>
        </select>
      </label>

      <label>
        Titre :
        <br />
        <input
          v-model="titre"
          type="text"
          placeholder="Modifier le titre"
          required
          class="w-full rounded-lg border-2 border-white p-2"
        />
      </label>

      <label>
        Description :
        <br />
        <textarea
          v-model="description"
          placeholder="Modifier la description"
          class="w-full rounded-lg border-2 border-white p-2"
        ></textarea>
      </label>

      <label>
        Nb d'essais :
        <div class="flex w-full justify-between">
          <div class="flex flex-col">
            <label>
              <input v-model="essai" type="radio" value="Flash" />
              Flash
            </label>
            <label>
              <input v-model="essai" type="radio" value="2-5" />
              Entre 2 et 5
            </label>
          </div>
          <div class="flex flex-col">
            <label>
              <input v-model="essai" type="radio" value="6-9" />
              Entre 6 et 9
            </label>
            <label>
              <input v-model="essai" type="radio" value="10+" />
              10 et plus
            </label>
          </div>
        </div>
      </label>

      <label>
        Difficulté (couleur) :
        <select
          v-model="couleur"
          required
          class="w-full rounded-lg border-2 border-white p-2"
          :class="couleur ? 'text-white' : 'text-[#858585]'"
        >
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
        <br />
        <select
          v-model="type"
          required
          class="w-full rounded-lg border-2 border-white p-2"
          :class="type ? 'text-white' : 'text-[#858585]'"
        >
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

      <div>
        Image :
        <br />
        <!-- Affichage de l’image actuelle si elle existe -->
        <img
          v-if="!image && mediaFileName"
          :src="`${mediaFileName}`"
          alt="Image du bloc"
          class="h-[300px] w-full rounded-lg object-cover"
        />

        <!-- Input de fichier pour changer l'image -->
        <input
          v-show="!image"
          ref="fileInput"
          type="file"
          accept="image/*"
          class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-2 border-white p-2 text-white file:hidden"
          @change="onFileChange"
        />

        <!-- Recadrage de l'image -->
        <div
          v-if="image"
          class="relative mb-16 flex h-[300px] w-full flex-col items-center"
        >
          <Cropper
            ref="cropper"
            :src="image"
            :stencil-props="{ aspectRatio: 1 }"
            class="cropper"
          />
          <div class="mt-4 flex gap-4">
            <button
              class="cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-white"
              @click="cropImage"
            >
              Valider
            </button>
            <button
              class="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-white"
              @click="image = null"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="cursor-pointer rounded-lg bg-orange-500 p-3 font-bold transition-all hover:scale-105 hover:duration-300 hover:ease-in-out"
      >
        Mettre à jour
      </button>
    </form>
  </div>
</template>
