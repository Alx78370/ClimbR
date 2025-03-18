<script setup lang="ts">
import { useSalles } from "@/composables/useSalles";
import { useBlocForm } from "@/composables/useBlocForm";
import authMiddleware from "../../../middleware/auth";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const { salles, fetchSalles } = useSalles();
const bloc = ref(null);
const {
  salleId,
  essai,
  couleur,
  titre,
  type,
  description,
  date_validation,
  mediaFile,
  submitBloc,
} = useBlocForm(bloc);
const fileInput = ref<HTMLInputElement | null>(null);
const image = ref<string | null>(null);
const croppedImage = ref<string | null>(null);
const cropper = ref<InstanceType<typeof Cropper> | null>(null);
const selectedFileName = ref("");

definePageMeta({
  middleware: [authMiddleware],
});

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

// Fonction pour recadrer l'image et la stocker
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
      // Convertir en File pour l'upload
      const file = new File([blob], "bloc_image.jpg", { type: "image/jpeg" });
      croppedImage.value = URL.createObjectURL(blob);

      // Mettre à jour mediaFile pour l'upload
      mediaFile.value = file;
    }
  }, "image/jpeg");

  // Fermer le Cropper
  image.value = null;
};

onMounted(fetchSalles);
</script>

<template>
  <div class="flex flex-col items-center text-white">
    <h1 class="mb-5 text-2xl">Ajouter un nouveau bloc</h1>
    <form
      class="flex w-[600px] flex-col gap-4 rounded bg-neutral-900 p-5"
      @submit.prevent="submitBloc"
    >
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
            class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-2xl text-white"
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
          placeholder="Ajouter un titre"
          required
          class="w-full rounded-lg border-2 border-white p-2"
        />
      </label>

      <label>
        Description :
        <br />
        <textarea
          v-model="description"
          placeholder="Ajoutez une description"
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
        <input
          v-show="!image"
          ref="fileInput"
          type="file"
          accept="image/*"
          class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-2 border-white p-2 text-white file:hidden"
          @change="onFileChange"
        />

        <!-- Affichage du Cropper une fois l'image sélectionnée -->
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
        Ajouter le bloc
      </button>
    </form>
  </div>
</template>
