<script setup lang="ts">
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { useProfilePicture } from "~/composables/useProfilePicture";

const { uploadProfilePicture } = useProfilePicture();
const { user } = useUserSession(); // ❌ Supprime `fetch`
const fileInput = ref<HTMLInputElement | null>(null);
const image = ref<string | null>(null);
const profile_picture = computed(() => user.value?.profile_picture || null);
const cropper = ref<InstanceType<typeof Cropper> | null>(null);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      image.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const cropImage = async () => {
  if (!cropper.value) return;

  const result = cropper.value.getResult();
  if (!result || !result.canvas) {
    console.error("❌ Erreur : Impossible d'obtenir le canvas.");
    return;
  }

  const { canvas } = result;

  canvas.toBlob(async (blob: Blob | null) => {
    if (!blob) {
      console.error("❌ Erreur : Impossible de convertir l'image en Blob.");
      return;
    }

    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
    const isUpdate = user.value?.profile_picture !== null;

    const newProfilePicture = await uploadProfilePicture(file, isUpdate);

    if (newProfilePicture) {
      console.log("✅ Nouvelle image enregistrée :", newProfilePicture);

      if (user.value) {
        user.value.profile_picture = newProfilePicture;
      }

      image.value = null;
    }
  }, "image/jpeg");
};
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Placeholder pour sélectionner une nouvelle image -->
    <div class="group relative">
      <label
        for="fileInput"
        class="relative mt-10 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-neutral-900"
      >
        <img
          v-if="profile_picture"
          :src="profile_picture"
          class="h-full w-full object-cover"
        />
        <Icon
          v-else
          name="lucide:circle-user-round"
          class="text-9xl text-gray-400"
        />
        <input
          id="fileInput"
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        />
      </label>
      <Icon
        name="icon-park-twotone:add-one"
        class="absolute right-2 top-[80%] z-10 text-2xl opacity-50 transition-all duration-200 ease-in-out group-hover:opacity-100"
      />
    </div>

    <!-- Recadrage de l'image -->
    <div v-if="image" class="cropper-container flex flex-col items-center">
      <Cropper
        ref="cropper"
        :src="image"
        :stencil-props="{ aspectRatio: 1 }"
        class="cropper"
      />
      <button
        class="mt-4 cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-white"
        @click="cropImage"
      >
        Valider
      </button>
    </div>
  </div>
</template>
